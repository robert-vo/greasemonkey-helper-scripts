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
    checkElementById(id).then(async (selector) => {
        while(maxAttempts-- > 0) {
            await wait(500);
            if(selector.disabled !== true) {
                selector.click();
            } else {
                console.log("id: %s is diabled! not clicking.", id);
            }
        }
        log('ran out of clicks :/ maybe try refreshing the page?');
    })
}