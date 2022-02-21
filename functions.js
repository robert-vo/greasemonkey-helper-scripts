const checkElementById = async selector => {
    while (document.getElementById(selector) === null) {
        await new Promise(resolve => requestAnimationFrame(resolve))
    }
    return document.getElementById(selector);
};


const wait = async milliseconds => {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
}


function log(text) {
    console.log(text);
}


var maxAttempts = 50;
var defaultTimeout = 500;

const attemptClickElementById = async id => {
    checkElementById(id).then(selector => {
        while(maxAttempts > 0) {
            maxAttempts--;
            selector.click();
        }
    }
}