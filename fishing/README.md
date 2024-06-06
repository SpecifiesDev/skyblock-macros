# Fishing Macro
This macro is designed to allow the user to automatically fish.

## Requirements
- Have mod in your mods folder and have minecraft up.
- Install all of the prerequisites listed in the main README.
- This has an additional dependency of having NEU or any other fishing mod that creates the "PLING" sound when a fish is detected.

## Using
1. First, you want to start the fishing macro. CD to this macro's folder in a command prompt and run ```node app.js``` The macro works by waiting for a pling sound to be played, at which point the client sends a request to the control server.

2. In order to prevent lag, listening is naturally disabled until you toggle the macro. The toggle command is /togglefishing. To turn it off, run it again.

3. Once you have the server started and fishing toggled, throw a rod. As soon as a fish is detected macro will reel in after 100ms, then recast after 600. 
