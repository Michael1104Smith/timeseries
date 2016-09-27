$(document).ready(function () {
    // To control the display Company of filters..
    $('#Choice2FilterDivsCommon a').click(function () {
        $('.Choice2FilterDivsCommon a').removeClass('selected');
        $(this).addClass('selected');
        $('.filterOptions').hide();
        var pid = $(this).attr('id').slice(0, -8);
        pid += 'List';
        $('#' + pid).show();

    });
    $('#Choice1FilterDivComp a').click(function () {
        $('#Choice1FilterDivComp a').removeClass('selected');
        $(this).addClass('selected');
        $('#Choice2FilterDiv div.filterOptions').hide();
        $("#" + this.id + "List").show();
        /*
                var pid = $(this).attr('id').slice(0, -8);
                pid1 = 'Choice2FilterDiv' + pid;
                pid2 = pid + "RegionFiltLInk";
                $('#' + pid1).show();
                $('#' + pid2).trigger('click');
                */

    });

    $('#ClearAllCheckBox1').click(function () {
        var checkboxes = $('#Choice2FilterDiv').find('input:checkbox');
        checkUncheckCheckboxes(checkboxes, 0);
        resetDates();
        makeAjaxCall();

    });

    $('#SelectAllCheckBox1').click(function () {
        var checkboxes = $('#Choice3FilterDiv').find('input:checkbox');
        checkUncheckCheckboxes(checkboxes, 1);
        resetDates();
        
        makeAjaxCall();
    });

    $('#ClearAllCheckBox2').click(function () {
        var checkboxes = $('#FirmChoice2FilterDiv').find('input:checkbox');
        checkUncheckCheckboxes(checkboxes, 0);

    });


    $('#Choice1FilterDivFirm a').click(function () {
        $('#Choice1FilterDivFirm a').removeClass('selected');
        $(this).addClass('selected');
        $('#FirmChoice2FilterDiv div.filterOptions').hide();
        $("#" + this.id + "List").show();

    });
});
function resetDates() {
    $('#Qtr1 .dropdown').prop("selectedIndex", 0);
    $('#Qtr2 .dropdown').prop("selectedIndex", 0);

}

function checkUncheckCheckboxes(checkboxes, value) {
    if (value == 1) {
        checkboxes.each(function () {
            jQuery(this).prop('checked', true);
            activeFilters.push($(this).parent().text().trim());
        });
    }
    else {

        checkboxes.each(function () {
            jQuery(this).prop('checked', false);
        });
        activeFilters = new Array();
    }
}