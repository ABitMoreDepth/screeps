export let priority = [
  'harvester',
  'distributor',
  'hauler',
  'builder',
  'upgrader',
  'defender',
  'extractor'
]

if (!Memory.socialStructure) {
  Memory['socialStructure'] = priority
} else {
  Memory.socialStructure = priority
}

// Worker roles
import { builder } from './creep.role.builder';
import { extractor } from './creep.role.extractor';
import { harvester } from './creep.role.harvester';
import { upgrader } from './creep.role.upgrader';

// Carrier Roles
import { distributor } from './creep.role.distributor';
import { hauler } from './creep.role.hauler';

// Fighter roles
import { defender } from './creep.role.defender';

// Misc
import { recycle } from './creep.role.recycle';
import { regenerate } from './creep.role.regenerate';

export let roles: { [index: string]: (creep: Creep) => void } = {

  // Worker roles
  'builder': builder,
  'extractor': extractor,
  'harvester': harvester,
  'upgrader': upgrader,

  // Carrier Roles
  'distributor': distributor,
  'hauler': hauler,

  // Fighter roles
  'defender': defender,

  // Misc
  'regenerate': regenerate,
  'recycle': recycle,
}
