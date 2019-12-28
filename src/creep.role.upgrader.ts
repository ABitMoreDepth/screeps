import { collect_nearest_energy } from './utils';

if (!Memory.population) {
  Memory.population = {
    upgrader: 2,
  }
} else if (!Memory.population.upgrader) {
  Memory.population.upgrader = 2
}

export function upgrader(creep: Creep) {

  if (creep.memory.upgrading && creep.carry.energy == 0) {
    creep.memory.upgrading = false
  }
  if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
    creep.memory.upgrading = true
  }

  if (creep.memory.upgrading) {
    let controller: StructureController | undefined = creep.room.controller;
    if (controller == undefined) {
      return;
    }

    if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(controller)
    }
  }
  else {
    collect_nearest_energy(creep)
  }
}
