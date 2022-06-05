function sortAllTrends(a, b) {
    return a[0].date - b[0].date;
}

const sortSymbols = (investmentA, investmentB) => {
    if (investmentA.symbol.localeCompare(investmentB.symbol) == 0) {
        var numberA = Number(investmentA.currentQuantity);
        var numberB = Number(investmentB.currentQuantity);
        return numberA - numberB;
    } else {
        return investmentA.symbol.localeCompare(investmentB.symbol);
    }
}

function sortCrypto(accountA, accountB) {
    if (accountA.description.localeCompare(accountB.description) == 0) {
        var numberA = Number(accountA.currentValue);
        var numberB = Number(accountB.currentValue);
        return numberA - numberB;
    } else {
        return accountA.description.localeCompare(accountB.description);
    }
}

function sortAccountId(accountA, accountB) {
    return accountA.accountId.localeCompare(accountB.accountId);
}

// sorts date
const sortDatesAscending = (trendA, trendB) => {
    return trendA.date - trendB.date
}

// sorts date strings
const sortDateStrings = (dateStringA, dateStringB) => {
    return new Date(dateStringA) - new Date(dateStringB);
}