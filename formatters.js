const enUS = 'en-US';

// formats date to Month Day, Year
const dateTimeFormat = new Intl.DateTimeFormat(enUS, {
    dateStyle: 'long',
});

// formats date to MM/DD/YYYY
const mintCustomDateTimeFormat = new Intl.DateTimeFormat(enUS);



// formats date to MMM DD, where MMM is the short month representation
const chartDateTimeFormat = new Intl.DateTimeFormat(enUS, {
    month: 'short',
    day: 'numeric'
});

// formats numbers to $abc.12
const currencyFormatter = new Intl.NumberFormat(enUS, {
    style: 'currency',
    currency: 'USD',
});

// formats numbers to 0.00%
const percentageFormatter = new Intl.NumberFormat(enUS, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const formatNumberToDollar = (number) => {
    return !isNaN(number) ? currencyFormatter.format(number) : '';
}

const formatDebtToAccountingDollar = (debt) => {
    if(isNaN(debt)) {
        return '';
    }

    var currDollar = currencyFormatter.format(Math.abs(debt));

    if(Number(debt) < 0) {
        return currDollar;
    } else {
        return `(${currDollar})`;
    }
}

const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if(month < 10) {
        month = '0' + new String(month);
    }
    if(day < 10) {
        day = '0' + new String(day);
    }
    console.log('returning: ' + [year, month, day].join('-') + ' for date: ' + date)
    return [year, month, day].join('-');
}