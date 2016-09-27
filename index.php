<?php

    $fileName = 'uk.json';
    if(isset($_REQUEST['fileName'])){
        $fileName = $_REQUEST['fileName'];
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Custom Query</title>
    <link rel="shortcut icon" href="Content/Images/favicon.ico" type="image/x-icon">
    <link rel="icon" href="Content/Images/favicon.ico" type="image/x-icon">
    <meta name="viewport" content="width=device-width" />
    <script src="Scripts/jquery-2.0.3.js"></script>

    <script src="Scripts/jquery-ba-outside-events.js"></script>

    <link href="Content/site.css" rel="stylesheet"/>

    <script src="Scripts/modernizr-2.6.2.js"></script>

    <script src="Scripts/highcharts.src.js"></script>
    <script src="Scripts/highcharts-more.src.js"></script>
    <script src="Scripts/highcharts-3d.src.js"></script>
    <script src="Scripts/exporting.src.js"></script>

    <script src="Scripts/site.js"></script>

    <link href="Content/jquery-ui-1.10.4.custom.css" rel="stylesheet"/>

    <script src="Scripts/jquery-ui-1.10.4.custom.js"></script>

    <script src="Scripts/jquery.tinymce.js"></script>
    <script type="text/javascript">
        var fileName;
        var static_Regions;
        var yearMin = 1990;
        $(document).ready(function(){
            fileName = '<?php echo $fileName; ?>';
            var usa_Regions = ["SF Bay", "New York", "Boston", "Los Angeles", "Seattle", "Washington DC", "San Diego", "Denver", "Austin", "Chicago", "Atlanta", "Philadelphia", "Dallas", "Raleigh-Durham", "Salt Lake City", "Portland", "Minneapolis", "Pittsburg"];
            var uk_Regions = ["London","United Kingdom - Other","Manchester","Edinburgh","Bristol","Birmingham","Glasgow","Leeds","Newcastle","Sheffield","Nottingham","Liverpool","Cardiff"];
            static_Regions = [];
            $('#Selelct_Country option').each(function(){
                if($(this).val() == fileName){
                    $(this).attr('selected','selected');
                }
            })
            static_Regions = [];
            var i;
            if(fileName.search('usa') > -1){
                static_Regions = usa_Regions;
            }else if(fileName.search('uk') > -1){
                static_Regions = uk_Regions;
            }
            $('#Selelct_Country').change(function(){
                var cur_href = window.location.href.split('?')[0];
                window.location.href = cur_href+"?fileName="+$(this).val();
            })
            var html = '';
            var length = parseInt(static_Regions.length/10);
            if(length*10 > static_Regions.length) length--;
            var j;
            for(i = 0; i <= length; i++){
                var label_cnt = 10;
                if(i == length){
                    label_cnt = static_Regions.length - length*10;
                }
                html += '<td>';
                for(j = 0; j < label_cnt; j++){
                    html += '<label class="filterInnerLabel">';
                    html += '<input type="checkbox" name="CompanyRegions" value="'+static_Regions[i*10+j]+'"/><span>  </span>'+static_Regions[i*10+j];
                    html += '</label>';
                }
                html += '<td/>';
            }
            $('#CompRegionList table tr').html(html);
        })
    </script>

    
    <script src="Scripts/filterControl.js"></script>

    <link href="Content/Hist.css" rel="stylesheet"/>

    <script src="Scripts/HistDrillDown.js"></script>
    <script src="Scripts/histTrends.js"></script>
    <script src="Scripts/DrillDownTT.js"></script>
    <script src="Scripts/draggable.js"></script>

    <script src="Scripts/Spin.js"></script>
    <script src="Scripts/SpinItem.js"></script>


</head>
<body>
    <div id="FullPage">
        <div id="container">
            <div id="topNav">

                <img id="logo" src="Images/logo.png" />
                <div id="LoginControlDiv">
                    <select id="Selelct_Country" style="position:absolute;right:0;top:0;">
                        <option value='usa.json'>United States</option>
                        <option value='uk.json'>United Kindom</option>
                    </select>
                </div>

            </div>

            <div id="content">

                <div id="MainDiv">
                    <a class="orangePageHeader">Historical trend data</a>
                    <div class="HTMainDivs">
                        <div id="HTTextContent">
                        </div>
                        <div id="downloadHistButton">
                            <a class="dlheader">Download</a>
                            <div id="downloadHistDropdown">
                                <a class="dlopt" id="histToPDF">PDF</a>
                                <a class="dlopt" id="histToExcel">Excel</a>
                            </div>
                            <form action="/HistoricTrends/toXlsFile" id="highchartsDataToXls" method="post">
                                <input name="__RequestVerificationToken" type="hidden" value="h84DtWi6yLhDAmJbTsQhqaYq6LJDpAMzv0ZQGudfALsHjyNKa4cYiVEe9BzOlBeHvHtqJUwG2By1zg5bdfbD3n097FKs8pwT43w4MTbt7Qk1" />             
                                <input type="hidden" class="deals" name="data1" value=""/>
                                <input type="hidden" class="money" name="data2" value=""/>
                                <input type="hidden" class="xAxis" name="xAxis" value=""/>
                                <input type="hidden" class="graphNames" name="graphNames" value=""/>
                                <input type="hidden" class="title" name="title" value=""/>
                            </form>                
                            <form action="/HistoricTrends/toCsvFile" id="highchartsDataToCsv" method="post">
                                <input name="__RequestVerificationToken" type="hidden" value="YZQSGbYmePbwvCoJ04dLEicakNQ3Ijvnse3mT4pdI3Pm-b-TBO0Mr41oS_V-7uGp2WbG_WPAAjBO155-XiVaC_9ggaRmpO6dHD7BR8w9-rQ1" />                    
                                <input type="hidden" class="deals" name="data1" value=""/>
                                <input type="hidden" class="money" name="data2" value=""/>
                                <input type="hidden" class="xAxis" name="xAxis" value=""/>
                                <input type="hidden" class="graphNames" name="graphNames" value=""/>
                                <input type="hidden" class="title" name="title" value=""/>
                            </form>            
                        </div>
                    </div>

                    <div id="cartDivMasterContainer">
                        <div id="ChartDivCur"></div>
                        <div id="ToolTipContainer">
                            <img id="TTpin" src="Images/Pin.png"/>
                            <div id="TTHeader">
                                <div id="TTDetailsDiv"></div>
                                <div id="percentTextDiv">
                                <div id="TTPercentChangeDiv"></div>
                                <a id="percentText">($)Qtr/Qtr</a>
                                </div>
                            </div>
                            <div id="dataSlot1" class="TTRow">
                                <div id="TTCurrentQuarterAmount"></div>
                                <div id="TTCurrentQuarterDeals"></div>
                                <div id="TTCurrentAmountPercent" class="percentTotal"></div>
                            </div>
                            <div id="dataSlot2" class="TTRow">
                                <div id="TTPreviousQuarterAmount"></div><div id="TTPreviousQuarterDeals"></div>
                                <div id="TTPreviousAmountPercent" class="percentTotal"></div>
                            </div>
                        </div>
                    </div>

                </div>

                <div>
                    <form action="/HistoricTrends/CustomQueryHistoricTrend" id="HTFilterForm" method="post" name="HTFilterForm">

                        <div id="FiltHeader">

                            <label id="header">Filter data</label>
                            <div class="SelectClearOption" id="ClearAllCheckBox1">
                                Clear all
                            </div>

                            <div id="backToHistorical" class="SelectClearOption">Back to historical</div>

                            <div id="dateRange">

                            <div id="DateErrorMsgDiv" style="display: none"></div>


                            <div id="Qtr2" class="SelBox">
                                <select name="Qtr2" class="dropdown">
                                </select>
                            </div>
                            <div class="DateSecLevelLabel">to</div>

                            <div id="Qtr1" class="SelBox">

                                <select name="Qtr1" class="dropdown">

                                </select>
                            </div>
                            <div class="DateSecLevelLabel">Date range: </div>
                            </div>
                        </div>


                        <div id="filterBox">

                            <div id="Choice1FilterDivComp" class="ChoiceFilterDivs Choice1FilterDivsCommon">
                                <a id="CompIndustry" class="selected">Category</a>
                                <a id="CompRegion">Region</a>
                                <a id="CompSoD">Stage</a>
                            </div>


                            <div id="Choice2FilterDiv" class="ChoiceFilterDivs">
                                <h3>Choose data to show</h3>
                                <div id="CompIndustryList" class="filterOptions">
                                    <table>
                                        <tr>
                                            <td>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="software"/><span>  </span>software
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="biotech"/><span>  </span>biotech
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="web"/><span>  </span>web
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="enterprise"/><span>  </span>enterprise
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="mobile"/><span>  </span>mobile
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="advertising"/><span>  </span>advertising
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="cleantech"/><span>  </span>cleantech
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="ecommerce"/><span>  </span>ecommerce
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="hardware"/><span>  </span>hardware
                                                </label>
                                            </td>
                                            <td>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="games_video"/><span>  </span>games_video
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="analytics"/><span>  </span>analytics
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="health"/><span>  </span>health
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="semiconductor"/><span>  </span>semiconductor
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="network_hosting"/><span>  </span>network_hosting
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="finance"/><span>  </span>finance
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="social"/><span>  </span>social
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyIndustry" value="real_estate"/><span>  </span>real_estate
                                                </label>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div id="CompRegionList" class="filterOptions">
                                    <table>
                                        <tr>
                                            <td>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="SF Bay"/><span>  </span>SF Bay
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="New York"/><span>  </span>New York
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Boston"/><span>  </span>Boston
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Los Angeles"/><span>  </span>Los Angeles
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Seattle"/><span>  </span>Seattle
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Washington DC"/><span>  </span>Washington DC
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="San Diego"/><span>  </span>San Diego
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Denver"/><span>  </span>Denver
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Austin"/><span>  </span>Austin
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Chicago"/><span>  </span>Chicago
                                                </label>
                                            </td>
                                            <td>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Atlanta"/><span>  </span>Atlanta
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Philadelphia"/><span>  </span>Philadelphia
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Dallas"/><span>  </span>Dallas
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Raleigh-Durham"/><span>  </span>Raleigh-Durham
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Salt Lake City"/><span>  </span>Salt Lake City
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Portland"/><span>  </span>Portland
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Minneapolis"/><span>  </span>Minneapolis
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanyRegions" value="Pittsburg"/><span>  </span>Pittsburg
                                                </label>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div id="CompSoDList" class="filterOptions">
                                    <table>
                                        <tr>
                                            <td>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanySoD" value="series-b"/><span>  </span>series-b
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanySoD" value="venture"/><span>  </span>venture
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanySoD" value="angel"/><span>  </span>angel
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanySoD" value="other"/><span>  </span>other
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanySoD" value="series-a"/><span>  </span>series-a
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanySoD" value="series-c+"/><span>  </span>series-c+
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanySoD" value="crowdfunding"/><span>  </span>crowdfunding
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanySoD" value="post-ipo"/><span>  </span>post-ipo
                                                </label>
                                                <label class="filterInnerLabel">
                                                <input type="checkbox" name="CompanySoD" value="22"/><span>  </span>private-equity
                                                </label>
                                            </td>

                                        </tr>
                                    </table>
                                </div>

                            </div>
                            <input type="hidden" id="ChangeDetect" value="0">
                            <input type="hidden" id="DrillDownOrdering" value="Qtr:" name="DrillDownSequence" />
                        </div>

                    </form>
                </div>

            </div>
            <div id="footer">
            </div>

        </div>
    </div>

</body>
</html>
