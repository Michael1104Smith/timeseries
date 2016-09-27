var Spinner;
var target;
var opts = {
    lines: 15, // The number of lines to draw
    length: 28, // The length of each line
    width: 6, // The line thickness
    radius: 37, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 6, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 42, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
};

function setSpinner(targetID) {
    target = document.getElementById(targetID);
    Spinner = new Spinner(opts).spin(target);
}

function startSpinner() {
    Spinner.spin(target);
}

function stopSpinner() {
    Spinner.stop();
}