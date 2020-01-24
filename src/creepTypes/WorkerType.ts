import { CreepPartMatrix } from "../utils/creepPartCosts";

export class Worker implements UnitType {
    private static bodyBase: BodyPartConstant[] = [MOVE, MOVE, CARRY, WORK];
    private lvl: number = 1;

    public uMem: CreepMemory = { unit_type: "worker", lvl: this.lvl };

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
        if (lvl) {
            this.lvl = lvl;
        }
    }

    public static maxLevel(energyAvailable: number): number {
        const baseCost = Worker.bodyBase
            .map((part) => CreepPartMatrix[part.toUpperCase()])
            .reduce((acc, part) => (acc += part));

        return Math.floor(energyAvailable / baseCost);
    }
}
