import { unitTypes } from './creep.types';
import { roles } from './roles/roles';
import { equals, getSpawn } from './utils/common';

if (!Memory.defense) {
  Memory.defense = {
    wall_health: 1000
  };
}

export let creepManager = {
  manage(currentRoom: Room) {
    undertaker();
    spawnUnits(currentRoom);
    workersUnion();
  },

  run() {
    for (const name in Game.creeps) {
      // Run our creeps behaviour
      const creep = Game.creeps[name];
      if (creep.memory.role) {
        try {
          // console.log(creep.name, ', Role:', creep.memory.role)
          roles[creep.memory.role](creep);
        } catch (err) {
          console.log(creep.name, 'caught amnesia, former role:',
            creep.memory.role, ', unsetting role:', err);
          delete creep.memory.role;
        }
      }
    }
  }
};

function undertaker() {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Today we mourn the passing of', name);
    }
    const creep = Game.creeps[name];
    if (creep) {
      if (creep.ticksToLive !== undefined && creep.ticksToLive < 100 && creep.memory.role !== 'regenerate') {
        console.log(creep.name, 'is getting old and is finally '
          + 'entitled to some regeneration!');
        creep.memory.role = 'regenerate';
      }
    }
  }
}

function spawnUnits(currentRoom: Room) {
  const maxBuildEnergy = currentRoom.energyCapacityAvailable;
  console.log(JSON.stringify(currentRoom));
  console.log('max:', maxBuildEnergy, 'Available:',
    currentRoom.energyAvailable);

  let neededWorkers: number = 0;
  for (const workerType in Memory.population) {
    neededWorkers += Memory.population[workerType];
  }
  if (Memory.population.defender !== undefined) {
    neededWorkers -= Memory.population.defender;
  }

  const neededFighters = Memory.population.defender || 0;

  const populationWorkers = _.filter(
    Game.creeps, (creep) => (
      creep.memory.unit_type === 'worker'
      && creep.memory.role !== 'upgrade'
    )
  );

  const populationRegenerates = _.filter(
    Game.creeps, (creep) => (
      creep.memory.role === 'regenerate'
    )
  );

  const populationFighters = _.filter(Game.creeps, (creep) =>
    creep.memory.unit_type === 'defender'
  );

  const populationUnknown = _.filter(Game.creeps, (creep) =>
    !creep.memory.unit_type
  );


  // console.log('Needed Workers:', neededWorkers, 'Worker pop:',
  //   populationWorkers.length);
  // console.log('Needed Fighters:', neededFighters, ', Fighter pop:',
  //   populationFighters.length);
  // console.log('Unknown Pop:', populationUnknown.length);

  if (populationWorkers.length < neededWorkers
    && populationRegenerates.length === 0) {
    // We have a deficit of workers, lets spawn some more!
    if (maxBuildEnergy >= unitTypes.worker3.uCost) {
      if (_.filter(
        Game.creeps, (creep) => (
          creep.memory.role === Memory.socialStructure[0])
      ).length < Memory.population[Memory.socialStructure[0]]
      ) {
        // We shouldn't really get here, but in case all our units are
        // dead or something...
        console.log('Emergency Spawning lvl1 Worker');
        const spawn: StructureSpawn | null = getSpawn();
        if (spawn === null) { return; }
        const newby = spawn.createCreep(
          unitTypes.worker1.uBody,
          undefined,
          unitTypes.worker1.uMem);
        return;
      }
      console.log('Spawning lvl3 Worker');
      const spawn = getSpawn();

      if (spawn !== null) {
        const newby = spawn.createCreep(
          unitTypes.worker3.uBody,
          undefined,
          unitTypes.worker3.uMem);
        console.log(newby);
      }
    }
    else if (maxBuildEnergy >= unitTypes.worker2.uCost) {
      if (_.filter(
        Game.creeps, (creep) => (
          creep.memory.role === Memory.socialStructure[0])
      ).length < Memory.population[Memory.socialStructure[0]]
      ) {
        // We shouldn't really get here, but in case all our units are
        // dead or something...
        console.log('Emergency Spawning lvl1 Worker');
        const spawn = getSpawn();
        if (spawn !== null) {
          const newby = spawn.createCreep(
            unitTypes.worker1.uBody,
            undefined,
            unitTypes.worker1.uMem);
          return;
        }
      }
      console.log('Spawning lvl2 Worker');
      const spawn = getSpawn();
      if (spawn !== null) {
        const newby = spawn.createCreep(
          unitTypes.worker2.uBody,
          undefined,
          unitTypes.worker2.uMem);
      }
    }
    else if (maxBuildEnergy >= unitTypes.worker1.uCost) {
      console.log('Spawning lvl1 Worker');
      const spawn = getSpawn();
      if (spawn !== null) {
        const newby = spawn.createCreep(
          unitTypes.worker1.uBody,
          undefined,
          unitTypes.worker1.uMem);
      }
    }
  }

  if (populationFighters.length < neededFighters) {
    // We have a deficit of fighters, lets spawn some more!
    const spawn = getSpawn();
    if (spawn !== null) {
      const newby = spawn.createCreep(
        unitTypes.defender1.uBody,
        undefined,
        unitTypes.defender1.uMem);
    }
  }

  // Lets try to ID these things that don't have unitTypes definitions
  if (populationUnknown.length > 0) {
    for (const i in populationUnknown) {
      const creep = populationUnknown[i];
      const bodyStyle = creep.body.map((val) => {
        return val.type;
      });
      for (const creepType in unitTypes) {
        console.log(unitTypes.worker1.uBody);
        console.log(unitTypes[creepType].uBody);
        console.log(unitTypes.worker1.uBody);
        if (equals(bodyStyle, unitTypes[creepType].uBody)) {
          console.log('Identified a creep!');
          creep.memory = unitTypes[creepType].uMem;
        }
      }
    }
  }

  const mostImportantWorkers = _.filter(
    Game.creeps, (creep) => creep.memory.role === Memory.socialStructure[0]
      || creep.memory.role === Memory.socialStructure[1]);
  if (mostImportantWorkers.length >=
    Memory.population[Memory.socialStructure[0]]
    + Memory.population[Memory.socialStructure[1]]
    && _.filter(Game.creeps,
      (creep) => creep.memory.role === 'upgrade').length < 1) {
    const worstCreep = _.min(
      mostImportantWorkers,
      (worker) => {
        return worker.memory.lvl;
      });
    const worstLevel = Number(worstCreep.memory.lvl);
    const maxLevel = 3;
    const nextLevel = worstLevel + 1 > maxLevel ?
      maxLevel : worstLevel + 1;
    // console.log(worstLevel, nextLevel, maxLevel)
    if (maxBuildEnergy > unitTypes['worker' + nextLevel].uCost) {
      if (worstCreep.memory.lvl && worstCreep.memory.lvl < nextLevel) {
        console.log(worstCreep.name, 'is due for an upgrade!');
        worstCreep.memory.role = 'upgrade';
      }
    }
  }
}

function workersUnion() {

  // Create a correctly padded list of roles to provide to creeps
  const screepsAssignments = [];
  for (const unitRole in Memory.socialStructure) {
    for (let count = 0;
      count < Memory.population[Memory.socialStructure[unitRole]];
      count++) {
      screepsAssignments.push(Memory.socialStructure[unitRole]);
    }
  }
  console.log(`Creep assignmens: ${screepsAssignments}`);

  // Create an ordered list of creeps (hashes are not numbered)
  let creepsList = _.filter(
    Game.creeps, (creep) => (
      creep.memory.unit_type === 'worker'
      && creep.memory.role !== 'regenerate'
      && creep.memory.role !== 'upgrade'
    )
  );
  creepsList = _.sortBy(
    creepsList,
    [
      (creep: Creep) => {
        return creep.memory.lvl;
      }
    ]
  );

  for (const count in screepsAssignments) {
    try {
      if (creepsList.length > 0) {
        // let creep = Game.creeps[creepsList.shift().name]
        const creep = creepsList.shift();
        if (creep !== undefined) {
          creep.memory.role = screepsAssignments[count];
        }
      } else {
        break;
      }
    } catch (err) {
      console.log(err);
    }
  }
  // if (screepsAssignments.length - 1 - count != 0) {
  //   console.log('We have a ', screepsAssignments.length - 1 - count,
  //     'worker deficit!')
  // }

  if (creepsList.length > 0) {
    console.log('We have a worker Surplus!');
    // for (let count = 0; count < creepsList.length; count++) {
    for (const creep of creepsList) {
      // let creep = Game.creeps[creepsList.shift().name]
      // const creep = creepsList.shift();
      // creepsList.shift();
      // if (creep !== undefined) {
      console.log(creep.name, 'is heading for retirement!');
      creep.memory.role = 'recycle';
      creepsList.shift();
      // }
    }
  }
}
