import { get_full_extractor, find_nearest_energy_collection_point } from '../utils/common';

if (!Memory.population) {
  Memory.population = {
    hauler: 0,
  }
} else if (!Memory.population.hauler) {
  Memory.population.hauler = 0
}

export function hauler(creep: Creep) {
  if (creep.memory.state && creep.carry.energy == 0) {
    creep.memory.state = false;
  }
  if (!creep.memory.state && creep.carry.energy == creep.carryCapacity) {
    creep.memory.state = true;
  }

  if (!creep.memory.state) {
    let targetCreep: Creep | null = get_full_extractor(creep)
    if (targetCreep !== null) {
      console.log(JSON.stringify(targetCreep))
      if (targetCreep.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targetCreep);
      }
    }
    else {
      let source = find_nearest_energy_collection_point(creep)
      if (source !== null) {
        if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      }
    }
  }

  if (creep.memory.state) {
    let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          (structure.structureType == STRUCTURE_EXTENSION
            || structure.structureType == STRUCTURE_SPAWN)
          && structure.energy < structure.energyCapacity)
      }
    })
    if (target) {
      if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
      }
    }
    else {
      let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_TOWER)
            && structure.energy < structure.energyCapacity
          )
        }
      })
      if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target)
        }
      }
      else {
        creep.moveTo(Game.flags.Chillout)
      }
    }
  }
}
