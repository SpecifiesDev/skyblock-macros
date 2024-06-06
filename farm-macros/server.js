const robot = require('robotjs');
const express = require('express');
const axios = require('axios')
const path = require('path');
const fs = require('fs');

// load our config.json file
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));

// loop over all .js files in /macros and place them into a map
const macros = fs.readdirSync(path.join(__dirname, 'macros')).reduce((acc, file) => {
    if (file.includes('.js')) {
        acc[file.split('.')[0]] = require(`./macros/${file}`);
    }
    return acc;
}, {});

// use our config to determine which macro has been selected. if a null value is found,
// we will throw an error and kill the app.
const selectedMacro = macros[config.toggled_macro];
if(!selectedMacro) {
    console.error('Invalid macro selected in config.json. Check your spelling and try again');
    process.exit(1);
}

// init our express app for our server controller
const app = express();

// configure express to use EJS
// this allows us to passthrough ip variables to our view
// making changing machines as simple as changing the config.json file
// to the new ip
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// create a / route that will render our index.ejs file
app.get('/button', (req, res) => {
    const ip = `http://${config.host}:${config.control_server_port}`;
    res.render('index', {ip});
});

// create a /toggled route so that our client can check if macro is toggled
app.get('/toggled', (req, res) => {

    res.json({
        success: true,
        toggled: selectedMacro.isToggled()
    });
});

// /start route that will toggle the macro. 
app.get('/start', async (req, res) => {

    // if the user has indicated they want to use AHK, we will spool the script up
    if(config.spool_auto_hotkey) {
        await selectedMacro.spoolAHKScript();
    }

    // if the macro is cane, we need to pass in the cane config
    if(selectedMacro.name === 'cane') {
        await selectedMacro.start(config.execution_delay, config.cane_columns);
    } else {
        await selectedMacro.start(config.execution_delay);
    }

    // send a response back to the client
    res.json({
        success: true,
        toggled: selectedMacro.isToggled()
    });

});

// /stop route that will toggle the macro off
app.get('/stop', async (req, res) => {

    await selectedMacro.stop();

    res.json({
        success: true,
        toggled: selectedMacro.isToggled()
    });
});


// start our express app on the configured port
app.listen(config.control_server_port, () => {
    console.log(`Server started on port ${config.control_server_port}`);
});






// init our express app for our server controller

