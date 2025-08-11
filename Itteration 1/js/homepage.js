$( document ).ready(function() {	
	var defaultPrimary = document.getElementsByClassName('default_primary');
	var Primary = document.getElementsByClassName('primary');
	var BlueCards = document.getElementsByClassName('bluecards');
	
	function bindEvents() {
		defaultPrimary[0].onclick = function() { // Go to Forum
			window.open("forum_homepage.html", "_self");
		}
		defaultPrimary[1].onclick = function() { // Go to Rates 
			window.open("rates.html", "_self");
		}
		Primary[0].onclick = function() { // Go to Routes
			window.open("routes-index.html", "_self");
		}
		BlueCards[0].onclick = function() { //Go to Buff-Eat
			window.open("rating_ind.html", "_self");
		}
	}

	bindEvents();
});
