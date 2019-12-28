// let utils = require('utils')
import { go_relax } from './utils';

export function regenerate(creep: Creep) {
  if (creep.ticksToLive !== undefined && creep.ticksToLive < 1500 * 0.90) {
    let spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS)
    if (spawn) {
      if (spawn.renewCreep(creep) == ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn)
      }
    } else {
      go_relax(creep)
    }
  } else {
    // feeling spritely again!
    delete creep.memory.role
  }
}

module.exports = regenerate
