import { goRelax, harvest_nearest_energy } from '../utils/common';

if (!Memory.population) {
  Memory.population = {
    harvester: 6,
  };
} else if (!Memory.population.harvester) {
  Memory.population.harvester = 6;
}

export function harvester(creep: Creep) {
  if (creep.memory.state === undefined || !creep.memory.state.toString().match(/^harvest|fillup$/)) {
    creep.memory.state = 'fillup';
  }

  if (creep.memory.state === 'fillup' && creep.carry.energy === 0) {
    creep.memory.state = 'harvest';
  }

  if (creep.carry.energy === creep.carryCapacity) {
    creep.memory.state = 'fillup';
  }

  if (creep.memory.state === 'fillup') {
    const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType === STRUCTURE_TOWER &&
          structure.energy < structure.energyCapacity * 0.9
        );
      }
    });
    if (target !== null) {
      if (creep.transfer(target as StructureTower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
    else {
      const target: RoomObject | null = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType === STRUCTURE_EXTENSION
              || structure.structureType === STRUCTURE_SPAWN)
            && structure.energy < structure.energyCapacity);
        }
      });
      if (target !== null) {
        if (creep.transfer(target as StructureSpawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
      else {
        const target: RoomObject | null = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              (structure.structureType === STRUCTURE_STORAGE
                || structure.structureType === STRUCTURE_CONTAINER)
              && structure.store[RESOURCE_ENERGY]
              < structure.storeCapacity
            );
          }
        });
        if (target !== null) {
          if (creep.transfer(target as StructureStorage | StructureContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
        } else {
          goRelax(creep);
        }
      }
    }
  }
  else {
    let target: RoomObject | null = creep.pos.findClosestByPath(FIND_RUINS, {
      filter: (ruin: Ruin) => {
        return ruin.store.energy > 0;
      }
    });
    if (target !== null) {
      if (creep.withdraw(target as Ruin, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
      return;
    }

    target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
      filter: (tomb: Tombstone) => {
        return tomb.store.energy > 0;
      }
    });
    if (target !== null) {
      if (creep.withdraw(target as Tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
      return;
    }

    const targetResource: Resource | null = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
      filter: (resource: Resource) => {
        return (resource.resourceType === RESOURCE_ENERGY && resource.amount > 50);
      }
    });
    if (targetResource !== null) {
      if (creep.pickup(targetResource) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targetResource);
      }
      return;
    }

    harvest_nearest_energy(creep);
  }
}

class HarversterRole implements CreepBehaviour {
  public creep: Creep;
  constructor(creep: Creep) {
    if (!Memory.population) {
      Memory.population = {
        harvester: 6,
      };
    } else if (!Memory.population.harvester) {
      Memory.population.harvester = 6;
    }
    this.creep = creep;
  }

  public run() {
    harvester(this.creep);
  }
}
