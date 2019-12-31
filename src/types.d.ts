// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
    role?: string;
    room?: string;
    working?: boolean;
    upgrading?: boolean;
    state?: number | string;
    unit_type?: string;
    lvl?: number;
}

interface Memory {
    population: { [index: string]: number };
    defense: { wall_health: number };
    socialStructure: string[];
}

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any;
    }
}

// The interface for a role.  Used to provide operation of creeps.
interface CreepBehaviour {
    creep: Creep;
    nextRole?: CreepBehaviour;

    run: () => void;
}

interface UnitType {
    uBody: BodyPartConstant[];
    uMem: CreepMemory;
    uCost: number;
}
