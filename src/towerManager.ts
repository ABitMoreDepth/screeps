export let towerManager = {
  run(tower: StructureTower, room: Room): void {
    const closestHostile: RoomObject | null = tower.pos.findClosestByRange(
      FIND_HOSTILE_CREEPS
    );
    if (closestHostile !== null) {
      tower.attack(closestHostile as Creep);
      return;
    }

    const closestDamagedCreep: RoomObject | null = tower.pos.findClosestByRange(
      FIND_CREEPS, {
      filter: (creep) => creep.hits < creep.hitsMax
    }
    );
    if (closestDamagedCreep !== null) {
      tower.heal(closestDamagedCreep as Creep);
      return;
    }

    const closestDamagedStructure: RoomObject | null = tower.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (structure) => (
          structure.hits < structure.hitsMax * 0.95 &&
          structure.structureType !== STRUCTURE_WALL &&
          structure.structureType !== STRUCTURE_RAMPART
        )
      }
    );
    if (closestDamagedStructure !== null) {
      tower.repair(closestDamagedStructure as StructureWall | StructureRampart);
      return;
    }

    const closestDamagedRampart = room.lookForAtArea(
      LOOK_STRUCTURES, 0, 0, 49, 49, true)
      .map(({ structure }) => structure)
      .filter(({ structureType }) =>
        structureType === STRUCTURE_RAMPART)
      .filter(({ hits }) => hits
        < Memory.defense.wall_health);
    if (closestDamagedRampart.length > 0) {
      const target = closestDamagedRampart.reduce((lowest, next) => {
        if (lowest.hits < next.hits) {
          return lowest;
        }
        else {
          return next;
        }
      });
      tower.repair(target);
      return;
    }

    const closestDamagedWall = room.lookForAtArea(
      LOOK_STRUCTURES, 0, 0, 49, 49, true)
      .map(({ structure }) => structure)
      .filter(({ structureType }) =>
        structureType === STRUCTURE_WALL)
      .filter(({ hits }) => hits
        < Memory.defense.wall_health);
    if (closestDamagedWall.length > 0) {
      const target = closestDamagedWall.reduce((lowest, next) => {
        if (lowest.hits < next.hits) {
          return lowest;
        }
        else {
          return next;
        }
      });
      tower.repair(target);
      return;
    }
  },

  manage(room: Room): void {
    for (const name in Game.structures) {
      if (Game.structures[name].structureType === STRUCTURE_TOWER) {
        const tower: StructureTower = Game.structures[name] as StructureTower;
        this.run(tower, room);
      }
    }
  }
};
