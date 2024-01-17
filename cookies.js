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
const startOfYear = new Date(currDate.getFullYear(), 0, 1);
const earliestDate = new Date("05/29/2018"); // earliest date is 5/29/2018
const timeToDaysMultiplier = 1000 * 60 * 60 * 24;
const getDays = (startDate) => Math.floor((currDate - startDate) / timeToDaysMultiplier);

const DAYS_SEARCH_DISPLAY_STRINGS = {
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

const DAYS_MOVING_AVERAGE_DISPLAY_STRINGS = {
    TWO_DAYS: '2-day MA',
    THREE_DAYS: '3-day MA',
    SEVEN_DAYS: '7-day MA',
    FIFTEEN_DAYS: '15-day MA',
    THIRTY_DAYS: '30-day MA',
    FOURTY_FIVE_DAYS: '45-day MA',
    SIXTY_DAYS: '60-day MA',
    THREE_MONTHS: '3-month MA',
    SIX_MONTHS: '6-month MA',
    ONE_YEAR: '1-year MA',
}

const DEFAULT_DAYS_SEARCH_COOKIE_VALUE = 30;
const DEFAULT_DAYS_MOVING_AVERAGE_COOKIE_VALUE = 7;
const DEFAULT_COOKIE_EXPIRATION_IN_DAYS = 365;
const DAYS_SEARCH_COOKIE_NAME = 'Q2hhcnRDb29raWU' // ChartCookie minus = base64
const DAYS_MOVING_AVERAGE_COOKIE_NAME = 'RGF5c01vdmluZ0F2ZXJhZ2UK' // DaysMovingAverage minus = base64

var daysSearchbuttonConfig = [
    {
        display: DAYS_SEARCH_DISPLAY_STRINGS.ONE_DAY,
        value: 1
    },
    {
        display: DAYS_SEARCH_DISPLAY_STRINGS.FIVE_DAYS,
        value: 5
    },
    {
        display: DAYS_SEARCH_DISPLAY_STRINGS.FIFTEEN_DAYS,
        value: 15
    },
    {
        display: DAYS_SEARCH_DISPLAY_STRINGS.THIRTY_DAYS,
        value: 30
    },
    {
        display: DAYS_SEARCH_DISPLAY_STRINGS.FOURTY_FIVE_DAYS,
        value: 45
    },
    {
        display: DAYS_SEARCH_DISPLAY_STRINGS.SIXTY_DAYS,
        value: 60
    },
    {
        display: DAYS_SEARCH_DISPLAY_STRINGS.THREE_MONTHS,
        value: 90
    },
    {
        display: DAYS_SEARCH_DISPLAY_STRINGS.SIX_MONTHS,
        value: 180
    },
    {
        display: DAYS_SEARCH_DISPLAY_STRINGS.YEAR_TO_DATE,
        value: DAYS_SEARCH_DISPLAY_STRINGS.YEAR_TO_DATE
    },
    {
        display: DAYS_SEARCH_DISPLAY_STRINGS.ONE_YEAR,
        value: 365
    },
    {
        display: DAYS_SEARCH_DISPLAY_STRINGS.TWO_YEARS,
        value: 730
    },
    {
        display: DAYS_SEARCH_DISPLAY_STRINGS.ALL_TIME,
        value: DAYS_SEARCH_DISPLAY_STRINGS.ALL_TIME
    },
    {
        display: DAYS_SEARCH_DISPLAY_STRINGS.CLEAR,
        value: DEFAULT_DAYS_SEARCH_COOKIE_VALUE
    }
];

var daysMovingAveragebuttonConfig = [
    {
        display: DAYS_MOVING_AVERAGE_DISPLAY_STRINGS.TWO_DAYS,
        value: 2
    },
    {
        display: DAYS_MOVING_AVERAGE_DISPLAY_STRINGS.THREE_DAYS,
        value: 3
    },
    {
        display: DAYS_MOVING_AVERAGE_DISPLAY_STRINGS.SEVEN_DAYS,
        value: DEFAULT_DAYS_MOVING_AVERAGE_COOKIE_VALUE
    },
    {
        display: DAYS_MOVING_AVERAGE_DISPLAY_STRINGS.FIFTEEN_DAYS,
        value: 15
    },
    {
        display: DAYS_MOVING_AVERAGE_DISPLAY_STRINGS.THIRTY_DAYS,
        value: 30
    },
    {
        display: DAYS_MOVING_AVERAGE_DISPLAY_STRINGS.FOURTY_FIVE_DAYS,
        value: 45
    },
    {
        display: DAYS_MOVING_AVERAGE_DISPLAY_STRINGS.SIXTY_DAYS,
        value: 60
    },
    {
        display: DAYS_MOVING_AVERAGE_DISPLAY_STRINGS.THREE_MONTHS,
        value: 90
    },
    {
        display: DAYS_MOVING_AVERAGE_DISPLAY_STRINGS.SIX_MONTHS,
        value: 180
    },
    {
        display: DAYS_MOVING_AVERAGE_DISPLAY_STRINGS.ONE_YEAR,
        value: 365
    }
];

const checkForDefaultCookie = () => {
    var cookie = getCookie(DAYS_SEARCH_COOKIE_NAME);

    if(!cookie) {
        setCookie(DAYS_SEARCH_COOKIE_NAME, DEFAULT_DAYS_SEARCH_COOKIE_VALUE, DEFAULT_COOKIE_EXPIRATION_IN_DAYS);
    }
}

const getDaysSearchCookieValue = () => {
    return getCookie(DAYS_SEARCH_COOKIE_NAME);
}

const getNumberOfDaysFromCookie = () => {
    const currDayOfYear = getDays(startOfYear);
    const numberOfDaysToBeginning = getDays(earliestDate);

    var cookie = getDaysSearchCookieValue();

    if(!cookie) {
        setCookie(DAYS_SEARCH_COOKIE_NAME, DEFAULT_DAYS_SEARCH_COOKIE_VALUE, DEFAULT_COOKIE_EXPIRATION_IN_DAYS);
        return DEFAULT_DAYS_SEARCH_COOKIE_VALUE;
    }

    switch(cookie) {
        case DAYS_SEARCH_DISPLAY_STRINGS.YEAR_TO_DATE:
            return currDayOfYear;
        case DAYS_SEARCH_DISPLAY_STRINGS.ALL_TIME:
            return numberOfDaysToBeginning;
        default:
            return cookie;
    }
}

const getDaysMovingAverageFromCookie = () => {
    const cookie = getCookie(DAYS_MOVING_AVERAGE_COOKIE_NAME);

    if(!cookie) {
        setCookie(DAYS_MOVING_AVERAGE_COOKIE_NAME, DEFAULT_DAYS_MOVING_AVERAGE_COOKIE_VALUE, DEFAULT_COOKIE_EXPIRATION_IN_DAYS)
        return DEFAULT_DAYS_MOVING_AVERAGE_COOKIE_VALUE;
    }
    return cookie;
}

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

const updateDaysSearchCookie = (display, value) => {
    setCookie(DAYS_SEARCH_COOKIE_NAME, value, DEFAULT_COOKIE_EXPIRATION_IN_DAYS);

    if(display === DAYS_SEARCH_DISPLAY_STRINGS.CLEAR) {
        eraseCookie(DAYS_SEARCH_COOKIE_NAME);
    }
    window.location.reload();
}

const updateDaysMovingAverageCookie = (display, value) => {
    setCookie(DAYS_MOVING_AVERAGE_COOKIE_NAME, value, DEFAULT_COOKIE_EXPIRATION_IN_DAYS);
    window.location.reload();
}

const getCssClassForDaysSearch = (display, value) => {
    if (display == DAYS_SEARCH_DISPLAY_STRINGS.CLEAR) {
        return otherButtonClass; // never highlight clear
    }
    return display == getDaysSearchCookieValue() || value == getNumberOfDaysFromCookie() ? selectedButtonClass : otherButtonClass;
}

const getCssClassForDaysMovingAverage = (display, value) => {
    return display == getDaysMovingAverageFromCookie() || value == getDaysMovingAverageFromCookie() ? selectedButtonClass : otherButtonClass;
}

const daysSearchId = 'daysSearch';
const daysMovingAverageId = 'ma';

const templateButtonHtml = (id, button, cssClassFunction) => `<button type="button" id="${id}${button.display}" class="${cssClassFunction(button.display, button.value)}">${button.display}</button>`;
const templateButtonId = (id, button) => `${id}${button.display}`

const getDaysSearchHtml = () => {
    const html = daysSearchbuttonConfig.map((button) => templateButtonHtml(daysSearchId, button, getCssClassForDaysSearch)).join('');
    return html;
}

const getDaysMovingAverageHtml = () => {
    const html = daysMovingAveragebuttonConfig.map((button) => templateButtonHtml(daysMovingAverageId, button, getCssClassForDaysMovingAverage));
    return html;
}

const attachEventListenerToCookieButtons = () => {
    const click = 'click';
    daysSearchbuttonConfig.forEach((button) => {
        document.getElementById(templateButtonId(daysSearchId, button)).addEventListener(click, updateDaysSearchCookie.bind(this, button.display, button.value), false);
    });

    daysMovingAveragebuttonConfig.forEach((button) => {
        document.getElementById(templateButtonId(daysMovingAverageId, button)).addEventListener(click, updateDaysMovingAverageCookie.bind(this, button.display, button.value), false);
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
