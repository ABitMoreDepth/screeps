import { goRelax, harvest_nearest_energy } from '../utils/common';

if (!Memory.population) {
  Memory['population'] = {
    harvester: 6,
  }
} else if (!Memory.population.harvester) {
  Memory.population['harvester'] = 6
}

export function harvester(creep: Creep) {
  if (creep.memory.state && creep.carry.energy == 0) {
    creep.memory.state = false
  }
  if (!creep.memory.state && creep.carry.energy == creep.carryCapacity) {
    creep.memory.state = true
  }

  if (creep.memory.state) {
    let target: RoomObject | null = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_TOWER &&
          structure.energy < structure.energyCapacity * 0.9
        )
      }
    })
    if (target !== null) {
      if (creep.transfer(target as StructureTower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
      }
    }
    else {
      let target: RoomObject | null = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION
              || structure.structureType == STRUCTURE_SPAWN)
            && structure.energy < structure.energyCapacity)
        }
      })
      if (target !== null) {
        if (creep.transfer(target as StructureSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target)
        }
      }
      else {
        let target: RoomObject | null = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              (structure.structureType == STRUCTURE_STORAGE
                || structure.structureType == STRUCTURE_CONTAINER)
              && structure.store[RESOURCE_ENERGY]
              < structure.storeCapacity
            )
          }
        })
        if (target !== null) {
          if (creep.transfer(target as StructureStorage | StructureContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
          }
        } else {
          goRelax(creep)
        }
      }
    }
  }
  else {
    harvest_nearest_energy(creep)
  }
}
