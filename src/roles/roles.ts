export let priority = [
  'harvester',
  'upgrader',
  'builder',
  'distributor',
  'hauler',
  'defender',
  'extractor'
];

if (!Memory.socialStructure) {
  Memory.socialStructure = priority;
} else {
  Memory.socialStructure = priority;
}

// Worker roles
import { builder } from './role.builder';
import { extractor } from './role.extractor';
import { harvester } from './role.harvester';
import { upgrader } from './role.upgrader';

// Carrier Roles
import { distributor } from './role.distributor';
import { hauler } from './role.hauler';

// Fighter roles
import { defender } from './role.defender';

// Misc
import { recycle } from './role.recycle';
import { regenerate } from './role.regenerate';

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
  'recycle': recycle,
  'regenerate': regenerate,
};
