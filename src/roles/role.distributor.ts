import { find_nearest_energy_collection_point, get_full_extractor, goRelax } from '../utils/common';

if (!Memory.population) {
  Memory.population = {
    distributor: 0,
  };
} else if (!Memory.population.distributor) {
  Memory.population.distributor = 2;
}

export function distributor(creep: Creep) {
  if (creep.memory.state === undefined || !creep.memory.state.toString().match(/^distribute|refill$/)) {
    creep.memory.state = 'refill';
  }
  if (creep.memory.state === 'distribute' && creep.carry.energy === 0) {
    creep.memory.state = 'refill';
  }
  if (creep.memory.state !== 'distribute' && creep.carry.energy === creep.carryCapacity) {
    creep.memory.state = 'distribute';
  }

  if (creep.memory.state === 'refill') {
    const extractorSource = get_full_extractor(creep);
    if (extractorSource !== null) {
      // console.log(JSON.stringify(extractorSource));
      if (extractorSource.transfer(creep, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(extractorSource);
      }
      return;
    }

    const source = find_nearest_energy_collection_point(creep);
    if (source !== null) {
      if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
      return;
    }
  }

  if (creep.memory.state === 'distribute') {
    const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        switch (structure.structureType) {
          case STRUCTURE_EXTENSION:
          case STRUCTURE_SPAWN:
            return structure.energy < structure.energyCapacity;
          case STRUCTURE_TOWER:
            return structure.energy < structure.energyCapacity;
          case STRUCTURE_CONTAINER:
            return structure.store.energy < structure.store.getCapacity(RESOURCE_ENERGY);
          default:
            return false;
        }
      }
    });
    if (target !== null) {
      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
      return;
    }
    // target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    //   filter: (structure) => {
    //     return (
    //       (structure.structureType === STRUCTURE_TOWER)
    //       && structure.energy < structure.energyCapacity
    //     );
    //   }
    // });
    // if (target !== null) {
    //   if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    //     creep.moveTo(target);
    //   }
    //   return;
    // }
    // else {
    creep.moveTo(Game.flags.Chillout);
    // }
  }
}

class DistributorRole implements CreepBehaviour {
  public creep: Creep;

  constructor(creep: Creep) {
    if (!Memory.population) {
      Memory.population = {
        distributor: 0,
      };
    } else if (!Memory.population.distributor) {
      Memory.population.distributor = 2;
    }

    this.creep = creep;
    if (this.creep.memory.state === undefined || this.creep.memory.state !== 'refill') {
      this.creep.memory.state = 'refill';
    }
  }

  private isEmpty(): boolean {
    if (this.creep.carry.energy === 0) {
      this.creep.memory.state = 'refill';
      return true;
    }
    return false;
  }

  private isFull(): boolean {
    if (this.creep.carry.energy === this.creep.carryCapacity) {
      this.creep.memory.state = 'full';
      return true;
    }
    return false;
  }

  public run(): void {
    distributor(this.creep);
  }
}
