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

const dayOfYear = date => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
const DEFAULT_COOKIE_VALUE = 30;
const DEFAULT_COOKIE_EXPIRATION_IN_DAYS = 365;
const COOKIE_NAME = 'ChartCookie'
const currDayOfYear = dayOfYear(new Date());

var buttonConfig = [
    {
        display: '1 day',
        value: 1
    },
    {
        display: '5 days',
        value: 5
    },
    {
        display: '30 days',
        value: 30
    },
    {
        display: '60 days',
        value: 60
    },
    {
        display: '3 months',
        value: 90
    },
    {
        display: '6 months',
        value: 180
    },
    {
        display: 'YTD',
        value: 'YTD'
    },
    {
        display: '1 year',
        value: 365
    },
    {
        display: 'Clear',
        value: DEFAULT_COOKIE_VALUE
    }
];

const checkForDefaultCookie = () => {
    var cookie = getCookie(COOKIE_NAME);

    if(!cookie) {
        setCookie(COOKIE_NAME, DEFAULT_COOKIE_VALUE, DEFAULT_COOKIE_EXPIRATION_IN_DAYS);
    }
}

checkForDefaultCookie();

const updateCookie = (display, value) => {
    setCookie(COOKIE_NAME, value, DEFAULT_COOKIE_EXPIRATION_IN_DAYS);
    reload();
}

const templateFn = (display, value) => `<button type="button" id="chartscript${display}">${display}</button>`;
const templateIdString = (button) => `chartscript${button.display}`

console.log('hi from get cookie: ' + getCookie(COOKIE_NAME));

const getCookieHtml = async () => {
    const html = buttonConfig.map((button) => templateFn(button.display, button.value)).join(''); 

    var newHTML         = document.createElement ('div');
    newHTML.innerHTML   = html;

    // document.body.appendChild (newHTML);

    // buttonConfig.forEach((button) => {
        // document.getElementById(templateIdString(button)).addEventListener ("click", updateCookie.bind(this, button.display, button.value), false);
    // });

    return newHTML;
}

const attachEventListenerToCookie = async () => {
    document.getElementById(templateIdString(button)).addEventListener ("click", updateCookie.bind(this, button.display, button.value), false);
}