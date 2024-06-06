/**
 * @author SpecifiesDev
 * @fileoverview
 * @name app.js
 * @version 1.0.0
 * @since 2023-06-07
 * 
 * @description Main controller server for the mega farm macro
 */
const robot = require('robotjs');
const express = require('express');
const axios = require('axios')
const path = require('path');

// gonna use exec function to spool our ahk script up
const { exec } = require('child_process');


// init our primary values we are going to need
const app = express();
let toggled = false;
let row;
let column;
let seconds = 0;

let isMovingForward = false;

// toggled route to get the toggled state of the macro
// return {success: true/false, toggled: true/false}
app.get('/toggled', (req, res) => {
    res.json({
        success: true,
        toggled: toggled
    })
})

// start route to start the macro. will set the toggled state to true, start the ahk script, and set the row to 1.
app.get('/start', (req, res) => {

    toggled = true;
    spoolAHKScript();
    row = 1;
    column = 1;
    robot.keyTap('d');
    robot.keyTap('delete')

    res.json({success: true});


});

// stop route to stop the macro. will set the toggled state to false, stop the ahk script, and set the row to 1.
app.get('/stop', (req, res) => {
    clearKeyStates();
    robot.keyTap('delete');
    robot.keyTap('escape');
    toggled = false;
    row = 1;
    res.json({success: true});
    seconds = 0;

});

// button route to render the button page
app.get('/button', (req, res) => {
    res.sendFile(path.join(`${__dirname}/index.html`));
});

const clearKeyStates = () => {

    if(row == 1) {
        robot.keyTap('d');
    } else {
        robot.keyTap('s');
    }

}

const spoolAHKScript = () => {

    // path to our ahk script
    const scriptPath = path.join(`${__dirname}/pumpkin.ahk`);

    // command to execute the script
    // if this is not working, it is because autohotkey is not in your path env variables.
    const command = `AutoHotKey.exe ${scriptPath}`;

    exec(command, (err, stdout, stderr) => {
        if(err) {
            console.log(err);
            // if we have an error, stop this node script
            process.exit(1);
            return;
        }

        console.log('Successfully spooled AHK script.');
    });

}

// method to return the percentage of a row player has macroed
const getPercent = (partial, total) => {
    return (100 * partial) / total;
}

// method to calculate the walked distance of a player given their z coordinate
const calculateWalked = (z) => {

    let walked = 0;

    // if we are on row 2 or 4, player is walking from right to left. we will subtract as z in our farm design starts in negative and ends in positive (l/r)
    if(row == 2 || row == 4) {
        if(z > 0) {
            walked = 238 - z;
        } else if(z < 0) {
            walked = 238 + Math.abs(z);
        }
    } 
    // same thing but inverted. 
    else if(row == 1 || row == 3 || row == 5) {
        if(z < 0) {
            walked = 238 - Math.abs(z);
        } else if(z > 0) {
            walked = 238 + Math.floor(z);

        }
    }

    // return the calculated blocks walked, we will use this to calculate the percentage of the row the player has walked
    return walked;

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

// this port may be changed, make sure that you account for this when routing the server and button page events
app.listen(7070, () => {
    console.log('server on');
})

// set an interval that will ping the minecraft client every second for its position and determine if a new action state needs to be toggled
setInterval(async () => {
    if(toggled == true) {

        let res = await axios.get("http://localhost:8080/position");

        if((column == 1 || column == 2 || column == 3) && !isMovingForward) {

            if(row == 1 && !isMovingForward) {
                console.log(`${row} - ${column}`);
                if(res.data.z > 238) {
                    row++;
                    robot.keyTap('d');
                    robot.keyTap('s');
                }
            } else if(row == 2 && !isMovingForward) {
                console.log(`${row} - ${column}`);
                if(res.data.z < -238) {
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

        } else if(column == 4) {
            
            if(row == 1 && !isMovingForward) {
                console.log(`${row} - ${column}`);
                if(res.data.z > 238) {
                    row++;
                    robot.keyTap('d');
                    robot.keyTap('s');
                }
            } else if(row == 2 && (Math.floor(res.data.z) < -239) && !isMovingForward) {
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

        // log the current state of macro data
        /**console.log(`
        \n\n\n\n\n
            ===============[Mega Farm Macro]===============\n
                   Script Time: ${convertSeconds(seconds)}\n
                   Current Row: ${row}\n
                   Current Zed: ${Math.floor(res.data.z)}\n
                   Row Progress: ${Math.floor(getPercent(calculateWalked(res.data.z), 476))}%
                   \n\n\n\n\n\n\n\n\n
        `); **/

    }

}, 700);


