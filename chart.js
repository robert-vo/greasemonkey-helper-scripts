const fileNameSuffix = formatDateToYYYYMMDD(new Date());

const CHART_CONFIG = {
    LINE_CHART: {
        id: 'line_chart_id',
        title: 'line-chart',
        download_id: 'line-chart-download',
        file_name: `${fileNameSuffix} - line chart`
    },
    PIE_CHART_SPLIT_BY_TYPE: {
        id: 'pie-chart-split-by-type-id',
        title: 'investments split by type',
        download_id: 'pie-chart-split-by-type-download',
        file_name: `${fileNameSuffix} - pie-chart-split-by-type`
    },
    PIE_CHART_SPLIT_BY_ACCOUNTS: {
        id: 'pie-chart-split-by-accounts-id',
        title: 'investments split by accounts',
        download_id: 'pie-chart-split-by-accounts-download',
        file_name: `${fileNameSuffix} - pie-chart-split-by-accounts`
    },
    PIE_CHART_SPLIT_BY_SYMBOL: {
        id: 'pie-chart-split-by-symbol-id',
        title: 'every investment split by symbol',
        download_id: 'pie-chart-split-by-symbol',
        file_name: `${fileNameSuffix} - pie-chart-split-by-symbol`
    }
}

const getLineChartConfig = (allTrends) => {
    const daysAverage = getDaysMovingAverageFromCookie();

    var dates = allTrends.map(e => e.date);

    var minDate = dateTimeFormat.format(Math.min(...dates))
    var maxDate = dateTimeFormat.format(Math.max(...dates))

    var chartTitle = `net worth from ${minDate} to ${maxDate} (${getNumberOfDaysFromCookie()} days)`;

    var labels = allTrends.map((trend) =>
        mintCustomDateTimeFormat.format(trend.date)
    );
    var formattedData = allTrends.map((trend) => {
        return {
            x: mintCustomDateTimeFormat.format(trend.date),
            y: trend.net,
            debt: trend.debt,
            asset: trend.asset
        }
    });

    var moving_average_data_set = allTrends.map((trend, index, trendArray) => {
        var currSum = 0;
        var numbahs = [];
        const floor = Math.max(index - daysAverage, 0);
        for(var i = index; i >= floor; i--) {
            numbahs.push(trendArray[i].net);
        }
        return {
            x: mintCustomDateTimeFormat.format(trend.date),
            y: average(numbahs),
            ma: 'moving average',
        }
    });

    return {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    data: formattedData,
                    label: 'net worth',
                    backgroundColor: COLORS.BLUE,
                    pointBackgroundColor: COLORS.BLUE,
                    pointBorderColor: COLORS.BLUE,
                    pointHoverBackgroundColor: COLORS.BLUE,
                    pointHoverBorderColor: COLORS.BLUE,
                    borderColor: COLORS.BLUE,
                },
                {
                    data: moving_average_data_set,
                    fill: false,
                    label: `${daysAverage}-day moving average`,
                    borderDash: [5, 5],
                    backgroundColor: COLORS.RED,
                    pointBackgroundColor: COLORS.RED,
                    pointBorderColor: COLORS.RED,
                    pointHoverBackgroundColor: COLORS.RED,
                    pointHoverBorderColor: COLORS.RED,
                    borderColor: COLORS.RED,
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    color: COLORS.WHITE
                },
                legend: {
                    display: true,
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const parsedY = currencyFormatter.format(context.parsed.y);
                            return context.raw.ma ? `${daysAverage}-day moving average: ${parsedY}` : `net: ${parsedY}`;
                        },
                        footer: function(context) {
                            const raw = context[0].raw;
                            return !raw.ma ? `asset: ${currencyFormatter.format(raw.asset)}\ndebt: ${currencyFormatter.format(raw.debt)}` : '';
                        }
                    },
                    bodyFont: {
                        weight: FONT_WEIGHT.BOLD
                    },
                    footerFont: {
                        weight: FONT_WEIGHT.NORMAL
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: COLORS.WHITE,
                        callback: function(value, index, values) {
                            var currVal = formatNumberToDollar(value);
                            return currVal.substring(0, currVal.length - 3);
                        }
                    }
                },
                x: {
                    ticks: {
                        color: COLORS.WHITE
                    }
                },
            },
        },
    }
}

const getPieChartSplitByTypeConfig = (entire_picture) => {
    const labels = Object.entries(entire_picture)
        .map(([k, v]) => k);
    const dataSet = Object.entries(entire_picture)
        .map(([k, v]) => v);
    const totalPortfolioValue = dataSet.reduce(sumReducer);
    const data = {
        labels: labels,
        datasets: [{
            data: dataSet,
            backgroundColor: [
            COLORS.RED,
            COLORS.BLUE,
            COLORS.YELLOW,
            ],
            hoverOffset: 4,
        }]
    };

    return {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return currencyFormatter.format(context.parsed)
                        },
                        afterLabel: function(context) {
                            const rawPercentage = context.parsed / totalPortfolioValue;
                            return `${percentageFormatter.format(rawPercentage)} of portfolio`;
                        },
                        afterTitle: function(context) {
                            return context[0].label
                        },
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        color: COLORS.WHITE
                    },
                    position: 'right'
                }
            }
        }
    };
}

const getPieChartSplitByAccountsConfig = (accounts, ...investments)  =>{
    let accountsSplitMap = new Map();

    var checking_accounts = accounts
        .filter((e) => e.bankAccountType === 'CHECKING')
        .map((e) => {
            const newObj = {
                currentValue: e.availableBalance,
                symbol: e.fiName,
                accountId: e.fiName
            }
            return newObj;
        })
        .filter((e) => e.currentValue > 0);

    const cleanData = []
        .concat(checking_accounts, investments)
        .flat()
        .filter((e) => {
            if(e.accountStatus && e.accountStatus !== 'ACTIVE') {
                return false;
            }
            return true;
        })
        .filter((e) => e.type !== "CreditAccount")
        .filter((e) => {
            if(e.availableBalance && e.availableBalance === 0) {
                return false;
            }
            return true;
        })
        .filter((e) => {
            if(e.currentBalance && e.currentBalance === 0) {
                return false;
            }
            return true;
        })
        .filter((e) => e.symbol !== undefined)
        .filter((e) => e.availableBalance !== 0)
        .map((e) => {
            const newObj = {
                symbol: e.symbol,
                currentValue: e.currentBalance || e.currentValue || e.availableBalance,
                accountId: e.accountId.trim()
            }
            return newObj;
        })
        .sort(sortAccountId);

    cleanData.forEach((e) => {
        if(accountsSplitMap.has(e.accountId)) {
            accountsSplitMap.set(e.accountId, accountsSplitMap.get(e.accountId) + e.currentValue);
        } else {
            accountsSplitMap.set(e.accountId, e.currentValue);
        }
    });

    accountsSplitMap = new Map([...accountsSplitMap.entries()].sort((a, b) => {
        return a[1] - b[2]
    }));

    const labels = [...accountsSplitMap.keys()];
    const dataSet = [...accountsSplitMap.values()];
    const totalPortfolioValue = dataSet.reduce(sumReducer);
    const data = {
      labels: labels,
      datasets: [{
        data: dataSet,
        backgroundColor: [
            COLORS.RED,
            COLORS.BLUE,
            COLORS.YELLOW,
            'purple',
            'green'
        ],
        hoverOffset: 4,
      }]
    };
    return {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return currencyFormatter.format(context.parsed)
                        },
                        afterLabel: function(context) {
                            const rawPercentage = context.parsed / totalPortfolioValue;
                            return `${percentageFormatter.format(rawPercentage)} of portfolio`;
                        },
                        afterTitle: function(context) {
                            return context[0].label
                        },
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        color: COLORS.WHITE
                    },
                    position: 'top'
                },
            }
        }
    };
}

const getPieChartSplitBySymbolConfig = (crypto_price_map, ...investments) => {
    const cleanData = investments
        .flat()
        .filter((e) => { return e.symbol })
        // .filter((e) => { return e.symbol !== 'USD'})
        .map((e) => {
            const newObj = {
                symbol: e.symbol,
                currentPrice: e.currentPrice || crypto_price_map.get(e.symbol),
                currentValue: e.currentValue,
                accountId: e.accountId
            }
            return newObj;
        })
        .sort(sortSymbols);

    const stocksMap = new Map();

    cleanData
        .forEach((e) => {
            if(stocksMap.has(e.symbol)) {
                stocksMap.set(e.symbol, e.currentValue + stocksMap.get(e.symbol));
            } else {
                stocksMap.set(e.symbol, e.currentValue);
            }
        });

    const labels = [...stocksMap.keys()];
    const dataSet = [...stocksMap.values()];
    const totalPortfolioValue = dataSet.reduce(sumReducer);
    const usedColors = new Set();
    var i = 0;
    var backgroundColors = [];
    while(i < labels.length) {
        const currColor = dynamicColors();
        if(!usedColors.has(currColor)) {
            usedColors.add(currColor);
            backgroundColors.push(currColor);
            i++;
        }
    }

    const data = {
      labels: labels,
      datasets: [{
        data: dataSet,
        backgroundColor: backgroundColors,
        // backgroundColor: labels.map((e) => dynamicColors()),
        hoverOffset: 4,
      }]
    };
    return {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return currencyFormatter.format(context.parsed)
                        },
                        afterLabel: function(context) {
                            const rawPercentage = context.parsed / totalPortfolioValue;
                            return `${percentageFormatter.format(rawPercentage)} of portfolio`;
                        },
                        afterTitle: function(context) {
                            return context[0].label
                        },
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        color: COLORS.WHITE
                    },
                    position: 'top'
                }
            }
        }
    };
}

const attachChartToDomId = (chartConfig, config) => {
    var ctx = document.getElementById(chartConfig.id);
    var newChart = new Chart(ctx, config);

    var downloadButton = document.getElementById(chartConfig.download_id);

    if (downloadButton) {
        downloadButton.onclick = () => {
            var a = document.createElement('a');
            a.href =  newChart.toBase64Image();
            a.download = chartConfig.file_name;
            a.click();
        }
    }
    
    return newChart;
}
