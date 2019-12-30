import { goRelax } from '../utils/common';

if (!Memory.population) {
    Memory.population = {
        claim: 0,
    };
} else if (!Memory.population.claim) {
    Memory.population.claim = 0;
}

export function claim(creep: Creep) {
    const target: Flag[] = _.filter(Game.flags, (flag: Flag) => {
        return flag.name.toString().toLowerCase().startsWith('claim');
    });
    if (target.length) {
        const claimTarget = target[0];
        if (creep.room !== claimTarget.room) {
            creep.moveTo(claimTarget);
            return;
        } else {
            if (claimTarget.room.controller) {
                const claimAttempt = creep.claimController(claimTarget.room.controller);
                switch (claimAttempt) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(claimTarget.room.controller);
                        break;
                    case ERR_GCL_NOT_ENOUGH:
                        goRelax(creep);
                        break;
                    case ERR_INVALID_TARGET:
                        claimTarget.remove();
                }
            }
        }
    } else {
        goRelax(creep);
    }
}

class ClaimRole implements CreepBehaviour {
    public creep: Creep;

    constructor(creep: Creep) {
        this.creep = creep;
    }

    public run() {
        claim(this.creep);
    }
}

