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

// method to clear key states of the macro
const clearKeyStates = () => {

    // if column is 1 or 3
    if (column == 1 || column == 3) {
        // if row == 1 or 3 we are moving right
        if (row == 1 || row == 3) {
            robot.keyTap('d');
        }
        // else we are moving left
        else {
            robot.keyTap('a');
        }
    }
    // if column is 2
    else if (column == 2) {
        // if row == 1 or 3 we are moving left
        if (row == 1 || row == 3) {
            robot.keyTap('a');
        }
        // else we are moving right
        else {
            robot.keyTap('d');
        }
    }

}

const spoolAHKScript = () => {

    // path to our ahk script
    const scriptPath = path.join(`${__dirname}/ahks/pumpkin.ahk`);

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

// method to pad a number with 0s
const pad = (num, size) => {
    num = num.toString();
    while(num.length < size) num = "0" + num;
    return num;
}

// method to convert seconds to a readable time format HH:MM:SS
const convertSeconds = (seconds) => {
    hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    minutes = Math.floor(seconds / 60);
    second = seconds % 60;
    return `${hours == 0 ? '' : pad(hours, 2) + ":"}${minutes == 0 ? '00' : pad(minutes, 2)}:${second == 0 ? '00' : pad(second, 2)}`;
}

const stop = async () => {

    await clearKeyStates();
    await tapEndKeys();


    await clearInterval(interval);
    toggled = false;
    row = 1;
    column = 1;
    seconds = 0;
}

const start = async (delay) => {

    toggled = true;

    tapStartKeys();

    interval = setInterval(async () => {

        let res = await axios.get("http://localhost:8080/position");

        // in order for pumpkin and melon farms to be infinite at garden lvl 11+
        // you need 3 columns of 3 rows. so the structure is 
        // 1 # # #
        // 2 # # #
        // 3 # # #
        // where 1-3 are the columns and # are the rows.
        // the macro aims to track each column and row and move the character accordingly.

        // column one starts from the far left
        // so at row 1, we check for the far right
        // at row 2, we check for the far left
        // at row 3, we check for the far right

        // column two will alternate this as when we move up we will start
        // from the far right.

        // column 3 will return back to column 1s behavior
        // absent the logic to restart once player falls into the void.

        // a timeout is necessary at the end of column 1 and 2 because
        // we are walking up staircases to get to the top of the next column.
        // if we do not time this out and the macro starts backup, the player will be stuck in a loop
        if (column == 1) {

            if (row == 1 && !isMovingForward) {
                if (res.data.z > 238) {
                    row++;
                    robot.keyTap('d');
                    robot.keyTap('a');
                }
            } else if (row == 2 && !isMovingForward) {
                if (res.data.z < -238) {
                    row++;
                    robot.keyTap('a');
                    robot.keyTap('d');
                }
            } else if (row == 3 && !isMovingForward) {
                if (res.data.z > 238) {
                    isMovingForward = true;
                    robot.keyTap('d');
                    robot.keyTap('delete');
                    robot.keyTap('w');
                    setTimeout(() => {
                        robot.keyTap('w');
                        robot.keyTap('a');
                        robot.keyTap('delete');
                        row = 1;
                        column++;
                        isMovingForward = false;
                    }, 1650);
                }
            }

        } else if (column == 2) {
            if (row == 1 && !isMovingForward) {
                if (res.data.z < -238) {
                    row++;
                    robot.keyTap('a');
                    robot.keyTap('d');

                }
            } else if (row == 2 && !isMovingForward) {
                if (res.data.z > 238) {
                    row++;
                    robot.keyTap('d');
                    robot.keyTap('a');
                }
            } else if (row == 3 && !isMovingForward) {
                if (res.data.z < -238) {
                    isMovingForward = true;
                    robot.keyTap('a');
                    robot.keyTap('delete');
                    robot.keyTap('w');
                    setTimeout(() => {
                        robot.keyTap('w');
                        robot.keyTap('d');
                        robot.keyTap('delete');
                        row = 1;
                        column++;
                        isMovingForward = false;
                    }, 1650);
                }

            }
        } else if (column == 3) {
            if (row == 1 && !isMovingForward) {
                if (res.data.z > 238) {
                    row++;
                    robot.keyTap('d');
                    robot.keyTap('a');
                }
            } else if (row == 2 && !isMovingForward) {
                if (res.data.z < -238) {
                    row++;
                    robot.keyTap('a');
                    robot.keyTap('d');
                }
            } else if (row == 3 && Math.floor(res.data.y) > 74 && !isMovingForward) {
                row = 1;
                column = 1;
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