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

async function getAllAccounts(headers) {
    var accountsResponse = await callApi(
        API_URLS.ACCOUNTS,
        API_METHOD.GET,
        headers
    );
    return accountsResponse.Account;
}

async function getAllInvestments(headers) {
    var investmentsResponse = await callApi(
        API_URLS.INVESTMENTS,
        API_METHOD.GET,
        headers
    );
    return investmentsResponse.Investment;
}
