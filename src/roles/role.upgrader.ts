import { collectNearestEnergy, goRelax, } from '../utils/common';

if (!Memory.population) {
  Memory.population = {
    upgrader: 2,
  };
} else if (!Memory.population.upgrader) {
  Memory.population.upgrader = 2;
}

export function upgrader(creep: Creep) {
  if (creep.memory.state === 'upgrading' && creep.carry.energy === 0) {
    creep.memory.state = 'refill';
  }
  if (creep.memory.state !== 'upgrading' && creep.carry.energy === creep.carryCapacity) {
    creep.memory.state = 'upgrading';
  }

  if (creep.memory.state === 'upgrading') {
    const controller: StructureController | undefined = creep.room.controller;
    if (controller === undefined) {
      goRelax(creep);
      return;
    }

    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(controller);
    }
  }
  else {
    collectNearestEnergy(creep);
  }
}

class UpgraderRole implements CreepBehaviour {
  public creep: Creep;

  constructor(creep: Creep) {
    if (!Memory.population) {
      Memory.population = {
        upgrader: 2,
      };
    } else if (!Memory.population.upgrader) {
      Memory.population.upgrader = 2;
    }

    this.creep = creep;
    if (this.creep.memory.state === undefined || this.creep.memory.state !== 'refill') {
      this.creep.memory.state = 'refill';
    }
  }

  private isEmpty(): boolean {
    if (this.creep.memory.state === 'upgrading' && this.creep.carry.energy === 0) {
      return true;
    }
    return false;
  }

  private isFull(): boolean {
    if (this.creep.carry.energy === this.creep.carryCapacity) {
      return true;
    }
    return false;
  }

  public run() {
    upgrader(this.creep);
  }
}
