import { go_relax, collect_nearest_energy } from './utils';

if (!Memory.population) {
  Memory.population = {
    builder: 2,
  }
} else if (!Memory.population.builder) {
  Memory.population['builder'] = 2
}

export function builder(creep: Creep) {
  if (creep.memory.state && creep.carry.energy == 0) {
    creep.memory.state = false
  }
  if (!creep.memory.state && creep.carry.energy == creep.carryCapacity) {
    creep.memory.state = true
  }

  if (creep.memory.state) {
    let buildTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
    if (buildTarget !== null) {
      if (creep.build(buildTarget) == ERR_NOT_IN_RANGE) {
        creep.moveTo(buildTarget);
        return;
      }
    }

    let repairTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (
        structure.hits < structure.hitsMax * 0.95 &&
        structure.structureType != STRUCTURE_WALL &&
        structure.structureType != STRUCTURE_RAMPART
      )
    })
    if (repairTarget !== null) {
      if (creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
        creep.moveTo(repairTarget)
        return;
      }
    }

    repairTarget = creep.pos.findClosestByRange(FIND_STRUCTURES,
      {
        filter: (structure) => (
          structure.hits <= Memory.defense.wall_health &&
          (structure.structureType == STRUCTURE_WALL ||
            structure.structureType == STRUCTURE_RAMPART)
        )
      }
    )
    if (repairTarget !== null) {
      if (creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
        creep.moveTo(repairTarget)
        return;
      }

      go_relax(creep);
    }
  }
  else {
    collect_nearest_energy(creep);
  }
}
