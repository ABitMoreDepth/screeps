export function equals(array1: any[], array2: any[]): boolean {
  // if the arrays are a falsy value, return
  if (!array1 || !array2) {
    return false;
  }

  // compare lengths - can save a lot of time
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0, l = array1.length; i < l; i++) {
    // Check if we have nested arrays
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!array1[i].equals(array2[i])) {
        return false;
      }
    } else if (array1[i] !== array2[i]) {
      // Warning - two different object instances will never be
      // equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}

export function harvest_nearest_energy(creep: Creep): boolean {
  const source: Source | null = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  if (source === null) {
    return false;
  }

  if (creep.harvest(source as Source) === ERR_NOT_IN_RANGE) {
    creep.moveTo(source as Source);
  }
  return true;
}

export function find_nearest_energy_collection_point(
  creep: Creep,
): StructureStorage | StructureContainer | StructureSpawn | null {
  let source: RoomObject | null = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (structure) =>
      structure.structureType === STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 0,
  });
  if (source !== null) {
    return null;
  }

  source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (structure) =>
      structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0,
  });
  if (source !== null) {
    return source as StructureContainer;
  }

  source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (structure) =>
      (structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_EXTENSION) &&
      structure.energy >= structure.energyCapacity * 0.8,
  });
  if (source !== null) {
    return source as StructureSpawn;
  }
  return null;
}

export function collectNearestEnergy(creep: Creep): void {
  const source = find_nearest_energy_collection_point(creep);
  if (source) {
    if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  } else {
    goRelax(creep);
  }
}

export function goRelax(creep: Creep): void {
  const flag = creep.pos.findClosestByRange(FIND_FLAGS);
  if (flag !== null) {
    creep.moveTo(flag);
  }
}

export function getSpawn(room?: Room): StructureSpawn | null {
  for (const i in Game.spawns) {
    const spawn = Game.spawns[i];
    if (room !== undefined) {
      if (spawn.room === room) {
        return spawn;
      } else {
        continue;
      }
    } else {
      return Game.spawns[i];
    }
  }
  return null;
}

export function get_flag(): Flag | null {
  for (const i in Game.flags) {
    return Game.flags[i];
  }
  return null;
}

export function get_full_extractor(creep: Creep): Creep | null {
  const source = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: (extractor) => {
      return extractor.memory.role === "harvester" && extractor.carry[RESOURCE_ENERGY] > 0;
    },
  });

  if (source !== null) {
    // let fullest = _.max(source)
    // if (fullest === '-Infinity') {
    //   return
    // } else {
    //   console.log('Returning Fullest creep!')
    //   return fullest;
    // }
    return source;
  } else {
    return null;
  }
}
