$(document).ready(function () {
    $('.navbar-toggler').on('click', function () {
        $('#sidebar').css("display", "block");
        $('.row').css("position", "fixed");
    });
    $('.sidebarClose').on('click', function () {
        $('#sidebar').css("display", "none");
        $('.row').css("position", "");
    });
    $('.nav-link').on('click', function () {
    	if (this.innerHTML == "Forum") { window.open('forum_mainpage.html', '_self'); }
    	else if (this.innerHTML == "Routes") { 
            console.log("yesy")
            window.open('routes-index.html', '_self'); }
    	else if (this.innerHTML == "Rating") { window.open('search_rate.html', '_self'); }
    });
    $('.navbar-brand').on('click', function () {
    	window.open('homepage.html','_self');
    });
    $('.options h4').on('click', function () {
    	if (this.innerHTML == "FORUM") { window.open('forum_mainpage.html', '_self'); }
    	else if (this.innerHTML == "ROUTES") { window.open('routes-index.html', '_self'); }
    	else if (this.innerHTML == "RATING") { window.open('search_rate.html', '_self'); }
    });
});
