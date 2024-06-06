# Skyblock Macros

!! If you are from Hypixel, using these can get you banned. I wrote these more for the challenge. If you choose to macro with them and get banned, that is on you. !!

## Description

This repo is a compilation of multiple macros I have written for various Skyblock task automation. Each sub folder (I.E /fishing) indicates the task with its name. 

## Table of Contents

- [Installation](#installation)
- [Application Layer](#Application_Layer)
- [Known Errors](#Errors)

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
<<<<<<< HEAD
3. Install Node.js by downloading the installer from the official website and following the installation instructions.
4. Download and install AutoHotkey from the official website.
5. Make sure you include AHK's path folder in your PATH variables. This is for macros that spool AHK scripts execute them.
6. Clone or download this repository to your local machine.
7. Open a command prompt or terminal and navigate to the project directory.
8. Run the following command to install the required Node.js dependencies:
=======
2. Install Node.js by downloading the installer from the official website and following the installation instructions.
3. Download and install AutoHotkey from the official website.
4. Make sure you include AHK's path folder in your PATH variables. This is for macros that spool AHK scripts execute them.
4. Clone or download this repository to your local machine.
5. Open a command prompt or terminal and navigate to the project directory.
6. Run the following command to install the required Node.js dependencies:
>>>>>>> a0777903b0c1cb8d8835832a5de956bd6da1574a

    ```
    npm install
    ```

9. cd to the macro you want to execute and run this command. Detailed macro instructions will be located on a readme in the macro subdir.

    ```
    node app.js
    ```
10. If you are using a macro that has a frontend layer, you will need to go into the HTML file and edit any link with the domain "192.168.1.16" with the local ip of your own machine. To get this run ipconfig in cmd prompt. You will want to point to the IPv4 Address, and ensure that any device (phone, etc) is connected to the same network.



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


