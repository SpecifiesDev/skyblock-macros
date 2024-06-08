
const fs = require('fs');
const requestIp = require('request-ip');

// a list of valid keys that robot.js can use
// we will use these to validate user inputted actions
const validKeys = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'enter', 'escape', 'backspace', 'tab', 'space',
    'up', 'down', 'left', 'right',
    'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'
    // Add other keys as needed
];

const validFunctions = [
    "clearKeys",
    "stop",
    "start"
];


const isValidKey = (key) => validKeys.includes(key);


const loadKeyActions = () => {
    // Read the JSON file
    let actions = JSON.parse(fs.readFileSync('./actions.json', 'utf8'));

    // Extract key actions
    let key_actions = actions.key_actions;

    // Map to store loaded actions
    let loaded_actions = {};

    // Iterate over key actions
    for (let keyAction of key_actions) {
        let key = keyAction.key;
        let phrase = keyAction.phrase;
        
        if (!isValidKey(key)) {
            console.error(`Invalid key found in actions.json: ${key}`);
        } else {
            // Store the key with its corresponding phrase
            loaded_actions[key] = phrase;
        }
    }

    return loaded_actions;
}

const loadFunctionActions = () => {

    let actions = JSON.parse(fs.readFileSync('./actions.json'));

    let function_actions = actions.function_actions;

    // map to store loaded actions
    let loaded_actions = {};
    
    for(let index in function_actions) {
        let func = function_actions[index];
        if(!validFunctions.includes(func.function)) {
            console.error(`Invalid function found in actions.json: ${func}`);
        } else {
            loaded_actions[func.phrase] = function_actions[{func: func.function, phrase: func.phrase}];
        }
    }

    return loaded_actions;

}


const allowLocalNetwork = (req, callback) => {

    // general local ip range of most ISPs. 
    const localIPRange = "192.168.1";

    // get the ip address of the incoming request
    let ip = requestIp.getClientIp(req);

    if(ip && ip.includes(localIPRange)) {
        callback(null, true); // allow cors to go through
    } // else deny the request
    else {
        callback(new Error('Not allowed by CORS policies. IP is not in local-network range.'));
    
    }

}








module.exports = {
    loadKeyActions,
    loadFunctionActions,
    allowLocalNetwork
};