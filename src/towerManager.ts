export let towerManager = {
    run(tower: StructureTower, room: Room): void {
        const closestHostile: RoomObject | null = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile !== null) {
            tower.attack(closestHostile as Creep);
            return;
        }

        if (
            tower.store.getUsedCapacity(RESOURCE_ENERGY) <=
            tower.store.getCapacity(RESOURCE_ENERGY) * 0.9
        ) {
            // Don't deplete reserves on maintenance beyond 90%.
            return;
        }

        const closestDamagedCreep: RoomObject | null = tower.pos.findClosestByRange(FIND_CREEPS, {
            filter: (creep) => creep.hits < creep.hitsMax,
        });
        if (closestDamagedCreep !== null) {
            tower.heal(closestDamagedCreep as Creep);
            return;
        }

        const closestDamagedStructure: RoomObject | null = tower.pos.findClosestByRange(
            FIND_STRUCTURES,
            {
                filter: (structure) =>
                    structure.hits < structure.hitsMax * 0.95 &&
                    structure.structureType !== STRUCTURE_WALL &&
                    structure.structureType !== STRUCTURE_RAMPART,
            },
        );
        if (closestDamagedStructure !== null) {
            tower.repair(closestDamagedStructure as StructureWall | StructureRampart);
            return;
        }

        const maxoutTarget = room
            .lookForAtArea(LOOK_STRUCTURES, 0, 0, 49, 49, true)
            .map(({ structure }) => structure)
            .filter(
                ({ structureType }) =>
                    structureType === STRUCTURE_RAMPART || structureType === STRUCTURE_WALL,
            )
            .filter(({ hits }) => {
                const storage = room.storage;
                if (storage !== undefined && storage.store.energy > 100000) {
                    return true;
                } else {
                    return hits < Memory.defense.wall_health;
                }
            });
        if (maxoutTarget.length > 0) {
            const target = maxoutTarget.reduce((lowest, next) => {
                if (lowest.hits < next.hits) {
                    return lowest;
                } else {
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
    },
};
