// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role?: string;
  room?: string;
  working?: boolean;
  upgrading?: boolean;
  state?: boolean | number;
  unit_type?: string;
  lvl?: number;
}

interface Memory {
  population: any;
  defense: { wall_health: number };
  socialStructure: Array<string>;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
