var Gpio = require('pigpio').Gpio;

// Pin number assignment for L293D
const PWMA_PIN_NUM = 24;
const AIN1_PIN_NUM = 23;
const AIN2_PIN_NUM = 18;

const PWMB_PIN_NUM = 22;
const BIN1_PIN_NUM = 27;
const BIN2_PIN_NUM = 17;

// GPIO PIN open
var PWMA_PIN = new Gpio(PWMA_PIN_NUM, { mode: Gpio.OUTPUT });
var AIN1_PIN = new Gpio(AIN1_PIN_NUM, { mode: Gpio.OUTPUT });
var AIN2_PIN = new Gpio(AIN2_PIN_NUM, { mode: Gpio.OUTPUT });

var PWMB_PIN = new Gpio(PWMB_PIN_NUM, { mode: Gpio.OUTPUT });
var BIN1_PIN = new Gpio(BIN1_PIN_NUM, { mode: Gpio.OUTPUT });
var BIN2_PIN = new Gpio(BIN2_PIN_NUM, { mode: Gpio.OUTPUT });

function pin_init() {
    PWMA_PIN.digitalWrite(0);
    PWMB_PIN.digitalWrite(0);
    AIN1_PIN.digitalWrite(0);
    AIN2_PIN.digitalWrite(0);
    BIN1_PIN.digitalWrite(0);
    BIN2_PIN.digitalWrite(0);
}

console.log("==== PIN stat ====");
console.log("PWMA range: " + PWMA_PIN.getPwmRange());
console.log("PWMA freq: " + PWMA_PIN.getPwmFrequency());

console.log("PWMB range: " + PWMB_PIN.getPwmRange());
console.log("PWMB freq: " + PWMB_PIN.getPwmFrequency());

/*
L293D
Ref: http://www.robotplatform.com/howto/L293/motor_driver_1.html
Truth table
Input                   Function
PWM     IN1     IN2    
H       H       L       Reverse
H       L       H       Forward
H       H       H       Stop
H       L       L       Stop
L       X       X       Stop
*/

function forword() {
    // ==== A ====
    PWMA_PIN.digitalWrite(1);
    AIN1_PIN.digitalWrite(1);
    AIN2_PIN.digitalWrite(0);

    // ==== B ====
    PWMB_PIN.digitalWrite(1);
    BIN1_PIN.digitalWrite(0);
    BIN2_PIN.digitalWrite(1);
}

function backword() {
    // ==== A ====
    PWMA_PIN.digitalWrite(1);
    AIN1_PIN.digitalWrite(0);
    AIN2_PIN.digitalWrite(1);

    // ==== B ====
    PWMB_PIN.digitalWrite(1);
    BIN1_PIN.digitalWrite(1);
    BIN2_PIN.digitalWrite(0);
}

function turnleft() {
    // ==== A ====
    PWMA_PIN.digitalWrite(1);
    AIN1_PIN.digitalWrite(1);
    AIN2_PIN.digitalWrite(0);

    // ==== B ====
    PWMB_PIN.digitalWrite(1);
    BIN1_PIN.digitalWrite(1);
    BIN2_PIN.digitalWrite(0);
}

function turnright() {
    // ==== A ====
    PWMA_PIN.digitalWrite(1);
    AIN1_PIN.digitalWrite(0);
    AIN2_PIN.digitalWrite(1);

    // ==== B ====
    PWMB_PIN.digitalWrite(1);
    BIN1_PIN.digitalWrite(0);
    BIN2_PIN.digitalWrite(1);
}

/*
var button = new Gpio(button_pin, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.EITHER_EDGE
});

button.on('interrupt', function (level) {
    console.log("Interrupt");
    if (level > 0) {
        //console.log("Down");

        red2 = !red2;
    }
    else {
        //console.log("Up");
    }
});
*/

pin_init();

var keypress = require('keypress');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
var stopmotor;
process.stdin.on('keypress', function (ch, key) {
    //console.log('got "keypress"', key);

    if (key && key.name == 'up') {
        console.log("A");
        if (stopmotor)
            clearTimeout(stopmotor);
        forword();
    } else if (key && key.name == 'down') {
        console.log("V");
        if (stopmotor)
            clearTimeout(stopmotor);
        backword();
    } else if (key && key.name == 'left') {
        console.log("<");
        if (stopmotor)
            clearTimeout(stopmotor);
        turnleft();
    } else if (key && key.name == 'right') {
        console.log(">");
        if (stopmotor)
            clearTimeout(stopmotor);
        turnright();
    } else if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
    }

    stopmotor = setTimeout(function () {
        pin_init();
    }, 100);
});

process.stdin.setRawMode(true);
process.stdin.resume();



process.on('SIGINT', function () {
    console.log("Reversed all pin to 0");
    pin_reset();
    process.exit();
});

