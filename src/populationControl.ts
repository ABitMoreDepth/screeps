import { unitTypes } from "./creep.types";
import { Worker } from "./creepTypes/WorkerType";
import { equals, filterCreeps, getSpawn } from "./utils/common";

// Schedule the creation of combat units, should they be necessary.
function handleFighters(currentRoom: Room) {
    const populationFighters = filterCreeps((creep) => creep.memory.unit_type === "defender");

    const neededFighters = Memory.population.defender || 0;

    if (populationFighters.length < neededFighters) {
        // We have a deficit of fighters, lets spawn some more!
        const spawn = getSpawn(currentRoom);
        if (spawn !== null) {
            spawn.createCreep(unitTypes.defender1.uBody, undefined, unitTypes.defender1.uMem);
        }
    }
}

function handleWorkers(currentRoom: Room) {
    const spawn = getSpawn(currentRoom);
    const populationWorkers = filterCreeps(
        (creep) => creep.memory.unit_type === "worker" && creep.memory.role !== "upgrade",
    );

    let neededWorkers: number = 0;
    for (const workerType in Memory.population) {
        if (workerType === "defender") {
            continue;
        }
        neededWorkers += Memory.population[workerType];
    }

    const populationRegenerates = filterCreeps((creep) => creep.memory.role === "regenerate");

    console.log(`Needed Workers: ${neededWorkers}, Worker pop: ${populationWorkers.length}`);

    const maxBuildEnergy = currentRoom.energyAvailable;

    if (populationWorkers.length < neededWorkers) {
        console.log(`Attempting to build a creep. ${maxBuildEnergy} energy available`);
        // We have a deficit of workers, lets spawn some more!
        const maxLevel = Worker.maxLevel(maxBuildEnergy);
        const newWorker = new Worker(maxLevel);
        if (spawn !== null && maxLevel > 0) {
            console.log(`Attempting to spawn worker level: ${maxLevel}`);
            const newby = spawn.createCreep(newWorker.uBody, undefined, newWorker.uMem);
            console.log(newby);
        }
        // if (maxBuildEnergy >= worker3.uCost) {
        //     if (
        //         _.filter(Game.creeps, (creep) => creep.memory.role === Memory.socialStructure[0])
        //             .length < Memory.population[Memory.socialStructure[0]]
        //     ) {
        //         // We shouldn't really get here, but in case all our units are
        //         // dead or something...
        //         console.log("Emergency Spawning lvl1 Worker");
        //         if (spawn === null) {
        //             return;
        //         }
        //         spawn.createCreep(worker1.uBody, undefined, worker1.uMem);
        //         return;
        //     }
        //     console.log("Spawning lvl3 Worker");
        //     if (spawn !== null) {
        //         const newby = spawn.createCreep(worker3.uBody, undefined, worker3.uMem);
        //         console.log(newby);
        //     }
        // } else if (maxBuildEnergy >= worker2.uCost) {
        //     if (
        //         _.filter(Game.creeps, (creep) => creep.memory.role === Memory.socialStructure[0])
        //             .length < Memory.population[Memory.socialStructure[0]]
        //     ) {
        //         // We shouldn't really get here, but in case all our units are
        //         // dead or something...
        //         console.log("Emergency Spawning lvl1 Worker");
        //         if (spawn !== null) {
        //             spawn.createCreep(worker1.uBody, undefined, worker1.uMem);
        //             return;
        //         }
        //     }
        //     console.log("Spawning lvl2 Worker");
        //     if (spawn !== null) {
        //         spawn.createCreep(worker2.uBody, undefined, worker2.uMem);
        //         return;
        //     }
        // } else if (maxBuildEnergy >= worker1.uCost) {
        //     console.log("Spawning lvl1 Worker");
        //     if (spawn !== null) {
        //         spawn.createCreep(worker1.uBody, undefined, worker1.uMem);
        //         return;
        //     }
        // } else {
        //     console.log("Something weird happened...");
        // }
    }
}

function handleUpgrades(currentRoom: Room) {
    const maxBuildEnergy = currentRoom.energyAvailable;

    const mostImportantWorkers = filterCreeps((creep) => {
        return (
            (creep.memory.role === Memory.socialStructure[0] ||
                creep.memory.role === Memory.socialStructure[1]) &&
            creep.room === currentRoom
        );
    });

    let neededWorkers: number = 0;
    for (const workerType in Memory.population) {
        if (workerType === "defender") {
            continue;
        }
        neededWorkers += Memory.population[workerType];
    }

    const populationWorkers = filterCreeps((creep) => creep.memory.unit_type === "worker").length;

    // if (
    //     mostImportantWorkers.length >=
    //         Memory.population[Memory.socialStructure[0]] +
    //             Memory.population[Memory.socialStructure[1]] &&
    //     _.filter(Game.creeps, (creep) => creep.memory.role === "upgrade").length < 1
    // ) {
    if (
        populationWorkers >= neededWorkers * 0.9 &&
        _.filter(Game.creeps, (creep) => creep.memory.role === "upgrade").length < 1
    ) {
        const worstCreep = _.min(mostImportantWorkers, (worker) => {
            return worker.memory.lvl;
        });
        const worstLevel = Number(worstCreep.memory.lvl);
        const maxLevel = Worker.maxLevel(maxBuildEnergy);
        if (worstLevel < maxLevel) {
            console.log(`${worstCreep.name} is due for an upgrade!`);
            worstCreep.memory.role = "upgrade";
        }
        // const nextLevel = worstLevel + 1 > maxLevel ? maxLevel : worstLevel + 1;
        // console.log(worstLevel, nextLevel, maxLevel)
        // if (maxBuildEnergy > unitTypes["worker" + nextLevel].uCost) {
        //     if (worstCreep.memory.lvl && worstCreep.memory.lvl < nextLevel) {
        //         console.log(worstCreep.name, "is due for an upgrade!");
        //         worstCreep.memory.role = "upgrade";
        //     }
        // }
    }
}

// Lets try to ID these things that don't have unitTypes definitions
function handleUnknowns() {
    const populationUnknown = filterCreeps((creep) => creep.memory.unit_type === undefined);
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

export function spawnUnits(currentRoom: Room) {
    handleUnknowns();

    handleWorkers(currentRoom);

    handleFighters(currentRoom);

    handleUpgrades(currentRoom);
}
