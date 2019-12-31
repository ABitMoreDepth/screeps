import { CreepPartMatrix } from "../utils/creepPartCosts";

export class Worker implements UnitType {
    private bodyBase: BodyPartConstant[] = [MOVE, MOVE, CARRY, WORK];
    private lvl: number = 1;

    public uMem: CreepMemory = { unit_type: "worker", lvl: this.lvl };

    get uBody(): BodyPartConstant[] {
        const body: BodyPartConstant[] = [];
        this.bodyBase.forEach((part) => {
            for (let i = 0; i < this.lvl; i++) {
                body.push(part);
            }
        });
        return body;
    }

    get uCost(): number {
        return this.uBody.map((part) => CreepPartMatrix[part]).reduce((acc, part) => (acc += part));
    }

    constructor(lvl?: number, initialMemory?: CreepMemory) {
        Object.assign(this.uMem, initialMemory);
        if (lvl) {
            this.lvl = lvl;
        }
    }
}
