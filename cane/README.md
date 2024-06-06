#  Mega Farm Macro
This macro is designed to allow the user to automatically farm the mega farm design. If you unaware of this design, look it up on youtube. Please keep in mind that this macro is designed with coordinate ranges from left of the Garden to the right. If you want to farm right to left, you will need to edit app.js->interval to detect new coordinate ranges.

## Requirements
- Have mod in your mods folder and have minecraft up.
- Install all of the prerequisites listed in the main README.
- Make sure AutoHotKey has been added to your PATH environment variable. This macro uses this path value to spool and de-spool the AHK script on start/stop.
- Any auto clicker that can hold a key. I use MaxAutoClicker. Set its toggle button to the DEL key.

## Features
- Automatically switch direction one second after it is detected player has reached end of the mega farm.
- Controlled via a webpage. Clicking stop will kill the node process and the auto hot key scripts running.
- At the end of the mega farm this macro is designed to where you fall off and teleport back to spawn.

## Using
1. First you want to install all pre-reqs defined in the main README. cd to this folder and run ```node App.js``. Your macro is now listening for start input.

2. Before starting, you want to make sure your spawn is set to the top of the mega farm row. You can do this with /setspawn. This will ensure once you fall into the void, you teleport back to the start. The macro depends on this logic to loop infinitely.
(P.S, best pitch/yaw is exactly 90 degrees. A trick is to set your spawn at this value and every time you /warp garden, your pitch/yaw will be set to this.)

3. Open up the webpage. If opening from a local machine, you simply need to go to http://localhost:7070/button. If you are opening from another device you first need to edit the index.HTML file and edit any line that points to http://192.168.1.16* to your machines local IPv4 address. Refer to main README for more details on how to find this address.

4. Click start. As long as MaxAutoClicker is up and you have setup your AHK path variables properly, the macro will execute. Every second it will print info such as percent of the row you've completed, time the script has been running, etcetera.