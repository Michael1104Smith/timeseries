var DrilldownInput = "Qtr:";
var hasDrilled = false;
var DrillRenderLocation = 'ChartDivCur';
var CompanyLevel = false;

var static_Regions = ["SF Bay", "New York", "Boston", "Los Angeles", "Seattle", "Washington DC", "San Diego", "Denver", "Austin", "Chicago", "Atlanta", "Philadelphia", "Dallas", "Raleigh-Durham", "Salt Lake City", "Portland", "Minneapolis", "Pittsburg"];
var static_Categories = ["software", "biotech", "web", "enterprise", "mobile", "advertising", "cleantech", "ecommerce", "medical", "hardware", "games_video", "analytics", "health", "semiconductor", "network_hosting", "finance", "social", "real_estate"];
var static_Stagies = ["series-b","venture","angel","other","series-a","series-c+","crowdfunding","post-ipo","private-equity"];

// For drilldown to function makeDrillDownAjaxCall requires (form = the Id of the form containing DrillDownSequence)

// both DrilldownToggler and onDrill are for page specific functions when a drill down is made or exited.
// DrillDownToggler(hasDrilled); Is called when the back button is pressed or reset.
// onDrill(); onDrill is executed after every makeDrillDownAjaxCall is made. 

$(document).ready(function () {

    DrillDefault = $("#DrillDownOrdering").val();

    $('#Undrill').click(function (event) {
        backButton();
        event.stopPropagation();
        return false;
    });

    // Drill Down Buttons
    $('.DrillOptionEnter').click(function () {
        if (validateDate()) {
            if ($(this).attr("id") == "Company")
                CompanyLevel = true;
            drillDownButtonPress(this);
        }
    });

    $("#backToHistorical").click(function () {
        resetDrillDown();
        makeAjaxCall();
    });
});


//Make Ajax call after drill down option selection
function makeDrillDownAjaxCall(form) {
    $('#DrillDownOrdering').val(DrilldownInput);
    startSpinner();
    
    $.getJSON( "data/timeseries.json", function(data) {
        // console.log(data);
        DrillDownSuccess(data);
    });
};

function quarterTextToggle(year) {
    if (year != null) {
        var pattern = "Q[1234] \\d{4}";
        if (year.match(pattern)) {
            return year.substring(3, 7) + '-' + year.charAt(1);
        } else if (year.match("^\\d{4}-[1234]")) {
            return 'Q' + year.charAt(5) + " " + year.substring(0, 4);
        } else if(year.match("^Qtr:\\d{4}-[1234]")){
            var temp = year.substring(4, 8) + " Qtr" + year[9]
            if (year.length > 10) {
                temp += year.substring(10);
            }
            return temp;
        }else{
            return year;
        }
    }
}


function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

function drillDownMouseover(event, sender) {
    if (stickyTTToggle < 0) {

        $('#ToolTipContainer').show();

        $('#TTDetailsDiv').text(sender.category);

        var xAxisMarker = sender.x;

        var CurrentValue = highchart.series[1].data[xAxisMarker].y;
        var PreviousValue = highchart.series[0].data[xAxisMarker].y;

        $('#TTPreviousQuarterAmount').text(TTFormat(highchart.series[0].name) + commaSeparateNumber(PreviousValue));
        $('#TTCurrentQuarterAmount').text(TTFormat(highchart.series[1].name) + commaSeparateNumber(CurrentValue));

        $('#TTCurrentAmountPercent').text(getPercentOfTotal(true, CurrentValue) + '% of total');
        $('#TTCurrentAmountPercent').css("margin-left", "0");
        $('#TTPreviousAmountPercent').text(getPercentOfTotal(false, PreviousValue) + '% of total');
        $('#TTPreviousAmountPercent').css("margin-left", "0");

        var NetValue = CurrentValue - PreviousValue;
        if (PreviousValue != 0) {
            var percentage = Math.round(NetValue / PreviousValue * 100);

            var direction = 'Images/Arrow_Up.png'; // todo swap for src
            if (NetValue < 0) {
                percentage = percentage * -1;
                direction = '/Images/Arrow_Down.png';
            }
            $('#TTPercentChangeDiv').html(percentage + '%<img src="' + direction + '"/>');
        } else {
            $('#TTPercentChangeDiv').html('NA %<img src="Images/Arrow_Up.png"/>');
        }

        var finalHeight;
        var finalLeft;
        if (event.type == 'click') {
            finalHeight = $(event.target).attr('y')
            finalLeft = $(event.target).attr('x')
        } else {
            var container_offset = $(event.target.series.chart.container).offset();
            var container_width = $(event.target.series.chart.container).width();
            var container_height = $(event.target.series.chart.container).height();

            var topFinal = (container_height - event.target.plotX) - 80;
            var leftFinal = container_offset.left / 2 + (container_width - event.target.plotY);

            if (topFinal > container_height - $('#ToolTipContainer').height() - 150) {
                topFinal = container_height - $('#ToolTipContainer').height() - 155;
            }
            if (leftFinal > container_width - $('#ToolTipContainer').width() - 30) {
                leftFinal = container_width - $('#ToolTipContainer').width() - 30;
            }
        }

        $('#ToolTipContainer').css({
            top: topFinal,//- $('#ToolTipContainer').height() + 35,// - $('#chart_tooltip').height() -d_to_mouse,
            left: leftFinal// + 65 + (e.target.plotX - 15 >= container_width / 2 ? -$('#ToolTipContainer').width() : 10),
        });
        return true;
    }
    return false;
}



function DrillDownSuccess(data) {
    stopSpinner();

    if (data.XAxisTic == "Loggin Required") {
        window.location.href = "/Account/Login?ReturnUrl=" + escape("/HistoricTrends/CustomQueryHistoricTrend");
    } else if (data.XAxisTic == "Expired Account") {
        window.location.href = "/Account/accountExpire?ReturnUrl=" + escape("/HistoricTrends/CustomQueryHistoricTrend");
    } else {

        stickyTTToggle = -1;

        $('#percentText').hide();

        var chart = $.extend({}, quarterChartLayout);

        chart.chart.renderTo = DrillRenderLocation;

        chart.series[0].data = data.YBar;
        chart.series[1].data = data.YLine;
        chart.xAxis.categories = data.XAxisTic;


        var findUnits = data.YBar;

        if (findUnits != "No Data") {
            var largest = findUnits[0];
            var i = 0;
            while (i++ < findUnits.length) {
                if (largest < findUnits[i]) {
                    largest = findUnits[i];
                }
            }

            var chartCap = largest * 4 / 3
            var divider = 1000000000;
            var units = "bil";
            if (chartCap < divider * 2) {
                divider = divider / 1000;
                units = "mil";
                if (chartCap < divider * 2) {
                    units = "K";
                    divider = divider / 1000;
                }
            }
        }

        if (CompanyLevel) {
            chart.xAxis.labels.formatter = function () {
                return '<a class="companyLevel" onclick="OpenCompanyInNewWindow(\'' + escape(this.value) + '\',\''+ escape(DrilldownInput) + '\')">' + this.value + '</a>';
            }
        }

        chart.yAxis[1].labels.formatter = function () {
            return '$' + (this.value / divider) + units;
        }

        var pixHeight = 40 * data.XAxisTic.length;
        var minHeight = 400;
        if (pixHeight < minHeight)
            pixHeight = minHeight;

        chart.chart.height = pixHeight;

        highchart = new Highcharts.Chart(chart);

        onDrill();
        setTotals();  
        saveJson(data);

    }
}

function drillDownButtonPress(buttonID) {
    if ($('#TTDetailsDiv').text() != "") {

        DrilldownInput = DrilldownInput + quarterTextToggle($('#TTDetailsDiv').text()) + "^" + buttonID.id.toString() + ":"
        $(buttonID).hide();
        if ($('#DrillDivEnter div.DrillOptionEnter').filter(':hidden').length == $('#DrillDivEnter div.DrillOptionEnter').length) {
            $('#TTHelper').hide();
        }
        isDrilledDown();
        makeDrillDownAjaxCall(searchForm);
        clearChartTooltip();
    }
}


function resetDrillDown() {
    $('.DrillOptionEnter').show();
    $('#TTHelper').show();
    DrilldownInput = DrillDefault;
    isDrilledDown();
}

function backButton() {

    $('#TTHelper').show();

    index = DrilldownInput.lastIndexOf("^", DrilldownInput.length - 2);;
    var reversDrillDown = '#' + DrilldownInput.substring(index + 1, DrilldownInput.length - 1);

    var index = DrilldownInput.lastIndexOf(":", DrilldownInput.length - 2);
    DrilldownInput = DrilldownInput.substring(0, index + 1);

    var buttonTemp = $(reversDrillDown);

    buttonTemp.click(function () {
        drillDownButtonPress(this);
    });
    buttonTemp.css({ "color": "#fff" })

    if (!isDrilledDown()) {
        $.getJSON("data/timeseries.json").done(function (jsonData) {
            displayHistTrendChart(jsonData);
        })
    } else {
        makeDrillDownAjaxCall(searchForm);
    }
    clearChartTooltip();
}

function isDrilledDown() {

    if (DrilldownInput == "Qtr:") {
        $('#TTPercentChangeDiv').show();
        hasDrilled = false;
        CompanyLevel = false;
        stickyTTToggle = -1;
        $('#ToolTipContainer').hide();
        $('#backToHistorical').hide();
        $('#dateRange').show();

        activeTTToggle();
    } else {
        //var undoButton = $('#Undrill');
        //undoButton.css({ "display": "inline" });
        $('#backToHistorical').show();
        $('#dateRange').hide();

        $('#TTPercentChangeDiv').hide();
        hasDrilled = true;
    }
    DrillDownToggler(hasDrilled); // Function which is page specific to what needs to be hidden and not hidden during drilldown.
    return hasDrilled;
}


var quarterChartLayout = {
    chart: {
        zoomType: 'xy',
        inverted: true
    },
    exporting: {
        enabled: false
    },
    legend: {
        reversed: true
    },
    tooltip : false,
    credits:{
        enabled: false
    },
    title: {
        text: 'Historical trend data'
    },
    subtitle: {
        text: ""
    },
    xAxis: {
        title: {
            text: null
        },
        labels: {
            useHTML: true,
            formatter: function () {
                return '<a>' + this.value + '</a>';
            }
        }
    },
    yAxis: [{ // Primary yAxis
        labels: {
            style: {
                color: '#a32020'
            }
        },
        title: {
            text: 'Number of deals',
            style: {
                color: '#a32020'
            }
        },
        minTickInterval : 1
    }, { // Secondary yAxis
        title: {
            text: 'Total investment amount',
            style: {
                color: '#000055'
            }
        },
        labels: {
            formatter: function () {
            },
            style: {
                color: '#000055'
            }
        },
        opposite: true
    }],
    credits: {
        enabled: false
    },
    plotOptions: {
        series: {
            cursor: 'pointer',
            point: {
                events: {
                    mouseOver: function (e) {
                        drillDownMouseover(e, this)
                    },
                    click: function (e) {
                        stickyAdjuster(e, this);
                    }
                }
            }
        }
    },

    series: [{
        name: 'Investment amount ($)',
        color: '#000055',
        type: 'column',
        yAxis: 1,
        plotOptions: {
            pointPadding: 0
        },
        borderWidth: 0,
        pointPadding: 0,
    }, {
        name: 'Number of deals',
        color: '#a32020',
        type: 'column',
        marker: {
            enabled: false
        },
        tooltip: {

        }
    }]
};



