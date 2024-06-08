// import all of our necessary modules
const vosk = require('vosk');
const fs = require('fs');
const mic = require('node-record-lpcm16');

// load our config
const config = JSON.parse(fs.readFileSync('./config.json'));

// load our model path and our sample rate from the config
const modelPath = config.model_path;
const sampleRate = config.sample_rate;
const microphone = config.microphone;

const utils = require('./utils');

// load our available actions
const actions = JSON.parse(fs.readFileSync('./actions.json'));

// load our valid keys and functions
let keyActions = utils.loadKeyActions();
let functionActions = utils.loadFunctionActions();


// check if the model location exists, if not exit
if (!fs.existsSync(modelPath)) {
    console.error('Model path does not exist. Check your config.json file and try again');
    process.exit(1);
}

// declare vosk's log level 0 being the least verbose of logging, and 3 being the most.
vosk.setLogLevel(0);

// create a new vosk model from the model path
const model = new vosk.Model(modelPath);

// create a new vosk recognizer from the model and sample rate
const rec = new vosk.Recognizer({model: model, sampleRate: sampleRate});

// createa a new mic instance
const micInstance = mic.record({
    sampleRate: sampleRate,
    threshold: 0, // declare minimum volume threshold before recording begins. higher values will require higher level of volumes
    recordProgram: 'rec', // you can also use arecord or sox, it comes down to preference as well as os
    silence: '10.0', // declare the amount of silence before recording ends
}).stream();

// create a new stream event from the mic instance
micInstance.on('data', (data) => {

    // check if the recognizer can accept the mic data
    // if it cannot, log the json string of the error
    if (rec.acceptWaveform(data)) {
        
        // get our result from the recording
        let result = rec.result();

        // get the detected transcription
        const transcription = result.text;

        let validKey = checkForKeyActions(transcription);

        let validFunc = checkForFunctionActions(transcription);

        let host = `http://${config.control_server.host}:${config.control_server.port}`;

        if(validKey) {
            console.log(`Detected key action: ${validKey}`);

            axios.post(`${host}/voice/key`, {key: validKey.key, phrase: validKey.phrase}, (err, res) => {
                
                console.log(res);
            });

            
        } else if(validFunc) { // inclusive else if to ensure that if user says both, we will only execute one action
            console.log(`Detected function action: ${validFunc}`);

            axios.post(`${host}/voice/function`, {function: validFunc.function}, (err, res) => {
                console.log(res);
            }); 
        }



    } 

});

micInstance.on('error', (err) => {
    console.error(`Error in audio stream: ${err}`);
});

const checkForKeyActions = (transcription) => {

    // get keyvalues
    const keyValues = Object.values(keyActions);

    for(let keyValue of keyValues) {
        if(transcription.includes(keyValue)) {
            return keyValue;
        }
    }

    return null;


}

const checkForFunctionActions = (transcription) => {

    // get function values
    const functionValues = Object.values(functionActions);

    for(let functionValue of functionValues) {
        if(transcription.includes(functionValue)) {
            return functionValue;
        }
    }

    return null;
}

console.log('Listening for audio...');