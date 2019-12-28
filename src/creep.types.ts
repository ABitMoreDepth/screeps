type partsDef = (MOVE | WORK | CARRY | ATTACK | RANGED_ATTACK | TOUGH | HEAL | CLAIM)[];

interface unitType {
  'u_body': partsDef,
  'u_mem': CreepMemory,
  'u_cost': number
}

const worker_1: unitType = {
  u_body: [
    WORK,
    CARRY,
    MOVE,
    MOVE
  ],
  u_mem: { unit_type: 'worker', lvl: 1 },
  u_cost: 100 + 50 + (50 * 2)
}

const worker_2: unitType = {
  u_body: [
    WORK,
    WORK,
    CARRY,
    CARRY,
    MOVE,
    MOVE,
    MOVE,
    MOVE
  ],
  u_mem: { unit_type: 'worker', lvl: 2 },
  u_cost: (100 * 2) + (50 * 2) + (50 * 4)
}

const worker_3: unitType = {
  u_body: [
    WORK,
    WORK,
    WORK,
    CARRY,
    CARRY,
    CARRY,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE
  ],
  u_mem: { unit_type: 'worker', lvl: 3 },
  u_cost: (100 * 3) + (50 * 3) + (50 * 6)
}

const worker_4: unitType = {
  u_body: [
    WORK,
    WORK,
    WORK,
    WORK,
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE
  ],
  u_mem: { unit_type: 'worker', lvl: 4 },
  u_cost: (100 * 4) + (50 * 4) + (50 * 8)
}

const carrier_1: unitType = {
  u_body: [
    CARRY,
    CARRY,
    MOVE,
    MOVE
  ],
  u_mem: { unit_type: 'carrier', lvl: 1 },
  u_cost: (50 * 2) + (50 * 2)
}

const carrier_2: unitType = {
  u_body: [
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    MOVE,
    MOVE,
    MOVE,
    MOVE
  ],
  u_mem: { unit_type: 'carrier', lvl: 2 },
  u_cost: (50 * 4) + (50 * 4)
}

const carrier_3: unitType = {
  u_body: [
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE
  ],
  u_mem: { unit_type: 'carrier', lvl: 3 },
  u_cost: (50 * 6) + (50 * 6)
}

const carrier_4: unitType = {
  u_body: [
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE
  ],
  u_mem: { unit_type: 'carrier', lvl: 4 },
  u_cost: (50 * 8) + (50 * 8)
}

const defender_1: unitType = {
  u_body: [
    TOUGH,
    RANGED_ATTACK,
    RANGED_ATTACK,
    MOVE,
    MOVE
  ],
  u_mem: { unit_type: 'defender', lvl: 1 },
  u_cost: 10 + (50 * 2) + (150 * 2),
};

const extractor_1: unitType = {
  u_body: [
    MOVE,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK
  ],
  u_mem: { unit_type: 'extractor', lvl: 1 },
  u_cost: 50 + (100 * 8)
};

export const unit_types: { [index: string]: unitType } = {
  worker_1: worker_1,
  worker_2: worker_2,
  worker_3: worker_3,
  worker_4: worker_4,

  carrier_1: carrier_1,
  carrier_2: carrier_2,
  carrier_3: carrier_3,
  carrier_4: carrier_4,

  defender_1: defender_1,

  extractor_1: extractor_1
};
