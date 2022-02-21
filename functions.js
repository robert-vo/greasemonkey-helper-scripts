const checkElement = async selector => {
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
