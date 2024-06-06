const robot = require('robotjs');
const express = require('express');
const axios = require('axios')
const path = require('path');


const app = express();

var pling = false;

var seconds = 0;
var casts = 0;

const interval = setInterval(() => {
    seconds++;
    console.log(`
    
    
    
    
    
    




// I do this out of personal preference (I like to see the input on a "new page")
// alternatively you could flush the buffer prior to sending next cast.
\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n



========[Fishing Macro v1.0]===========
            Time Fishing: ${convertSeconds(seconds)}
            Total Casts: ${casts}
========[Made by SpecifiesDev]=========
    `);
}, 1000);


// pads a number with zeros if it is a single integer
const pad = (num, size) => {
    num = num.toString();
    while(num.length < size) num = "0" + num;
    return num;
}

// converts a given seconds to a HH:MM:SS format
const convertSeconds = (seconds) => {
    hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    minutes = Math.floor(seconds / 60);
    second = seconds % 60;
    return `${hours == 0 ? '' : pad(hours, 2) + ":"}${minutes == 0 ? '00' : pad(minutes, 2)}:${second == 0 ? '00' : pad(second, 2)}`;
}

app.get('/fish', (req, res) => {
    
    // check if pling is in a true state,
    // this will prevent accidental double casting.
    // a new request will also be ignored until the reel and re-cast is complete.
    if(pling == false) {

        // set pling to true
        pling = true;

        // immediately click the right mouse button to reel in the fish
        setTimeout(() => {
            robot.mouseClick("right", false);
        }, 100);

        // wait 600ms before clicking the right mouse button again to cast the rod
        // this is to prevent the rod from being casted too quickly
        // you can also randomize this time, but should not exceed 1000ms
        // as the fish will swim away.
        setTimeout(() => {
            robot.mouseClick("right", false);
            casts++;
            pling = false;
        }, 600);

    } 
    res.json({success: true});
});

// this MUST be hosted on port 7070, unless you recompile the mod with a different port.
// in the future I may add a configuration option for this, but the port is pretty arbirtrary
// so absent any personal conflicts, should not be in issue.
app.listen(7070, () => {
    console.log('on');
});




