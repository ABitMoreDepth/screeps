import { goRelax } from './utils';

export function recycle(creep: Creep) {
  // Lets have some time to think about this
  if (typeof creep.memory.state !== 'number') {
    creep.memory['state'] = 10
  } else if (creep.memory.state > 0) {
    creep.memory.state -= 1
    goRelax(creep)
  }
  if (creep.memory.state == 0) {
    let spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS)
    if (spawn) {
      if (spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn)
      }
    } else {
      goRelax(creep)
    }
  }
}
