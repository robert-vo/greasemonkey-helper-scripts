const checkElementById = async selector => {
    while (document.getElementById(selector) === null) {
        await new Promise(resolve => requestAnimationFrame(resolve))
    }
    return document.getElementById(selector);
};

const checkElementByQuerySelector = async selector => {
    while (document.querySelector(selector) === null) {
        await new Promise(resolve => requestAnimationFrame(resolve))
    }
    return document.querySelector(selector);
};


// https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
// const elm = await waitForElm('.some-class');
const waitForElm = selector => {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const insertAfter = (referenceNode, newNode) => {
    referenceNode.parentNode.insertBefore(
        newNode,
        referenceNode.nextSibling
    );
}

const insertBefore = (referenceNode, newNode) => {
    referenceNode.parentNode.insertBefore(
        newNode, 
        referenceNode
    );
}

const wait = async milliseconds => {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
}


function log(text) {
    console.log(text);
}

const reload = () => {
    window.location.reload();
}

var maxAttempts = 50;
var defaultTimeout = 500;

const attemptClickElementById = async (id) => {
    checkElementById(id).then(async (selector) => {
        log('found! trying to click...');
        while(maxAttempts-- > 0) {
            log('attempt # ' + maxAttempts);
            await wait(defaultTimeout);
            console.log(selector)
            if(selector.disabled !== true) {
                console.log('can i has click')
                selector.click();
            } else {
                console.log("id: %s is diabled! not clicking.", id);
            }
        }
        log('ran out of clicks :/ reloading page!');
        window.location.reload();
    })
}


const average = (nums) => {
        return nums.reduce((a, b) => (a + b)) / nums.length;
}

const sumReducer = (accumulator, currentValue) => Number(accumulator) + Number(currentValue);