const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const currDate = new Date();
const startOfYear = new Date(currDate.getFullYear(), 0, 0);
const earliestDate = new Date("05/29/2018"); // earliest date is 5/29/2018
const timeToDaysMultiplier = 1000 * 60 * 60 * 24;
const getDays = (startDate) => Math.floor((currDate - startDate) / timeToDaysMultiplier);

const DISPLAY_STRINGS = {
    ONE_DAY: '1 day',
    FIVE_DAYS: '5 days',
    FIFTEEN_DAYS: '15 days',
    THIRTY_DAYS: '30 days',
    FOURTY_FIVE_DAYS: '45 days',
    SIXTY_DAYS: '60 days',
    THREE_MONTHS: '3 months',
    SIX_MONTHS: '6 months',
    YEAR_TO_DATE: 'YTD',
    ONE_YEAR: '1 year',
    TWO_YEARS: '2 years',
    ALL_TIME: 'All time',
    CLEAR: 'Clear'
}

const DEFAULT_COOKIE_VALUE = 30;
const DEFAULT_COOKIE_EXPIRATION_IN_DAYS = 365;
const COOKIE_NAME = 'Q2hhcnRDb29raWU' // ChartCookie minus = base64

var buttonConfig = [
    {
        display: DISPLAY_STRINGS.THIRTY_DAYS,
        value: 30
    },
    {
        display: DISPLAY_STRINGS.FOURTY_FIVE_DAYS,
        value: 45
    },
    {
        display: DISPLAY_STRINGS.SIXTY_DAYS,
        value: 60
    },
    {
        display: DISPLAY_STRINGS.THREE_MONTHS,
        value: 90
    },
    {
        display: DISPLAY_STRINGS.SIX_MONTHS,
        value: 180
    },
    {
        display: DISPLAY_STRINGS.YEAR_TO_DATE,
        value: DISPLAY_STRINGS.YEAR_TO_DATE
    },
    {
        display: DISPLAY_STRINGS.ONE_YEAR,
        value: 365
    },
    {
        display: DISPLAY_STRINGS.TWO_YEARS,
        value: 730
    },
    {
        display: DISPLAY_STRINGS.ALL_TIME,
        value: DISPLAY_STRINGS.ALL_TIME 
    },
    {
        display: DISPLAY_STRINGS.CLEAR,
        value: DEFAULT_COOKIE_VALUE
    }
];

const checkForDefaultCookie = () => {
    var cookie = getCookie(COOKIE_NAME);

    if(!cookie) {
        setCookie(COOKIE_NAME, DEFAULT_COOKIE_VALUE, DEFAULT_COOKIE_EXPIRATION_IN_DAYS);
    }
}

const getCookieValue = () => {
    return getCookie(COOKIE_NAME);
}

const getNumberOfDaysFromCookie = () => {
    const currDayOfYear = getDays(startOfYear);
    const numberOfDaysToBeginning = getDays(earliestDate);

    var cookie = getCookieValue();

    if(!cookie) {
        setCookie(COOKIE_NAME, DEFAULT_COOKIE_VALUE, DEFAULT_COOKIE_EXPIRATION_IN_DAYS);
        return DEFAULT_COOKIE_VALUE;
    }

    switch(cookie) {
        case DISPLAY_STRINGS.YEAR_TO_DATE:
            return currDayOfYear;
        case DISPLAY_STRINGS.ALL_TIME:
            return numberOfDaysToBeginning;
        default:
            return cookie;
    }
}

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

const updateCookie = (display, value) => {
    setCookie(COOKIE_NAME, value, DEFAULT_COOKIE_EXPIRATION_IN_DAYS);

    if(display === DISPLAY_STRINGS.CLEAR) {
        eraseCookie(COOKIE_NAME);
    }
    window.location.reload();
}

const selectedButtonClass = 'Button-button-d6872d2 Button-mint-4f86065 Button-light-08e8f16 Button-size-medium-e64554a';
const otherButtonClass = 'Button-button-d6872d2 Button-mint-4f86065 Button-light-08e8f16 Button-size-medium-e64554a Button-fill-ghost-79530bb';

const getCssClass = (display, value) => {
    if (display == DISPLAY_STRINGS.CLEAR) {
        return otherButtonClass; // never highlight clear
    }
    return display == getCookieValue() || value == getNumberOfDaysFromCookie() ? selectedButtonClass : otherButtonClass;
}

const templateStringForButton = (display, value) => `<button type="button" id="chartscript${display}" class="${getCssClass(display, value)}">${display}</button>`;
const templateIdString = (button) => `chartscript${button.display}`

const getCookieHtml = () => {
    const html = buttonConfig.map((button) => templateStringForButton(button.display, button.value)).join('');
    return html;
}

const attachEventListenerToCookieButtons = () => {
    buttonConfig.forEach((button) => {
        document.getElementById(templateIdString(button)).addEventListener ("click", updateCookie.bind(this, button.display, button.value), false);    
    });
}

const getCookieValueOrDefault = (cookieName, defaultValue) => {
    const cookieValue = getCookie(cookieName);
    if(cookieValue) {
        if(cookieValue != defaultValue) {
            console.log(`for cookie: ${cookieName}, using new value found in cookie: ${cookieValue}`);
        } else {
            console.log(`for cookie: ${cookieName}, value found is the same as default, ${defaultValue}`);
        }

        return cookieValue;
    } else {
        console.log(`for cookie: ${cookieName}, did not find val. returning default: ${defaultValue}`);
        return defaultValue;
    }
}
