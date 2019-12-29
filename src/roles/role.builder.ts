import { collectNearestEnergy, goRelax } from '../utils/common';

if (!Memory.population) {
  Memory.population = {
    builder: 4,
  };
} else if (!Memory.population.builder) {
  Memory.population.builder = 4;
}

export function builder(creep: Creep) {
  if (creep.memory.state === undefined || !creep.memory.state.toString().match(/^building|refill$/)) {
    creep.memory.state = 'refill';
  }

  if (creep.memory.state === 'building' && creep.carry.energy === 0) {
    creep.say('Need Fuel');
    creep.memory.state = 'refill';
  }
  if (creep.memory.state === 'refill' && creep.carry.energy === creep.carryCapacity) {
    creep.say('Lets build');
    creep.memory.state = 'building';
  }

  if (creep.memory.state === 'refill') {
    collectNearestEnergy(creep);
    return;
  }

  if (creep.memory.state === 'building') {
    const buildTarget: ConstructionSite | null = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if (buildTarget !== null) {
      if (creep.build(buildTarget) === ERR_NOT_IN_RANGE) {
        creep.moveTo(buildTarget);
      }
      return;
    }

    let repairTarget: Structure | null = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (
        structure.hits < structure.hitsMax * 0.95 &&
        structure.structureType !== STRUCTURE_WALL &&
        structure.structureType !== STRUCTURE_RAMPART
      )
    });
    if (repairTarget !== null) {
      if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
        creep.moveTo(repairTarget);
      }
      return;
    }

    repairTarget = creep.pos.findClosestByRange(FIND_STRUCTURES,
      {
        filter: (structure) => (
          structure.hits <= Memory.defense.wall_health &&
          (structure.structureType === STRUCTURE_WALL ||
            structure.structureType === STRUCTURE_RAMPART)
        )
      }
    );
    if (repairTarget !== null) {
      if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
        creep.moveTo(repairTarget);
      }
      return;
    }

    creep.say('Chilling');
    goRelax(creep);
  }
}

class BuilderRole implements CreepBehaviour {
  public creep: Creep;
  constructor(creep: Creep) {
    this.creep = creep;
  }

  public run() {
    builder(this.creep);
  }
}
