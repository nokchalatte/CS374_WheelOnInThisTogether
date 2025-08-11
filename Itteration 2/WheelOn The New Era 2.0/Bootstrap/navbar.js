$(document).ready(function () {
    $('.navbar-toggler').on('click', function () {
        $('#sidebar').css("display", "block");
        $('.row').css("position", "fixed");
    });
    $('.sidebarClose').on('click', function () {
        $('#sidebar').css("display", "none");
        $('.row').css("position", "");
    });
});