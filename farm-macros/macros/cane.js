const robot = require('robotjs');
const axios = require('axios');
const path = require('path');

// in an effort to reduce commenting, I will only comment on new features relative to this macro.
// please refer to the mega.js file for more detailed comments on the functions used in this macro.

const {
    exec
} = require('child_process');


let toggled = false;
let seconds = 0;
let row = 1;
let column = 1;

let interval;

let isMovingForward = false;


const isToggled = () => {  
    return toggled;
}

const tapStartKeys = async () => {

    await robot.keyTap('escape');
    await robot.keyTap('d');
    await robot.keyTap('delete');

}

const tapEndKeys = async () => {

    await robot.keyTap('delete');
    await robot.keyTap('escape');

}

const clearKeyStates = () => {

    if (row == 1) {
        robot.keyTap('d');
    } else {
        robot.keyTap('s');
    }

}

const spoolAHKScript = () => {

    // path to our ahk script
    // we can just use pumpkin.ahk as no additional keybinds are needed for this script
    const scriptPath = path.join(`${__dirname}/macros/pumpkin.ahk`);

    // command to execute the script
    // if this is not working, it is because autohotkey is not in your path env variables.
    const command = `AutoHotKey.exe ${scriptPath}`;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            // if we have an error, stop this node script
            process.exit(1);
            return;
        }

        console.log('Successfully spooled AHK script.');
    });

}

const stop = async () => {

    await clearInterval(interval);

    toggled = false;
    row = 1;
    column = 1;
    seconds = 0;

    await clearKeyStates();
    await tapEndKeys();

}

const start = async (delay, cane_config) => {

    toggled = true;

    tapStartKeys();

    interval = setInterval(async () => {

        let res = await axios.get("http://localhost:8080/position");

        // cane is actually simple. due to garden height constraints, only two rows per column can be applied.
        // I do not know the exact math for infinite farms, but at my current garden level (14) I can do this with 5 columns.
        // User can configure this easily in config.json's "cane-columns" key. While technically infinite I would not reccomend
        // configuring this over 10 columns.

        //  if we are on row 1, we are just going to move the correct direction
        //  row 2 works similar to pumpkin farms. we move up staircases, and resume
        //  once we are up.

        // if we are on the last column, we need to move back to the start and move backwards.
        if ((column > 0 && column < cane_config) && !isMovingForward) {

            if (row == 1 && !isMovingForward) {
                console.log(`${row} - ${column}`);
                if (res.data.z > 238) {
                    row++;
                    robot.keyTap('d');
                    robot.keyTap('s');
                }
            } else if (row == 2 && !isMovingForward) {
                console.log(`${row} - ${column}`);
                if (res.data.z < -238) {
                    isMovingForward = true;
                    robot.keyTap('s');
                    robot.keyTap('delete');
                    robot.keyTap('a');
                    setTimeout(() => {
                        robot.keyTap('a');
                        robot.keyTap('d');
                        robot.keyTap('delete');
                        row = 1;
                        column++;
                        isMovingForward = false;
                    }, 1300);
                }
            }

        } else if (column == cane_config) {

            if (row == 1 && !isMovingForward) {
                console.log(`${row} - ${column}`);
                if (res.data.z > 238) {
                    row++;
                    robot.keyTap('d');
                    robot.keyTap('s');
                }
            } else if (row == 2 && (Math.floor(res.data.z) < -239) && !isMovingForward) {
                isMovingForward = true;
                robot.keyTap('s');
                console.log(` TRUE - ${row} - ${column}`);
                console.log(isMovingForward);
                row = 1;
                column = 1;
                setTimeout(() => {
                    robot.keyTap('d');
                    isMovingForward = false;
                }, 2500);
            }
        }




        // increment seconds
        seconds++;

        console.log(`
            Script Time: ${convertSeconds(seconds)}\n
            Row: ${row}\n
            X/Y/Z: ${res.data.x}/${res.data.y}/${res.data.z}\n
            `);
    }, delay);
}

module.exports = {
    start,
    stop,
    spoolAHKScript,
    isToggled
}