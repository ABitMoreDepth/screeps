type partsDef = Array<MOVE | WORK | CARRY | ATTACK | RANGED_ATTACK | TOUGH | HEAL | CLAIM>;

interface UnitType {
  'uBody': partsDef;
  'uMem': CreepMemory;
  'uCost': number;
}

const worker1: UnitType = {
  uBody: [
    WORK,
    CARRY,
    MOVE,
    MOVE
  ],
  uCost: 100 + 50 + (50 * 2),
  uMem: { unit_type: 'worker', lvl: 1 },
};

const worker2: UnitType = {
  uBody: [
    WORK,
    WORK,
    CARRY,
    CARRY,
    MOVE,
    MOVE,
    MOVE,
    MOVE
  ],
  uCost: (100 * 2) + (50 * 2) + (50 * 4),
  uMem: { unit_type: 'worker', lvl: 2 },
};

const worker3: UnitType = {
  uBody: [
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
  uCost: (100 * 3) + (50 * 3) + (50 * 6),
  uMem: { unit_type: 'worker', lvl: 3 },
};

const worker4: UnitType = {
  uBody: [
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
  uCost: (100 * 4) + (50 * 4) + (50 * 8),
  uMem: { unit_type: 'worker', lvl: 4 },
};

const carrier1: UnitType = {
  uBody: [
    CARRY,
    CARRY,
    MOVE,
    MOVE
  ],
  uCost: (50 * 2) + (50 * 2),
  uMem: { unit_type: 'carrier', lvl: 1 },
};

const carrier2: UnitType = {
  uBody: [
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    MOVE,
    MOVE,
    MOVE,
    MOVE
  ],
  uCost: (50 * 4) + (50 * 4),
  uMem: { unit_type: 'carrier', lvl: 2 },
};

const carrier3: UnitType = {
  uBody: [
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
  uCost: (50 * 6) + (50 * 6),
  uMem: { unit_type: 'carrier', lvl: 3 },
};

const carrier4: UnitType = {
  uBody: [
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
  uCost: (50 * 8) + (50 * 8),
  uMem: { unit_type: 'carrier', lvl: 4 },
};

const defender1: UnitType = {
  uBody: [
    TOUGH,
    RANGED_ATTACK,
    RANGED_ATTACK,
    MOVE,
    MOVE
  ],
  uCost: 10 + (50 * 2) + (150 * 2),
  uMem: { unit_type: 'defender', lvl: 1 },
};

const extractor1: UnitType = {
  uBody: [
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
  uCost: 50 + (100 * 8),
  uMem: { unit_type: 'extractor', lvl: 1 },
};

const claimer1: UnitType = {
  uBody: [
    CLAIM,
    MOVE,
  ],
  uCost: 600 + 50,
  uMem: { unit_type: 'claimer', lvl: 1 },
};

export const unitTypes: { [index: string]: UnitType } = {
  worker1,
  worker2,
  worker3,
  worker4,

  carrier1,
  carrier2,
  carrier3,
  carrier4,

  defender1,

  extractor1,

  claimer1,
};
