function bindEvents() {
	$(".icon-star").onclick(function() {
		//close sidebar
		console.log("Closing sidebar");
	})

	$(".options").onclick(function() {
		var chosenTask = $(".options").html();
		if (chosenTask == "Forum") {
			//go to Forum page
			console.log("Proceeding to Forum page");
		} else if (chosenTask == "Routes") {
			//go to Routes page
			console.log("Proceeding to Routes page");
		} else if (chosenTask == "Rate") {
			//go to Rates page
			console.log("Proceeding to Rates page");
		}
	})
}