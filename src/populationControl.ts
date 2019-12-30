import { unitTypes } from "./creep.types";
import { equals, getSpawn } from "./utils/common";

// Schedule the creation of combat units, should they be necessary.
function handleFighters(currentRoom: Room) {
    const populationFighters = filterCreeps((creepName: string) => {
        const creep = Game.creeps[creepName];
        if (creep.memory.unit_type === "defender") {
            return true;
        }
        return false;
    });

    const neededFighters = Memory.population.defender || 0;

    if (populationFighters.length < neededFighters) {
        // We have a deficit of fighters, lets spawn some more!
        const spawn = getSpawn(currentRoom);
        if (spawn !== null) {
            const newby = spawn.createCreep(
                unitTypes.defender1.uBody,
                undefined,
                unitTypes.defender1.uMem,
            );
        }
    }
}

export function spawnUnits(currentRoom: Room) {
    const maxBuildEnergy = currentRoom.energyCapacityAvailable;
    // console.log(JSON.stringify(currentRoom));
    // console.log('max:', maxBuildEnergy, 'Available:',
    //   currentRoom.energyAvailable);
    let neededWorkers: number = 0;
    for (const workerType in Memory.population) {
        if (workerType === "defender") {
            continue;
        }
        neededWorkers += Memory.population[workerType];
    }

    const populationWorkers = filterCreeps((creepName) => {
        const creep = Game.creeps[creepName];
        return creep.memory.unit_type === "worker" && creep.memory.role !== "upgrade";
    });

    const populationRegenerates = filterCreeps((creepName) => {
        const creep = Game.creeps[creepName];
        return creep.memory.role === "regenerate";
    });

    console.log(`Needed Workers: ${neededWorkers}, Worker pop: ${populationWorkers.length}`);
    // console.log('Needed Fighters:', neededFighters, ', Fighter pop:',
    //   populationFighters.length);
    // console.log('Unknown Pop:', populationUnknown.length);
    if (populationWorkers.length < neededWorkers && populationRegenerates.length === 0) {
        // We have a deficit of workers, lets spawn some more!
        if (maxBuildEnergy >= unitTypes.worker3.uCost) {
            if (
                _.filter(Game.creeps, (creep) => creep.memory.role === Memory.socialStructure[0])
                    .length < Memory.population[Memory.socialStructure[0]]
            ) {
                // We shouldn't really get here, but in case all our units are
                // dead or something...
                console.log("Emergency Spawning lvl1 Worker");
                const spawn: StructureSpawn | null = getSpawn();
                if (spawn === null) {
                    return;
                }
                const newby = spawn.createCreep(
                    unitTypes.worker1.uBody,
                    undefined,
                    unitTypes.worker1.uMem,
                );
                return;
            }
            console.log("Spawning lvl3 Worker");
            const spawn = getSpawn();
            if (spawn !== null) {
                const newby = spawn.createCreep(
                    unitTypes.worker3.uBody,
                    undefined,
                    unitTypes.worker3.uMem,
                );
                console.log(newby);
            }
        } else if (maxBuildEnergy >= unitTypes.worker2.uCost) {
            if (
                _.filter(Game.creeps, (creep) => creep.memory.role === Memory.socialStructure[0])
                    .length < Memory.population[Memory.socialStructure[0]]
            ) {
                // We shouldn't really get here, but in case all our units are
                // dead or something...
                console.log("Emergency Spawning lvl1 Worker");
                const spawn = getSpawn();
                if (spawn !== null) {
                    const newby = spawn.createCreep(
                        unitTypes.worker1.uBody,
                        undefined,
                        unitTypes.worker1.uMem,
                    );
                    return;
                }
            }
            console.log("Spawning lvl2 Worker");
            const spawn = getSpawn();
            if (spawn !== null) {
                const newby = spawn.createCreep(
                    unitTypes.worker2.uBody,
                    undefined,
                    unitTypes.worker2.uMem,
                );
            }
        } else if (maxBuildEnergy >= unitTypes.worker1.uCost) {
            console.log("Spawning lvl1 Worker");
            const spawn = getSpawn();
            if (spawn !== null) {
                const newby = spawn.createCreep(
                    unitTypes.worker1.uBody,
                    undefined,
                    unitTypes.worker1.uMem,
                );
            }
        }
    }

    handleFighters(currentRoom);

    const populationUnknown = filterCreeps((creepName: string) => {
        const creep = Game.creeps[creepName];
        return creep.memory.unit_type === undefined;
    });
    handleUnknowns(populationUnknown);

    const mostImportantWorkers = _.filter(
        Game.creeps,
        (creep) =>
            creep.memory.role === Memory.socialStructure[0] ||
            creep.memory.role === Memory.socialStructure[1],
    );
    if (
        mostImportantWorkers.length >=
            Memory.population[Memory.socialStructure[0]] +
                Memory.population[Memory.socialStructure[1]] &&
        _.filter(Game.creeps, (creep) => creep.memory.role === "upgrade").length < 1
    ) {
        const worstCreep = _.min(mostImportantWorkers, (worker) => {
            return worker.memory.lvl;
        });
        const worstLevel = Number(worstCreep.memory.lvl);
        const maxLevel = 3;
        const nextLevel = worstLevel + 1 > maxLevel ? maxLevel : worstLevel + 1;
        // console.log(worstLevel, nextLevel, maxLevel)
        if (maxBuildEnergy > unitTypes["worker" + nextLevel].uCost) {
            if (worstCreep.memory.lvl && worstCreep.memory.lvl < nextLevel) {
                console.log(worstCreep.name, "is due for an upgrade!");
                worstCreep.memory.role = "upgrade";
            }
        }
    }
}

// Take a filter arrow function, return a Creep[]
function filterCreeps(filter: (creepName: string) => boolean): Creep[] {
    const populationWorkers = Object.keys(Game.creeps)
        .filter(filter)
        .map((creepName) => Game.creeps[creepName]);
    return populationWorkers;
}

// Lets try to ID these things that don't have unitTypes definitions
function handleUnknowns(populationUnknown: Creep[]) {
    if (populationUnknown.length > 0) {
        for (const i in populationUnknown) {
            const creep = populationUnknown[i];
            const bodyStyle = creep.body.map((val) => {
                return val.type;
            });
            for (const creepType in unitTypes) {
                console.log(unitTypes[creepType].uBody);
                if (equals(bodyStyle, unitTypes[creepType].uBody)) {
                    console.log("Identified a creep!");
                    creep.memory = unitTypes[creepType].uMem;
                }
            }
        }
    }
}