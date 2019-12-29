import { roles } from './roles/roles';
import { unit_types } from './creep.types';
import { getSpawn, equals } from './utils/common';

if (!Memory.defense) {
  Memory.defense = {
    wall_health: 5000
  }
}

export let creepManager = {
  manage: function (current_room: Room) {
    undertaker()
    spawn_units(current_room)
    workersUnion()
  },

  run: function () {
    for (let name in Game.creeps) {
      // Run our creeps behaviour
      let creep = Game.creeps[name]
      if (creep.memory.role) {
        try {
          // console.log(creep.name, ', Role:', creep.memory.role)
          roles[creep.memory.role](creep)
        } catch (err) {
          console.log(creep.name, 'caught amnesia, former role:',
            creep.memory.role, ', unsetting role:', err)
          delete creep.memory['role']
        }
      }
    }
  }
}

function undertaker() {
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name]
      console.log('Today we mourn the passing of', name)
    }
    let creep = Game.creeps[name]
    if (creep) {
      if (creep.ticksToLive !== undefined && creep.ticksToLive < 100 && creep.memory.role != 'regenerate') {
        console.log(creep.name, 'is getting old and is finally '
          + 'entitled to some regeneration!')
        creep.memory.role = 'regenerate'
      }
    }
  }
}

function spawn_units(current_room: Room) {
  let max_build_energy = current_room.energyCapacityAvailable
  console.log(JSON.stringify(current_room))
  console.log('max:', max_build_energy, 'Available:',
    current_room.energyAvailable)

  let needed_workers = Memory.population.builder
    + Memory.population.harvester
    + Memory.population.upgrader
    + Memory.population.hauler
    + Memory.population.extractor || 0
  let needed_fighters = Memory.population.defender || 0

  let population_workers = _.filter(
    Game.creeps, (creep) => (
      creep.memory.unit_type == 'worker'
      && creep.memory.role != 'upgrade'
    )
  )

  let population_regenerates = _.filter(
    Game.creeps, (creep) => (
      creep.memory.role == 'regenerate'
    )
  )

  let population_fighters = _.filter(Game.creeps, (creep) =>
    creep.memory.unit_type == 'defender'
  )

  let population_unknown = _.filter(Game.creeps, (creep) =>
    !creep.memory.unit_type
  )


  // console.log('Needed Workers:', needed_workers, 'Worker pop:',
  //             population_workers.length)
  // console.log('Needed Fighters:', needed_fighters, ', Fighter pop:',
  //             population_fighters.length)
  // console.log('Unknown Pop:', population_unknown.length)

  if (population_workers.length < needed_workers
    && population_regenerates.length == 0) {
    // We have a deficit of workers, lets spawn some more!
    if (max_build_energy >= unit_types.worker_3.u_cost) {
      if (_.filter(
        Game.creeps, (creep) => (
          creep.memory.role == Memory.socialStructure[0])
      ).length < Memory.population[Memory.socialStructure[0]]
      ) {
        // We shouldn't really get here, but in case all our units are
        // dead or something...
        console.log('Emergency Spawning lvl1 Worker')
        let spawn: StructureSpawn | null = getSpawn();
        if (spawn === null) { return }
        let newby = spawn.createCreep(
          unit_types.worker_1.u_body,
          undefined,
          unit_types.worker_1.u_mem)
        return
      }
      console.log('Spawning lvl3 Worker')
      let spawn = getSpawn();

      if (spawn !== null) {
        let newby = spawn.createCreep(
          unit_types.worker_3.u_body,
          undefined,
          unit_types.worker_3.u_mem)
        console.log(newby)
      }
    }
    else if (max_build_energy >= unit_types.worker_2.u_cost) {
      if (_.filter(
        Game.creeps, (creep) => (
          creep.memory.role == Memory.socialStructure[0])
      ).length < Memory.population[Memory.socialStructure[0]]
      ) {
        // We shouldn't really get here, but in case all our units are
        // dead or something...
        console.log('Emergency Spawning lvl1 Worker')
        let spawn = getSpawn();
        if (spawn !== null) {
          let newby = spawn.createCreep(
            unit_types.worker_1.u_body,
            undefined,
            unit_types.worker_1.u_mem)
          return
        }
      }
      console.log('Spawning lvl2 Worker')
      let spawn = getSpawn();
      if (spawn !== null) {
        let newby = spawn.createCreep(
          unit_types.worker_2.u_body,
          undefined,
          unit_types.worker_2.u_mem)
      }
    }
    else if (max_build_energy >= unit_types.worker_1.u_cost) {
      console.log('Spawning lvl1 Worker')
      let spawn = getSpawn();
      if (spawn !== null) {
        let newby = spawn.createCreep(
          unit_types.worker_1.u_body,
          undefined,
          unit_types.worker_1.u_mem)
      }
    }
  }

  if (population_fighters.length < needed_fighters) {
    // We have a deficit of fighters, lets spawn some more!
    let spawn = getSpawn();
    if (spawn !== null) {
      let newby = spawn.createCreep(
        unit_types.defender_1.u_body,
        undefined,
        unit_types.defender_1.u_mem)
    }
  }

  //Lets try to ID these things that don't have unit_types definitions
  if (population_unknown.length > 0) {
    for (let i in population_unknown) {
      let creep = population_unknown[i]
      let body_style = creep.body.map(function (val) {
        return val.type
      })
      for (let creep_type in unit_types) {
        console.log(unit_types.worker_1.u_body);
        console.log(unit_types[creep_type]['u_body']);
        console.log(unit_types['worker_1'].u_body);
        if (equals(body_style, unit_types[creep_type].u_body)) {
          console.log('Identified a creep!');
          creep.memory = unit_types[creep_type].u_mem
        }
      }
    }
  }

  let most_important_workers = _.filter(
    Game.creeps, (creep) => creep.memory.role == Memory.socialStructure[0]
      || creep.memory.role == Memory.socialStructure[1])
  if (most_important_workers.length >=
    Memory.population[Memory.socialStructure[0]]
    + Memory.population[Memory.socialStructure[1]]
    && _.filter(Game.creeps,
      (creep) => creep.memory.role == 'upgrade').length < 1) {
    let worst_creep = _.min(
      most_important_workers,
      function (worker) {
        return worker.memory.lvl
      })
    let worst_level = Number(worst_creep.memory.lvl)
    let max_level = 3
    let next_level = worst_level + 1 > max_level ?
      max_level : worst_level + 1
    // console.log(worst_level, next_level, max_level)
    if (max_build_energy > unit_types['worker_' + next_level].u_cost) {
      if (worst_creep.memory.lvl && worst_creep.memory.lvl < next_level) {
        console.log(worst_creep.name, 'is due for an upgrade!')
        worst_creep.memory.role = 'upgrade'
      }
    }
  }
}

function workersUnion() {

  // Create a correctly padded list of roles to provide to creeps
  let creeps_assignments = []
  for (let unit_role in Memory.socialStructure) {
    for (let count = 0;
      count < Memory.population[Memory.socialStructure[unit_role]];
      count++) {
      creeps_assignments.push(Memory.socialStructure[unit_role])
    }
  }
  console.log(`Creep assignmens: ${creeps_assignments}`);

  // Create an ordered list of creeps (hashes are not numbered)
  let creeps_list = _.filter(
    Game.creeps, (creep) => (
      creep.memory.unit_type == 'worker'
      && creep.memory.role != 'regenerate'
      && creep.memory.role != 'upgrade'
    )
  )
  creeps_list = _.sortBy(
    creeps_list,
    [
      function (creep: Creep) {
        return creep.memory.lvl
      }
    ]
  )

  for (let count in creeps_assignments) {
    try {
      if (creeps_list.length > 0) {
        // let creep = Game.creeps[creeps_list.shift().name]
        let creep = creeps_list.shift();
        if (creep !== undefined) {
          creep.memory.role = creeps_assignments[count]
        }
      } else {
        break
      }
    } catch (err) {
      console.log(err)
    }
  }
  // if (creeps_assignments.length - 1 - count != 0) {
  //   console.log('We have a ', creeps_assignments.length - 1 - count,
  //     'worker deficit!')
  // }

  if (creeps_list.length > 0) {
    console.log('We have a worker Surplus!')
    for (let count = 0; count < creeps_list.length; count++) {
      // let creep = Game.creeps[creeps_list.shift().name]
      let creep = creeps_list.shift();
      if (creep !== undefined) {
        console.log(creep.name, 'is heading for retirement!')
        creep.memory['role'] = 'recycle'
      }
    }
  }
}
