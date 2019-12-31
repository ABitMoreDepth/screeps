import { Worker } from "./creepTypes/WorkerType";
import { CreepPartMatrix } from "./utils/creepPartCosts";

class UnitDefinition implements UnitType {
    public uBody: BodyPartConstant[];
    public uMem: CreepMemory;

    get uCost(): number {
        return this.uBody.map((part) => CreepPartMatrix[part]).reduce((acc, part) => (acc += part));
    }

    constructor(body: BodyPartConstant[], mem: CreepMemory) {
        this.uBody = body;
        this.uMem = mem;
    }
}

const worker1 = new Worker(1);

const worker2 = new Worker(2);

const worker3 = new Worker(3);

const worker4 = new Worker(4);

const carrier1 = new UnitDefinition([CARRY, CARRY, MOVE, MOVE], { unit_type: "carrier", lvl: 1 });

const carrier2 = new UnitDefinition([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], {
    lvl: 2,
    unit_type: "carrier",
});

const carrier3 = new UnitDefinition(
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    { unit_type: "carrier", lvl: 3 },
);

const carrier4 = new UnitDefinition(
    [
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
        MOVE,
    ],
    { unit_type: "carrier", lvl: 4 },
);

const defender1 = new UnitDefinition([TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE], {
    lvl: 1,
    unit_type: "defender",
});

const extractor1 = new UnitDefinition([MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK], {
    lvl: 1,
    unit_type: "extractor",
});

const claimer1 = new UnitDefinition([CLAIM, MOVE], { unit_type: "claimer", lvl: 1 });

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
