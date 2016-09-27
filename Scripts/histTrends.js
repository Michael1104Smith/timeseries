var highchart;
var searchForm = "#HTFilterForm";
var activeFilters;
var categoryNames;
var histData;

function drawGraph(jsonData, appendflag){
    var Funded_At = jsonData.Funded_At;
    var Amount_Raised_USD = jsonData.Amount_Raised_USD;

    var timeseriesData = {};
    var XAxisTic = [];
    var YBar = [];
    var YLine = [];
    var Length = Funded_At.length;
    var i, j;

    for(i = 0; i < Length; i++){
        if(Funded_At[i].length > 1){
            var date = Funded_At[i];
            var month,year;
            if(date.search('/') > 0){
                var date_arr = date.split("/");
                month = parseInt(date_arr[1]);
                year = parseInt(date_arr[2]);
            }else{
                var date_arr = date.split("-");
                month = parseInt(date_arr[1]);
                year = parseInt(date_arr[0]);
            }

            if(year > yearMin){
                for(j = 0; j < XAxisTic.length; j++){
                    var x_date = XAxisTic[j];
                    var x_date_arr = x_date.split("-");
                    var x_year = x_date_arr[0];
                    if(year == x_year) break;
                }

                if(j == XAxisTic.length){
                    XAxisTic.push(year+"-1");
                    XAxisTic.push(year+"-2");
                    XAxisTic.push(year+"-3");
                    XAxisTic.push(year+"-4");
                    YBar.push(0);
                    YBar.push(0);
                    YBar.push(0);
                    YBar.push(0);
                    YLine.push(0);
                    YLine.push(0);
                    YLine.push(0);
                    YLine.push(0);
                }
            }
        }
    }

    for(i = 0; i < XAxisTic.length-1; i++){
        for(j = i; j < XAxisTic.length; j++){
            if(XAxisTic[i] > XAxisTic[j]){
                var tmp = XAxisTic[i];
                XAxisTic[i] = XAxisTic[j];
                XAxisTic[j] = tmp;
            }
        }
    }

    if(appendflag == true){
        for(i = 0; i < XAxisTic.length; i++){
            var date = XAxisTic[i];
            var date_arr = date.split("-");
            var year = parseInt(date_arr[0]);
            var quarter = parseInt(date_arr[1]);
            $('#Qtr1 .dropdown').append('<option value="'+year+'-'+quarter+'">Q'+quarter+' '+year+'</option>');
            $('#Qtr2 .dropdown').prepend('<option value="'+year+'-'+quarter+'">Q'+quarter+' '+year+'</option>');
        }
        $('#Qtr1 .dropdown option:first-child').attr("selected", "selected");
        $('#Qtr2 .dropdown option:first-child').attr("selected", "selected");
    }

    for(i = 0; i < Length; i++){
        if(Amount_Raised_USD[i] != null && Funded_At[i].length > 1){
            var date = Funded_At[i];
            var month, year;
            if(date.search("/") > 0){
                var date_arr = date.split("/");
                month = parseInt(date_arr[1]);
                year = parseInt(date_arr[2]);
            }else{
                var date_arr = date.split("-");
                month = parseInt(date_arr[1]);
                year = parseInt(date_arr[0]);
            }
            var quarter = 0;
            if(month <= 3) quarter = 1;
            else if(month <=6) quarter = 2;
            else if(month <= 9) quarter = 3;
            else quarter = 4;
            var XAxis = year+"-"+quarter;
            for(j = 0; j < XAxisTic.length; j++){
                if(XAxis == XAxisTic[j]) break;
            }
            YBar[j] += parseInt(Amount_Raised_USD[i]);
            YLine[j]++;
        }
    }

    timeseriesData.XAxisTic = XAxisTic;
    timeseriesData.YBar = YBar;
    timeseriesData.YLine = YLine;

    console.log(timeseriesData);

    displayHistTrendChart(timeseriesData);
}

//Make Ajax call to redraw chart
function makeAjaxCall() {

    startSpinner('cartDivMasterContainer');

    if (isDrilledDown()) {
        makeDrillDownAjaxCall(searchForm);
    } else {
        $('#DrillDownOrdering').val(DrilldownInput);

        $.getJSON("Data/"+fileName, function(data) {
            var filterCategories = [];
            var filterRegions = [];
            var filterStagies = [];
            var startDate = quarterTextToggle($('#Qtr1 option:selected').text());
            var endDate = quarterTextToggle($('#Qtr2 option:selected').text());

            var startDate_arr = startDate.split("-");
            var startDate_year = parseInt(startDate_arr[0]);
            var startDate_quarter = parseInt(startDate_arr[1]);
            var endDate_arr = endDate.split("-");
            var endDate_year = parseInt(endDate_arr[0]);
            var endDate_quarter = parseInt(endDate_arr[1]);

            $('#CompIndustryList input').each(function(){
                if($(this).is(':checked')){
                    filterCategories.push($(this).val());
                }
            });

            $('#CompRegionList input').each(function(){
                if($(this).is(':checked')){
                    filterRegions.push($(this).val());
                }
            });

            $('#CompSoDList input').each(function(){
                if($(this).is(':checked')){
                    filterStagies.push($(this).val());
                }
            });

            var jsonData = {};
            var Category = [];
            var Region = [];
            var Amount_Raised_USD = [];
            var Stage = [];
            var Funded_At = [];
            var Length = data.Category.length;
            var i, j;

            for(i = 0; i < Length; i++){
                if(data.Amount_Raised_USD[i] != null && data.Funded_At[i].length > 1){
                    var date = data.Funded_At[i];
                    var date_year, date_month;
                    if(date.search("/") > 0){
                        var date_arr = date.split("/");
                        date_year = parseInt(date_arr[2]);
                        date_month = parseInt(date_arr[1]);
                    }else{
                        var date_arr = date.split("-");
                        date_year = parseInt(date_arr[0]);
                        date_month = parseInt(date_arr[1]);
                    }
                    var cur_category = data.Category[i];
                    var cur_region = data.Region[i];
                    var cur_stage = data.Stage[i];
                    if((date_year>startDate_year && date_year<endDate_year)
                        || (startDate_year != endDate_year && date_year == startDate_year && date_month>=(startDate_quarter-1)*3)
                        || (startDate_year != endDate_year && date_year == endDate_year && date_month<=endDate_quarter*3)
                        || (startDate_year == endDate_year && date_year == endDate_year && date_month>=(startDate_quarter-1)*3 && date_month<=endDate_quarter*3)){

                        var flag = true;

                        if(filterCategories.length != 0){
                            for(j = 0; j < filterCategories.length; j++){
                                if(cur_category == filterCategories[j]) break;
                            }
                            if(j == filterCategories.length) flag = false;
                        }
                        if(flag && filterRegions.length != 0){
                            for(j = 0; j < filterRegions.length; j++){
                                if(cur_region == filterRegions[j]) break;
                            }
                            if(j == filterRegions.length) flag = false;
                        }
                        if(flag && filterStagies.length != 0){
                            for(j = 0; j < filterStagies.length; j++){
                                if(cur_stage == filterStagies[j]) break;
                            }
                            if(j == filterStagies.length) flag = false;
                        }

                        if(flag){
                            Category.push(cur_category);
                            Region.push(cur_region);
                            Amount_Raised_USD.push(parseInt(data.Amount_Raised_USD[i]));
                            Stage.push(cur_stage);
                            Funded_At.push(date);
                        }
                    }
                }

            }

            jsonData.Category = Category;
            jsonData.Region = Region;
            jsonData.Amount_Raised_USD = Amount_Raised_USD;
            jsonData.Stage = Stage;
            jsonData.Funded_At = Funded_At;

            drawGraph(jsonData,false);

            stopSpinner();
        });
    }
}

$(document).ready(function () {

    DrillDefault = "Qtr:";

    activeFilters = new Object();
    checkUncheckCheckboxes($('#Choice2FilterDiv').find('input:checkbox'), 0);

    setSpinner('cartDivMasterContainer');
    startSpinner();

    //To reetreive JSON data and display the chart
    $.getJSON("Data/"+fileName).done(function (jsonData) {

        drawGraph(jsonData,true);
        $('#HTTextContent').text()

        $('#Qtr1 .dropdown').prop("selectedIndex", 0);
        $('#Qtr2 .dropdown').prop("selectedIndex", 0);
        stopSpinner();
    });



    // To Complete an ajax call every time the form is posted.
    $.ajaxSettings.traditional = true;
    //Submit form when the check box is checked/unchecked
    $(".filterInnerLabel input:checkbox").change(function () {
        if (validateDate()) {
            var arrayLocation;
            if (activeFilters[$(this).attr("name")] == null) {
                activeFilters.push($(this).attr("name"))
                arrayLocation = activeFilters[$(this).attr("name")] = new Array();
            } else {
                arrayLocation = activeFilters[$(this).attr("name")];
            }

            if ($(this).is(":checked")) {
                arrayLocation.push($(this).parent().text().trim())
            } else {
                var index = arrayLocation.indexOf($(this).parent().text().trim());
                arrayLocation.splice(index, 1);

                if (arrayLocation.length == 0) {
                    index = activeFilters.indexOf($(this).attr("name"));
                    activeFilters.splice(index, 1);
                }
            }

            makeAjaxCall();
        }
    });

    /////Date Range Manipulation Relates stuff
    //Setting it here to fix the issue with Firefox browser (it retains the old choices)


    //Setting the date display on Change
    $('.dropdown').change(function (event) {
        $('#ChangeDetect').attr('value', '1');
        validateDate();
    });

    $("#downloadHistButton").hover(function () {
        // Show the sub menu
        $('#downloadHistDropdown', this).stop(true, false).slideDown(300);
    },
      function () {
          //hide its submenu
        $('#downloadHistDropdown', this).stop(true, false).slideUp(200);
    });

    $('#histToPDF').click(function () {
        var tempStr = highchart.subtitle.textStr;
        var drillData = 'Historical Data ' + parseDrill();
        var filterData = parseFilter();
        var title = drillData + filterData;
        highchart.setTitle(null, { text: title + '<br/>' + tempStr });
        var fileName = drillData.replace(/, /g, '_')
        highchart.exportChart({ type: 'application/pdf', filename: fileName });
        highchart.setTitle(null, { text: tempStr });

    });

    $('#histToExcel').click(function () {

        var form = $('#highchartsDataToXls');

        form.find('.deals').val(histData.YLine);
        form.find('.money').val(histData.YBar);
        var graphNamesString = "";
        $(histData.XAxisTic).each(function () {
            graphNamesString += this + '~';
        });
        form.find('.xAxis').val(graphNamesString);
        form.find('.graphNames').val('deals, investment');
        form.find('.title').val($('#HTTextContent').text());
        var str = $('#HTTextContent').text();
        $('#highchartsDataToXls').submit();
    });
});


//Call the chart redraw function everytime you get the posted JSON data.
function onSuccess(data) {
    displayHistTrendChart(data);
    stopSpinner();

}

function saveJson(data) {
    histData = data;
}


function parseFilterToText(isDrilledDown) {
    var titleText = "";
    if (isDrilledDown) {
        var splitIndex = DrilldownInput.lastIndexOf('^');
        var filteredBy = DrilldownInput.substring(0, splitIndex).replace(/\^/g, ', ');
        var groupedBy = DrilldownInput.substring(splitIndex + 1, DrilldownInput.length - 1);

        titleText += "The chart below shows the aggregated investment dollars and the number of deals in " + '<a class="TitleTxtR">' + quarterTextToggle(filteredBy.substring(4)) + filteredBy.substring(10) +
            "</a> and grouped by " + '<a class="TitleTxtR">' + quarterTextToggle(groupedBy) + "</a>. ";
    } else {
        titleText = "The chart below shows the aggregated investment dollars and the number of deals from " + '<a class="TitleTxtR">' + quarterTextToggle($('#Qtr1 .dropdown').val()) + "</a> to " + '<a class="TitleTxtR">' + quarterTextToggle("2013-4") + "</a>. <br/>";
    }
    var titleText = titleText.replace(/\:/g, ': ');

    if (activeFilters.length > 0) {
        titleText += "The graph is also being filtered by"
        for (var i = 0; i < activeFilters.length; i++) {
            var filter = activeFilters[i]

            var subSectionText = "";
            for (var j = 0; j < activeFilters[filter].length; j++) {

                if (activeFilters[filter].length - j == 1) {
                    subSectionText += ' <a class="TitleTxtBold">' + activeFilters[filter][j] + "</a>";
                } else if (activeFilters[filter].length - j == 2) {
                    subSectionText += ' <a class="TitleTxtBold">' + activeFilters[filter][j] + "</a> and"
                } else {
                    subSectionText += ' <a class="TitleTxtBold">' + activeFilters[filter][j] + "</a>,";
                }
            }

            if (activeFilters.length - i == 1) {
                titleText += ' <a class="TitleTxtR">' + activeFilters[i].substring(7) + ":</a> " + subSectionText; //Substring(7) Company from example CompanyIndustry has length of 7.
            } else if (activeFilters.length - i == 2) {
                titleText += ' <a class="TitleTxtR">' + activeFilters[i].substring(7) + ":</a> " + subSectionText + ", and"
            } else {
                titleText += ' <a class="TitleTxtR">' + activeFilters[i].substring(7) + ":</a> " + subSectionText + ",";
            }
        }
    }
    return titleText
}

function parseDrill(){
    var DrillInputCopyStr = DrilldownInput;
    var splitIndex = DrilldownInput.lastIndexOf('^');
    var parseString = DrilldownInput.substring(0, splitIndex).replace(/\^/g, ', ');
    return parseString;
}

function parseFilter() {
    var parseString = "";

    if (activeFilters.length > 0) {
        var dataCategoriesText = "<br />Filtered by ";

        for (var i = 0; i < activeFilters.length; i++) {
            var filter = activeFilters[i];

            var dataFilterText = "";
            for (var j = 0; j < activeFilters[filter].length; j++) {

                if (activeFilters[filter].length - j == 1) {
                    dataFilterText += " " + activeFilters[filter][j] + "";
                } else if (activeFilters[filter].length - j == 2) {
                    dataFilterText += " " + activeFilters[filter][j] + " and"
                } else {
                    dataFilterText += " " + activeFilters[filter][j] + ",";
                }
            }

            if (activeFilters.length - i == 1) {
                dataCategoriesText += " " + activeFilters[i].substring(7) + ": " + dataFilterText; //Substring(7) Company from example CompanyIndustry has length of 7.
            } else if (activeFilters.length - i == 2) {
                dataCategoriesText += " " + activeFilters[i].substring(7) + ": " + dataFilterText + ", and"
            } else {
                dataCategoriesText += " " + activeFilters[i].substring(7) + ": " + dataFilterText + ",";
            }
        }
        parseString += dataCategoriesText;
    }
    return parseString;
}

function onDrill() {
    var splitIndex = DrilldownInput.lastIndexOf('^');
    var groupedBy = DrilldownInput.substring(splitIndex + 1, DrilldownInput.length - 1);

    $('#TTExploreText').html('Explore this ' + groupedBy + ' in more detail. View by:');

    $('#HTTextContent').html(parseFilterToText(true));

    $("#backToHistorical").show();
    $("#dateRange").hide();
}

//Validate the dates chosen.
function validateDate() {
    //If the user by mistake chose "From Date" > "To Date" fix it.

    if ($("select[name='Qtr1'] option:selected").index() + $("select[name='Qtr2'] option:selected").index() >= $('.dropdown > option').length/2) {
        $('#DateErrorMsgDiv').html("From-Quarter chosen cannot be greater than the Through-Quarter for the same year");
        $('#DateErrorMsgDiv').show();
        if(!$('#DateSelectionDiv').is(':visible'))
        {
            $('#DateSelectionDiv').animate({ width: 'show' });
        }
        alert("Please check the Date range!");
        return false;
    }
    else {
        stickyTTToggle = -1;
        $('#ToolTipContainer').hide();
        $('#backToHistorical').hide();

        $('#DateErrorMsgDiv').hide();
        $('#DateSelectionDiv').animate({ width: 'hide' });
        //if the options have changed  make an ajx call
        if ($('#ChangeDetect').attr('value') == '1') {
            makeAjaxCall();
            $('#ChangeDetect').attr('value', '0');
        }
        return true;
    }
}


function DrillDownToggler(isInDrilldown) {
    if (isInDrilldown) {
        $('#DateMain').css({ "display": "none" });
    } else {
        $('#DateMain').css({ "display": "inline" });
    }

}



function histStickyAdjuster(event, sender) {
    if (stickyTTToggle < 0) {
        stickyTTToggle = sender.x;
    } else if (stickyTTToggle == sender.x) {
        stickyTTToggle = -1;
    } else {
        stickyTTToggle = -1;
        histDrilldownMouseOver(event, sender);
        stickyTTToggle = sender.x;
    }

    activeTTToggle();

}

function histDrilldownMouseOver(event, sender) {
    if (stickyTTToggle < 0) {
        $('#ToolTipContainer').show();

        $('#TTDetailsDiv').text(quarterTextToggle(categoryNames[sender.x]));

        var CurrentIndex = sender.x;

        if (CurrentIndex > 0) {
            var CurrentValue = highchart.series[0].data[CurrentIndex].y;
            var dealsMade = highchart.series[1].data[CurrentIndex].y;


            var PreviousValue = highchart.series[0].data[CurrentIndex - 1].y;

            var NetValue = CurrentValue - PreviousValue;
            var percentage = Math.round(NetValue / PreviousValue * 100);

            var direction = 'Images/Arrow_Up.png';
            if (NetValue < 0) {
                percentage = percentage * -1;
                direction = 'Images/Arrow_Down.png';
            }
            $('#percentTextDiv').show();

            // $('#TTPercentChangeDiv').html(percentage + '%<img src="' + direction + '"/>');

        } else {
            var CurrentValue = highchart.series[0].data[CurrentIndex].y;
            var dealsMade = highchart.series[1].data[CurrentIndex].y;

            $('#percentTextDiv').hide();
        }
        $('#TTPreviousQuarterAmount').text("Investments($) : " + commaSeparateNumber(CurrentValue));
        $('#TTCurrentQuarterAmount').text("Number of Deals : " + commaSeparateNumber(dealsMade));

        var finalHeight;
        var finalLeft;
        if (event.type == 'click') {
            finalHeight = $(event.target).attr('y')
            finalLeft = $(event.target).attr('x')
        } else {
            var container_offset = $(event.target.series.chart.container).offset();
            var container_width = $(event.target.series.chart.container).width();

            finalHeight = event.target.plotY;
            if (finalHeight < 190) {
                finalHeight = 190;
            }

            finalHeight = (finalHeight) - container_offset.top;
            finalLeft = event.target.plotX + 80;

            if (finalHeight < 0) {
                finalHeight = 0;
            }

            if (finalLeft > container_width - $('#ToolTipContainer').width() - 30)
                finalLeft = event.target.plotX - $('#ToolTipContainer').width() + 25;
        }
        $('#ToolTipContainer').css({
            top: finalHeight,
            left: finalLeft,
            display: 'block'
        });
    }
}

function PositionLabel(totalEntries, labelName) {
    var lastLabelText = labelName.substring(0, 4);
    var lastQuarter = parseInt(labelName.substring(5));

    var labels = $('.highcharts-xaxis-labels text');

    var columns = $('.highcharts-series').first().find('rect');
    var x = parseFloat(columns.first().attr('x'));
    var width = parseFloat(columns.first().attr('width'));
    var BarDistance = x * 2 + width;

    var lastXIndex = parseFloat(labels.last().attr('x'));

    if (labels.length > 1) {
        var x1 = parseFloat(labels.eq(0).attr('x'));
        var x2 = parseFloat(labels.eq(1).attr('x'));

        var displacement = (x2 - x1) * .38
        labels.each(function () {
            var x = $(this).attr('x');
            $(this).attr('x', x - displacement);
        });

        if((totalEntries - lastQuarter) % 4 != 0 ){
            var firstLabelCompensation = (2 - (.5 * ((totalEntries - lastQuarter) % 4))) * BarDistance;
            labels.first().attr('x', parseFloat(labels.first().attr('x')) + firstLabelCompensation);
        }

        //if (lastQuarter != 0) {
        //    var lastLabelElement = labels.last().clone();
        //    var lastXIndex = parseFloat(lastLabelElement.attr('x'));
        //    lastLabelElement.attr('x', lastXIndex + (x2 - x1));
        //    lastLabelElement.text(lastLabelText);
        //    $('.highcharts-xaxis-labels').append(lastLabelElement);
        //}

    } else {
        var firstHalf = totalEntries - lastQuarter - 1;

        var firstHalfWidth = firstHalf * BarDistance;
        var OnlyLabel = labels.first();

        var x = OnlyLabel.attr('x');
        OnlyLabel.attr('x', x - firstHalfWidth/2);
    }

    if (lastQuarter != 0) {
        var LastSectionLength = lastQuarter * BarDistance;

        var lastLabelElement = labels.last().clone();
        var finalQuarterAdjustment = (LastSectionLength / 2 + BarDistance / 2);
        if (finalQuarterAdjustment < 25) {
            finalQuarterAdjustment = 25;
        }
        lastLabelElement.attr('x', lastXIndex + finalQuarterAdjustment);
        lastLabelElement.text(lastLabelText);
        $('.highcharts-xaxis-labels').append(lastLabelElement);
    }
}

//Draw chart given the data
function displayHistTrendChart(histTrendData) {

    $('#percentText').show();

    var chart = $.extend({}, historicalChartLayout);

    chart.chart.height = 450;

    chart.chart.renderTo = "ChartDivCur";
    DrillRenderLocation = 'ChartDivCur';

    categoryNames = histTrendData.XAxisTic;
    var cateLength = categoryNames.length;
    var xAxisAltered = new Array();
    var tickPositions = new Array();
    var i;
    var Ioffset = parseInt(categoryNames[0].substring(5));
    for (i = 0; i < cateLength; i++) {
        if ((i + Ioffset) % 4 == 0) {
            tickPositions.push(i);
            xAxisAltered.push(categoryNames[i].substring(0, 4))
        }
        else {
            xAxisAltered.push(" ")
        }
    }
    var lastLabel = false;
    var lastLabelName = "xxxx-0";

    lastLabel = i;
    if ((i + Ioffset) % 4 != 0) {
        lastLabelName = categoryNames[i-1];
    }

    chart.series[0].data = histTrendData.YBar;
    chart.series[1].data = histTrendData.YLine;

    if (chart.xAxis[0] == null) {
        if (chart.xAxis[0] == null) {
            chart.xAxis.push({
                categories: xAxisAltered,
                tickPositions: tickPositions
            });
        }
    } else {
        chart.xAxis[0].categories = xAxisAltered;
        chart.xAxis[0].tickPositions = tickPositions;
    }

    var thisQuarter = histTrendData.YBar;

    if (thisQuarter != "No Data") {
        var largest = thisQuarter[0];
        var i = 0;
        while (i++ < thisQuarter.length) {
            if (largest < thisQuarter[i]) {
                largest = thisQuarter[i];
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

    chart.yAxis[1].labels.formatter = function () {

        return '$' + (this.value / divider) + units;

    }


    highchart = new Highcharts.Chart(chart);

    $('#TTExploreText').html('Explore this quarter in more detail. View by:');

    $('#HTTextContent').html(parseFilterToText(false));

    saveJson(histTrendData);

    PositionLabel(lastLabel, lastLabelName);

}

    var historicalChartLayout = {
        chart: {
            zoomType: 'xy',
            inverted: false
        },
        exporting: {
            enabled: false
        },
        title: {
            text: 'Historical trend data'
        },
        subtitle: {
            text: ''
        },
        xAxis: [],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}',
                style: {
                    color: '#a32020'
                }
            },
            title: {
                text: 'Number of deals',
                style: {
                    color: '#a32020'
                }
            }
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
        tooltip: false,


        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        mouseOver: function (e) {
                            histDrilldownMouseOver(e, this);
                        },
                        click: function (e) {
                            histStickyAdjuster(e, this);
                        }
                    }
                }
            },
            column:
                {
                    //pointPlacement: .75
                }
        },

        series: [{
            name: 'Investment amount ($)',
            color: '#000055',
            type: 'column',
            yAxis: 1,

            plotOptions: {
                pointPadding: 0,
            },
            borderWidth: 0,
            pointPadding: 0
        }, {
            name: 'Number of deals',
            color: '#a32020',
            type: 'spline',
            // yAxis: {min:0},
            marker: {
                enabled: false
            },
            tooltip: {

            }
        }]
    };








