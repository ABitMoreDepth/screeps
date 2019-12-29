import { creepManager } from './creep.manager';
import { towerManager } from './towerManager';
import { ErrorMapper } from "./utils/ErrorMapper";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // export const loop = function () {
  console.log(`Current game tick is ${Game.time}`);

  // Manage creeps & Towers room by room
  for (let room in Game.rooms) {
    let current_room = Game.rooms[room]
    creepManager.manage(current_room)
    towerManager.manage(current_room)
  }

  // Run creeps globally
  creepManager.run()

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
// };

loop();
