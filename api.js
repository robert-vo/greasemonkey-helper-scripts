const APPLICATION_JSON = 'application/json'

const INVESTMENTS_HTTP_HEADER = {
    'content-type': APPLICATION_JSON,
    authorization:
        'Intuit_APIKey intuit_apikey=prdakyrespQBtEtvaclVBEgFGm7NQflbRaCHRhAy,intuit_apikey_version=1.0',
};

const TREND_DATA_HTTP_HEADER = {
    "accept": APPLICATION_JSON,
    "authorization": "Intuit_APIKey intuit_apikey=prdakyresYC6zv9z3rARKl4hMGycOWmIb4n8w52r,intuit_apikey_version=1.0",
    "content-type": APPLICATION_JSON,
    "cookie": "qbn.authid=1153727075; qbn.parentid=50000003; qbn.ticket=V1-214-X0iv0otz4w9zu912i1mws6"
};

const callApi = async (url, method, headers, data) => {
    return new Promise((resolve) => {
        GM.xmlHttpRequest({
            headers: headers,
            method: method,
            url: url,
            data: data,
            onload: function (response) {
                resolve(JSON.parse(response.responseText));
            },
        });
    });
}

async function getAllAccounts() {
    var accountsResponse = await callApi(
        API_URLS.ACCOUNTS,
        API_METHOD.GET,
        INVESTMENTS_HTTP_HEADER
    );
    return accountsResponse.Account;
}

async function getAllInvestments() {
    var investmentsResponse = await callApi(
        API_URLS.INVESTMENTS,
        API_METHOD.GET,
        INVESTMENTS_HTTP_HEADER
    );
    return investmentsResponse.Investment;
}