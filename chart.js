const CHART_CONFIG = {
    LINE_CHART: {
        id: 'line_chart_id',
        title: 'line-chart',
        download_id: 'line-chart-download',
        file_name: 'line chart'
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

const attachChartToDomId = (chartConfig, config) => {
    var ctx = document.getElementById(chartConfig.id);
    var newChart = new Chart(ctx, config);
    document.getElementById(chartConfig.download_id).onclick = () => {
        var a = document.createElement('a');
        a.href =  newChart.toBase64Image();
        a.download = chartConfig.file_name;
        a.click();
    }
    return newChart;
}
