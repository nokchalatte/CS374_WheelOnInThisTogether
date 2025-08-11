$( document ).ready(function() {
	var Logo = document.getElementById('logo');
	var SideBarOpen = document.getElementById('sideBarOpen');
	var ULContent = document.getElementsByTagName("UL")[0];
	var SideBarWidth = document.getElementsByClassName("sidebar")[0];

	var SideBarText = '<li><span class="col-md-2" id="logo"><b> WheelOn </b></span><span class="icon-menu" id="sideBarClose" onclick="closeMenu()"></span></li><br><li class="options">Forum</li><li class="options">Routes</li><li class="options">Rate</li><li class="copyright"> WheelOnInThisTogether <br> Copyright 2020 </li>'

	function bindEvents() {
		Logo.onclick = function() { // Click the Logo to return to the Homepage
			window.open("homepage.html", "_self");
		}

		SideBarOpen.onclick = function() { // Open the Sidebar
			SideBarWidth.style.width = '20%';
			ULContent.innerHTML = SideBarText;
			$("div").not(".sidebar").css("opacity", "0.5");
		}
    
    $(document).on('click', '#sideBarClose', function () {
			SideBarWidth.style.width = 0;
			ULContent.innerHTML = "";
		});

		$(document).on('click', function(event){
			if (!$(event.target).is($("ul")) && !$(event.target).is($("#sideBarOpen"))) {
				if ($('#sideBarClose').length != 0) {
					SideBarWidth.style.width = 0;
					ULContent.innerHTML = "";
					$("div").not(".sidebar").css("opacity", "1"); // opacity code
				}
			}
		})

		$(document).on('click', '.options', function() {
			if (this.innerHTML == "Forum") {window.open("forum_homepage.html", "_self");}
			else if (this.innerHTML == "Routes") { window.open("routes-index.html", "_self") }
			else if (this.innerHTML == "Rate") {window.open("rates.html", "_self");}
		});
	}

	document.getElementsByClassName("sidebar")[0].style.width = 0;
	bindEvents();
});
