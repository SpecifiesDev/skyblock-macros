const robot = require('robotjs');
const path = require('path');
const axios = require('axios');

const {
    exec
} = require('child_process');


let toggled = false;
let seconds = 0;
let row = 1;

let interval;

const isToggled = () => {  
    return toggled;
}


// tap the start keys for this macro
// use async to ensure that tasks are done in order
// this should be called before spooling AHK script
// as the scripts have built in kill functions using the ESC key.
const tapStartKeys = async () => {

    await robot.keyTap('escape');
    await robot.keyTap('d');
    await robot.keyTap('delete');

}

const tapEndKeys = async () => {
    await robot.keyTap('delete');
    await robot.keyTap('escape');
}

const stop = async () => {

    await clearInterval(interval);


    toggled = false;
    row = 1;
    seconds = 0;

    await clearKeyStates();
    await tapEndKeys();
}

// clear the key states for this macro
const clearKeyStates = () => {

    // if we are on row 1, 3, or 5 we are moving right
    if (row === 1 || row === 3 || row === 5) {
        robot.keyTap('d');
    }
    // else if 2 or 4 we are moving left
    else if (row === 2 || row === 4) {
        robot.keyTap('a');
    }

}

/**
 * Spool the AHK script for this macro
 * Will kill the program if this function is called
 * and is not ran successfuly. Usually this only
 * happens when the user has not set the path to the AHK folder
 * in environment variables.
 */
const spoolAHKScript = () => {

    // path to this macro's script
    const script = path.join(`${__dirname}/ahks/mega.ahk`);

    // command to run the script
    const command = `AutoHotKey.exe ${script}`;

    // exec the command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            process.exit(1);
            return;
        }

        console.log(`AHK Script has been started.`);
    });

}

const start = async (delay) => {

    toggled = true;

    tapStartKeys();

    interval = setInterval(async () => {

        if (toggled == true) {

            // get the position information of the game client
            let res = await axios.get("http://localhost:8080/position");

            // if row is 1 or 3 we are walking left to right. if player z > 238, we need to switch to the next row and
            // perform a d -> up -> a -> down action to switch rows
            if (row == 1 || row == 3) {


                if (res.data.z > 238) {
                    row++;
                    robot.keyTap('d');
                    robot.keyTap('a');

                }

            }
            // if row is 2 or 4, we are walking right to left. if player z < -238, we need to switch to the next row and
            // perform a a -> up -> d -> down action to switch rows
            else if (row == 2 || 4) {


                if (res.data.z < -238) {
                    row++;
                    robot.keyTap('a');
                    robot.keyTap('d');

                }

            }

            // this is a special case for row 5. this will keep action state the same (movement for row 1 and 5 are the same direction)
            // but will make sure row state is reset so the macro infinitely iterates after player falls into void and teleports back to row 1
            if (row > 4 && Math.floor(res.data.y) > 74) {
                console.log('triggered');
                row = 1;
            }

            // increment seconds
            seconds++;

            // log the state of the collected macro data.
            // I have removed the percentage walked data set as it was originally intended to show me how far the player has walked
            // due to the game client being input locked. now that I have hyperVs setup I can create a discord bot to retroactively show this data
            console.log(`
            Script Time: ${convertSeconds(seconds)}\n
            Row: ${row}\n
            X/Y/Z: ${res.data.x}/${res.data.y}/${res.data.z}\n
            `);

        }

    }, delay);
}

// pad a number with zeroes until it is the desired input size
const pad = (num, size) => {
    num = num.toString();
    while (num.length < size) num = "0" + num;
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


module.exports = {
    clearKeyStates,
    spoolAHKScript,
    start,
    stop,
    isToggled
};