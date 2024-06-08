const robot = require('robotjs');
const express = require('express');
const axios = require('axios')
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// load our config.json file
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));

const utils = require('./utils');   

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

// load our voice actions for keys and functions
const keyActions = utils.loadKeyActions();
const functionActions = utils.loadFunctionActions();

// init our express app for our server controller
const app = express();

app.use(express.json());
app.use(cors({
    origin: utils.allowLocalNetowrk,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// configure express to use EJS
// this allows us to passthrough ip variables to our view
// making changing machines as simple as changing the config.json file
// to the new ip
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// create a / route that will render our index.ejs file
app.get('/client', (req, res) => {
    const ip = `http://${req.headers.host}`;
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

app.post('/voice/function', async (req, res) => {


    const { action, phrase } = req.body;

    if(!action) {
        return res.json({
            success: false,
            error: 'No action provided'
        });
    }

    if(!functionActions[phrase]) {
        return res.json({
            success: false,
            error: 'Invalid action provided'
        });
    }

    let validAction = functionActions[phrase].func;

    if(validAction === 'stop') {
        await selectedMacro.stop;
    }

    if(validAction === "start") {
        if(selectedMacro.name === 'cane') {
            await selectedMacro.start(config.execution_delay, config.cane_columns);
        } else {    
            await selectedMacro.start(config.execution_delay);
        }
    }

    return res.json({
        success: true,
        message: `Successfully ran ${action}`
    });




});

app.post('/voice/key', async (req, res) => {    

    const { key, phrase } = req.body;

    if(!key) {
        return res.json({
            success: false,
            error: 'No key provided'
        });
    }

    if(!keyActions[phrase]) {
        return res.json({
            success: false,
            error: 'Invalid key provided'
        });
    }

    let validKey = keyActions[phrase].key;

    robot.keyTap(validKey);

    return res.json({
        success: true,
        message: `Successfully pressed ${key}`
    });

});

// start our express app on the configured port
app.listen(config.control_server_port, () => {
    console.log(`Server started on port ${config.control_server_port}`);
});








// init our express app for our server controller

