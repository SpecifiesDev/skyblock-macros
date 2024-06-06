# Skyblock Macros

In the past I have attempted to construe if this was for Hypixel. It is obviously for Hypixel. 

## Description

This repo is a compilation of multiple macros I have written for various Skyblock task automation. Each sub folder (I.E /fishing) indicates the task with its name. 

## Table of Contents

- [Installation](#installation)
- [Application Layer](#Application_Layer)
- [Recommendations](#Recommendations)
- [Configuration](#Configuration)
- [Known Errors](#Errors)

## Recommendations

- Run this inside of a HyperV or anything outside of your main pc. If you run this through a HyperV, you will need to do GPU passthrough. I personally have this macro setup on a laptop in a back room. I use parasec with wake-on-lan configurations to be able to connect to it from my main pc. Doing this allows me to run the macro in my vision while still playing games or doing work.

- Never leave this macro running unless you are in the immediate vicinity and able to disable it. You will get banned if you are macro checked.

- Keep an eye out for voice command functionality. I'm already using it on my own, and it works great. Just trying to work on some things before I push it to the main branch of the repo. Just for example of how it works, I leave my volume on and walk away to do something. I have a wireless headset. As soon as I hear no breaking for more than 4 seconds, I can say "computer stop macro" and everything forcekills.

- Create a pattern. I know that for the pumpkin macro if I have pest spray on, on average its about 45 minutes before I need to check the garden, clear pests, and visitors.

## Configuration
As version 1.2 of the server-controller, configuration variables are now supported. To adjust them, open up config.json using any text editor (vsc).

Here are the config variables and what they will indicate:

### control_server_port
Whatever you set this to, the server will start on this port. 8080 will still be used by the mod. As of right now, there is no way to configure this. If you have something else taking port 8080, you may need to recompile the mod from src in /mod-src.

### spool_auto_hotkey
A boolean value indicating if you want AHK scripts to be started when a macro is toggled.

### toggled_macro
A string variable indicating which macro you want to be running. This directly corresponds to file names in /macros. As of writing this the three are: pumpkin, cane, and mega.

### execution_delay
An integer measured in miliseconds that indicates how often the interval will check the players position. I would not set this too high, as the higher you go the longer you will wait at end of the rows before switching direction logics.

### host
IP address indicating where requests from the client should be sent. This is primarily used if you're going to be activating the macro from a separate client

### cane_columns
An integer indicating how many columns of cane are in your farm design.

## Installation

It is expected that you have some know how of how to run basic cmd prmpt command such as cd and how to execute node scripts.

### Dependencies

Before installing and using this project, make sure you have the following dependencies installed:

- [Forge Mod](https://files.minecraftforge.net/) - This mod is required to alter player movement in Minecraft 1.8.9.
- [Node.js](https://nodejs.org/) - This runtime environment is needed to run the Node.js Control Server.
- [AutoHotkey](https://www.autohotkey.com/) - This scripting language is required for running the AHK script. This macro supports v1.1 of AHK, not v 2.1+.

### Steps

To install and use this project, follow these steps:

1. Download and install Forge Mod from the official website.
2. Place this macro's mod server in your mods folder.
3. Install Node.js by downloading the installer from the official website and following the installation instructions.
4. Download and install AutoHotkey from the official website.
5. Make sure you include AHK's path folder in your PATH variables. This is for macros that spool AHK scripts execute them.
6. Clone or download this repository to your local machine.
7. Open a command prompt or terminal and navigate to the project directory.
8. Run the following command to install the required Node.js dependencies:
2. Install Node.js by downloading the installer from the official website and following the installation instructions.
3. Download and install AutoHotkey from the official website.
4. Make sure you include AHK's path folder in your PATH variables. This is for macros that spool AHK scripts execute them.
4. Clone or download this repository to your local machine.
5. Open a command prompt or terminal and navigate to the project directory.
6. Run the following command to install the required Node.js dependencies:

    ```
    npm install
    ```

9. cd to the macro you want to execute and run this command. Detailed macro instructions will be located on a readme in the macro subdir.

    ```
    node app.js
    ```
10. If you are using a macro that has a frontend layer, you will need to make sure to change the host IP in the config.json file.

Please note that with the new configuration system, some of this may be optional. AHK scripts are completely optional, and can be toggled in config.json. You will just need to come up with a way to hold keys.



## Application Layer

In order to achieve the ability to macro, I created three layers to the macro application. The primary reason for this is because 1.8.9 forge does not create a great solution for altering player movement that doesn't seem robotic. 

- Forge Mod - This layer of the application essentially opens an HTTP server that can send data about your minecraft client in real time. Server runs on port 8080. This cannot be changed absent recompiling the mod.
- Node.JS Control Server - This layer controls everything. It handles the execution of the macros, and sending requests to the client server to perform the macro.
- Frontend control - (mega farm macro) This is a website that makes it easier to stop/start the mega farm macro. Clicking start spools the AHK script (requires AHK in your path env), and stop will despool it using an escape command.

You may be wondering, why do it this way when it locks user input? My answer to that is, use a VM. When I used this I would side tray into a full fledge VM or HV and play other games while letting the macro run.

## Errors
There are a few known errors

- Starting a macro logic function while game is not launched will crash the macro.
- If a macro requires in-game data such as player cords, starting a macro will both crash the macro and Minecraft.


