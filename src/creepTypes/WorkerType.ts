import { CreepPartMatrix } from "../utils/creepPartCosts";

export class Worker implements UnitType {
    private static bodyBase: BodyPartConstant[] = [MOVE, MOVE, CARRY, WORK];
    public lvl: number;
    private workerMemory: CreepMemory;

    get uMem(): CreepMemory {
        return Object.assign({ unit_type: "worker", lvl: this.lvl }, this.workerMemory);
    }

    get uBody(): BodyPartConstant[] {
        const body: BodyPartConstant[] = [];
        Worker.bodyBase.forEach((part) => {
            for (let i = 0; i < this.lvl; i++) {
                body.push(part);
            }
        });
        return body;
    }

    get uCost(): number {
        return this.uBody
            .map((part) => CreepPartMatrix[part.toUpperCase()])
            .reduce((acc, part) => (acc += part));
    }

    constructor(lvl?: number, initialMemory?: CreepMemory) {
        Object.assign(this.uMem, initialMemory);
        if (initialMemory !== undefined) {
            this.workerMemory = initialMemory;
        } else {
            this.workerMemory = {};
        }
        if (lvl !== undefined) {
            this.lvl = lvl;
            // Object.assign(this.lvl, lvl);
        } else {
            // Object.assign(this.lvl, 1);
            this.lvl = 1;
        }
    }

    public static maxLevel(energyAvailable: number): number {
        const baseCost = Worker.bodyBase
            .map((part) => CreepPartMatrix[part.toUpperCase()])
            .reduce((acc, part) => (acc += part));

        return _.max([Math.floor(energyAvailable / baseCost), 1]);
    }
}
