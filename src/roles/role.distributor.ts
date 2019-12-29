import { find_nearest_energy_collection_point, get_full_extractor } from '../utils/common';

if (!Memory.population) {
  Memory.population = {
    distributor: 0,
  };
} else if (!Memory.population.distributor) {
  Memory.population.distributor = 2;
}

export function distributor(creep: Creep) {
  if (creep.memory.state && creep.carry.energy === 0) {
    creep.memory.state = false;
  }
  if (!creep.memory.state && creep.carry.energy === creep.carryCapacity) {
    creep.memory.state = true;
  }

  if (!creep.memory.state) {
    const source = get_full_extractor(creep);
    if (source !== null) {
      console.log(JSON.stringify(source));
      if (source.transfer(creep, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
    else {
      const source = find_nearest_energy_collection_point(creep);

      if (source !== null) {
        if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      }
    }
  }

  if (creep.memory.state) {
    const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          (structure.structureType === STRUCTURE_EXTENSION
            || structure.structureType === STRUCTURE_SPAWN)
          && structure.energy < structure.energyCapacity);
      }
    });
    if (target) {
      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
    else {
      const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType === STRUCTURE_TOWER)
            && structure.energy < structure.energyCapacity
          );
        }
      });
      if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
      else {
        creep.moveTo(Game.flags.Chillout);
      }
    }
  }
}
