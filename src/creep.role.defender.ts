import { goRelax } from './utils';

if (!Memory.population) {
  Memory.population = {
    defender: 0,
  }
} else if (!Memory.population.defender) {
  Memory.population.defender = 0
}

export function defender(creep: Creep) {
  let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)

  if (target) {
    console.log('Found an Invader!')
    if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target)
    }
  }
  else {
    goRelax(creep)
  }
}
