$(document).ready(function () {
    
    //Dropdown menu
    $(".root_links").hover(function () {
        // Show the sub menu
        if ($('.navDropdown', this).length > 0) {
            $('.navDropdown', this).stop(true, false).slideDown(300);
            $(this).css({ "background": "#E7E6DB" });
        }
    },
  function () {
      //hide its submenu

      if ($('.navDropdown', this).length > 0) {
          $('.navDropdown', this).stop(true, false).slideUp(200);
          $(this).css({ "background": "#fff" });
      }
  });
    $('#logo').click(function () {
        window.location = "..";
    });

    $('#loginArrowIcon, #logoutButton').mouseout(function () {
        $('#logoutButton').css("color", "#FFFFFF");
    });
    $('#loginArrowIcon, #logoutButton').mouseover(function () {
        $('#logoutButton').css("color", "#a32020");
    });

    var datePickerBoxes = $('.pickDate');
    if (datePickerBoxes.length > 0) {
        datePickerBoxes.datepicker();
    }
});
