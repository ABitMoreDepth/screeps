import { spawnUnits } from './populationControl';
import { roles } from './roles/roles';

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
          console.log(`${creep.name} caught amnesia, former role: ${creep.memory.role}, unsetting role, error: ${err}`);
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
  // console.log(`Creep assignmens: ${screepsAssignments}`);

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
