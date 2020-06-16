$(document).ready(function () {
	var firebaseConfig = {
		apiKey: "AIzaSyDTWTSoE18qTy32m9_EB3gQbxeg2fJIcsY",
		authDomain: "wheelon-forum.firebaseapp.com",
		databaseURL: "https://wheelon-forum.firebaseio.com",
		projectId: "wheelon-forum",
		storageBucket: "wheelon-forum.appspot.com",
		messagingSenderId: "111914626097",
		appId: "1:111914626097:web:33649d540ffde5a9207910",
		measurementId: "G-Y9TXZC3P6P"
	};

	firebase.initializeApp(firebaseConfig);

    $('.btn-primary').on('click', function () {
    	if (this.innerHTML == "Check Out Other Posts") { window.open('forum_homepage_cleaned.html', '_self'); }
    	else if (this.innerHTML == "Check Out Other Places") { window.open('search_rate.html', '_self'); }
    	else if (this.innerHTML == "Find Best Directions") { 
    		var toPlace = document.getElementById('exampleFormControlTo');
			var fromPlace = document.getElementById('exampleFormControlFrom');
    		window.open('search_rate.html', '_self'); 
    		// copy search input
    	}
    	else if (this.innerHTML == "Read Post") { 
    		// Read Post
    		console.log("Read Post");
    	}
    });
    $('.navbar-brand').on('click', function () {
    	window.open('homepage.html','_self');
    });
});
