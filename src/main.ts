import { creepManager } from "./creep.manager";
import { towerManager } from "./towerManager";
import { ErrorMapper } from "./utils/ErrorMapper";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    console.log(`Current game tick is ${Game.time}`);

    // Manage creeps & Towers room by room
    for (const room in Game.rooms) {
        const currentRoom = Game.rooms[room];
        creepManager.manage(currentRoom);
        towerManager.manage(currentRoom);
    }

    // Run creeps globally
    creepManager.run();

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
});

// loop();
