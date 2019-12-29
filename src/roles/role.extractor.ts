import { harvest_nearest_energy } from '../utils/common';

if (!Memory.population) {
  Memory.population = {
    extractor: 0,
  };
} else if (!Memory.population.extractor) {
  Memory.population.extractor = 0;
}

export function extractor(creep: Creep) {
  // creep.say(
  //   creep.memory.transferring === true ? 'Transferring' : 'Harvesting'
  // )
  harvest_nearest_energy(creep);
}


class ExtractorRole implements CreepBehaviour {
  public creep: Creep;

  constructor(creep: Creep) {
    if (!Memory.population) {
      Memory.population = {
        extractor: 0,
      };
    } else if (!Memory.population.extractor) {
      Memory.population.extractor = 0;
    }

    this.creep = creep;
  }

  public run(): void {
    extractor(this.creep);
  }
}
