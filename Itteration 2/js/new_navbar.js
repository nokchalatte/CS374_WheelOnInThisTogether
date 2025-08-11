$(document).ready(function () {
    $('.nav-item .nav-link').on('click', function () {
        if (this.innerHTML == "Ask a Question") { console.log("Forum"); }
        else if (this.innerHTML == "Look for Routes") { console.log("Routes"); }
        else if (this.innerHTML == "Rate a Place") { console.log("Rates"); }
        //window.open('htmlLink', '_self');
    });
});