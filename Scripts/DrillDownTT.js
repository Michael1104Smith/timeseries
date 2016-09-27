var Total1;
var Total2;

$(document).ready(function () {
    $('#ToolTipContainer').hide();
    $('#DrillDivEnter').hide();
    $('#TTpin').hide();
    $('#publicTT').hide();

    Total1 = 1;
    Total2 = 1;
    stickyTTToggle = -1;

    $('#TTpin').click(function () {
        stickyTTToggle = -1;
        activeTTToggle()
        $('#ToolTipContainer').fadeOut('slow');
    });

    $('#cartDivMasterContainer').mouseleave(function (e) {
        if(stickyTTToggle < 0)
            $('#ToolTipContainer').fadeOut('slow');
    });
});

function OpenCompanyInNewWindow(compName, drillDown) {
    if (drillDown == null)
        drillDown = "";
    else
        drillDown = '&Drill=' + drillDown;
    window.open('/SingleEntry/singleComp?compName=' + escape(compName) + drillDown);
}

function clearChartTooltip() {
    $('#TTPercentChangeDiv').html('');
    $('#TTDetailsDiv').html('');
    $('#TTCurrentQuarterAmount').html('');
    $('#TTPreviousQuarterAmount').html('');
    $('#ToolTipContainer').hide();
    stickyTTToggle = -1;
    activeTTToggle();
}

function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

function activeTTToggle() {
    if (stickyTTToggle >= 0) {
        $('#TTpin').show();
        $("#ToolTipContainer").drags({ handle: "#TTHeader" });
        if (!CompanyLevel) {
            $('#TTHelper').text('View by:');
            $('#DrillDivEnter').show();
            $('#publicTT').show();
        }else{
            $('#TTHelper').text('View by:').hide();
            $('#publicTT').hide();
        }
    } else {
        $('#TTpin').hide();
        $('#TTHelper').text('Click for drill-down options.');
        $('#DrillDivEnter').hide();
        $('#publicTT').hide();
    }
}

function stickyAdjuster(event, sender) {
    if (stickyTTToggle < 0) {
        stickyTTToggle = sender.x;
    } else if (stickyTTToggle == sender.x) {
        stickyTTToggle = -1;
    } else {
        stickyTTToggle = -1;
        drillDownMouseover(event, sender);
        stickyTTToggle = sender.x;
    }
    activeTTToggle();
}

function TTFormat(labelName) {
    if(labelName.match("Q[1234] \\d{4}")){
        return "$";
    } else if (labelName == "Investment amount ($)") {
        return "Investments($): ";
    }

    return labelName + ": ";
}

function setTotals() {
    var sum1 = 0;
    var sum2 = 0;

    for (var i = 0; i < highchart.series[1].data.length && i < highchart.series[0].data.length; i++) {
        sum1 += highchart.series[1].data[i].y;
        sum2 += highchart.series[0].data[i].y;
    }
    Total1 = sum1;
    Total2 = sum2;
}

function getPercentOfTotal(isCur, data) {
    var totalVal;
    if (isCur) {
        totalVal = Total1;
    } else {
        totalVal = Total2;
    }
    var percent = data / totalVal * 100;
    perecnt = Math.round(percent);
    return perecnt;
}
