// Makes sure the codes run when we open the page
$(document).ready(function(){
	// Make textarea height automatically grow with content
	// console.log("js works!");
	const tx = document.getElementsByTagName('textarea');
	for (let i=0; i<tx.length; i++){
		tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px; overflow-y:hidden;');
		tx[i].addEventListener("input", OnInput, false);
	}

	function OnInput(){
		this.style.height = 'auto';
		this.style.height = (this.scrollHeight) + 'px';
	}

	// Your web app's Firebase configuration
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

	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);

	$('#post_button').on('click', function(e){
		e.preventDefault();
		console.log('button is pushed');
		get_post();
		add_new_post();

		//Clear Input box
		const topic_input = document.getElementById("topic_input");
		const user_input = document.getElementById("user_input");
		topic_input.innerHTML = "";
		user_input.innerHTML = "";
	});

	//Takes user's new post and puts them into database
	function get_post(){
		console.log('getting post');
	    var input_content = document.getElementById("user_input"); //content
	    var title_content = document.getElementById("topic_input"); //topic
	    var e = document.getElementById("select_category");
	    // console.log('e: ',e);
	    var category = e.options[e.selectedIndex].text;

	    //if user keeps one of them blank, dont make post
	    if (input_content.value.length != 0 && title_content.value.length!=0){
			// console.log('input: ', input_content.value);
			// console.log('topic: ', title_content.value);
			//make a firebase database so that it can be editable in the future.
			var key = firebase.database().ref().child("post_comment").push().key;
			console.log(key);
			var post = {
				key: key,
				category: category,
				title: title_content.value,
				content: input_content.value,
				total_likes: 0,
				total_replies: 0,
				poster: 'Wheelie', //Changed later to username when login is implemented!
				user_comments: null,
			};

			var updates = {};
			updates["post_comment/" + key] = post;
			firebase.database().ref().update(updates);
	    }
	}

	// var elements = document.getElementsByClassName('redirect');
	// Array.from(elements).forEach(function(element) {
	//     element.addEventListener('click', getKey);
	// });

	//When a user clicks a post, it adds changes the link to the forum post+ key of post
	$(document).on('click','.whole_card',function(){
		console.log($(this).find('div').context.getAttribute('data-key'));
		var post_dataKey = $(this).find('div').context.getAttribute('data-key');
		var new_url = "/forum_individual_post.html" + "?data-key=" + post_dataKey;
		var curr_webpage = window.location.href;
		var post_webpage = curr_webpage.replace(/\/[^\/]*$/, new_url);
		window.location.href = post_webpage;
	});
	
	function add_new_post(){
		var post_section = document.getElementById('post_container');
		// post_container.innerHTML = "";
		post_array = []; 
		firebase.database().ref('post_comment').once('value', function(snapshot){
			snapshot.forEach(function(childSnapshot){
			var childKey = childSnapshot.key; //key of post
			var childContent = childSnapshot.val(); //object
			if (Object.values(childContent)[0].toLowerCase().localeCompare('advice') == 0){ //only if the item is equal to advice
				console.log('true');
				post_array.push(Object.values(childContent)); //convert to array
			}
			// post_array.push(Object.values(childContent)); //convert to array
		});

		post_array = post_array.reverse(); //so most recent post is displayed at the top
		if (post_array.length > 0){
			console.log('post array more than 0');
			post_container.innerHTML = "";
        };

        // else if (post_array.length == 0){
        //   post_container.innerHTML = "";
        //   post_container.append("<h4 id="empty_posts">Be the first to Ask!</h4>");
        // };

        //Reload everything in firebase
        for (var i=0; i<post_array.length;i++){
			// console.log('post array: '+post_array[i]);
			var post_category = post_array[i][0];
			var post_content = post_array[i][1];
			var post_key = post_array[i][2];
			// var post_poster = post_array[i][3];
			var post_poster = "Wheelie";
			var post_title = post_array[i][4];
			var post_likes = post_array[i][5];
			var post_replies = post_array[i][6];

			//Add to HTML
			//Make Container for each card
			var post_card = document.createElement("div");
			post_card.setAttribute("class", "card my-4 shadow border-0 whole_card");
			// post_card.classList.add("comment");
			// post_card.classList.add("whole_card");
			post_card.setAttribute("data-key", post_key);

			//upper section of the card
			var card_body= document.createElement("div");
			card_body.setAttribute('class', 'card-body');
			post_card.append(card_body);

			//title and tag
			var post_tag_title = document.createElement("h5");
			post_tag_title.setAttribute("class", "text-left post_main_title mb-2");
			post_tag_title.innerHTML = post_title;
			var post_tag = document.createElement("span");
			post_tag.innerHTML = post_category;
			post_tag_title.append(post_tag);
			post_tag.setAttribute("class", "badge badge badge-primary category-tags p-2 mr-2 ml-2");
			card_body.append(post_tag_title);

			//paragraph
			var post_paragraph = document.createElement("p");
			post_paragraph.setAttribute("class", "d-block card-text text-left");
			post_paragraph.innerHTML = post_content;
			card_body.append(post_paragraph);

			//card footer
			var card_footer= document.createElement("div");
			card_footer.setAttribute("class", "card-footer");
			post_card.append(card_footer);
			var footer_row= document.createElement("div");
			footer_row.setAttribute("class", "row");
			var username= document.createElement("div");
			username.setAttribute("class", "col-lg-1 col-md-1 col-sm-3 col-1 text-right");
			var profile_pic= document.createElement("img");
			profile_pic.setAttribute("class", "rounded-circle user-circle");
			profile_pic.setAttribute("width", "24em");
			profile_pic.setAttribute("src", "duck.jpg");
			profile_pic.setAttribute("height", "24em");
			username.append(profile_pic);
			footer_row.append(username);
			card_footer.append(footer_row);

			//poster name
			var poster_name= document.createElement("div");
			poster_name.setAttribute("class", "col-lg-2 col-md-2 col-sm-4 col-4 username align-middle");
			poster_name.innerHTML = post_poster;
			footer_row.append(poster_name);

			var likes_comments = document.createElement("div");
			likes_comments.setAttribute("class", "col-lg-9 col-md-4 col-sm-5 col-7 border-left border-secondary");
			var comment_icon = document.createElement("img");
			comment_icon.setAttribute("class", "comment_icon");
			comment_icon.setAttribute("src", "../icons/chat.svg");
			comment_icon.setAttribute("width", "18em");
			comment_icon.setAttribute("height", "18em");
			likes_comments.append(comment_icon);
			var comment_total = document.createElement("span");
			comment_total.setAttribute('class', 'ml-2 mr-3');
			if (post_replies == 1){
				comment_total.innerHTML = post_replies + " Reply";
			}
			else{
				comment_total.innerHTML = post_replies + " Replies";
			}
			likes_comments.append(comment_total);

			var likes_icon = document.createElement("img");
			likes_icon.setAttribute("src", "../icons/heart.svg");
			likes_icon.setAttribute("class", "comment_icon");
			likes_icon.setAttribute("width", "18em");
			likes_icon.setAttribute("height", "18em");
			likes_comments.append(likes_icon);
			var likes_total = document.createElement("span");
			likes_total.setAttribute('class', 'mx-2 likes-and-comment');
			likes_total.setAttribute('class', 'ml-2 mr-3');
			if (post_likes == 1){
				likes_total.innerHTML = post_likes + " Like";
			}
			else{
				likes_total.innerHTML = post_likes + " Likes";
			}
			likes_comments.append(likes_total);

			var read_post = document.createElement("a");
			read_post.setAttribute("class", "btn btn-primary float-right btn-sm read_post");
			read_post.innerHTML = "Read Post";
			likes_comments.append(read_post);





			footer_row.append(likes_comments);

			post_section.append(post_card);
			// var post_area = document.getElementsByIdName('post_container');


			// var topic_name = document.createElement('label');
			// topic_name.setAttribute('class','tag');
			// topic_name.innerHTML = post_category;
			// var big_title = document.createElement('h2');
			// big_title.setAttribute('class', 'disc_topic');
			// big_title.innerHTML = post_title;
			// var caption = document.createElement('p');
			// caption.setAttribute('class','disc_content');
			// caption.innerHTML = post_content;

			// upper_part.append(topic_name);
			// upper_part.append(big_title);
			// upper_part.append(caption);

			//lower section
			// var lower_part = document.createElement("div");
			// lower_part.setAttribute('class','user-info');
			// lower_part.classList.add("row");
			// var profile_pic = document.createElement("span");
			// profile_pic.setAttribute('class', 'user-circle');
			// var poster_name = document.createElement("span");
			// poster_name.setAttribute('class', 'username');
			// poster_name.innerHTML = post_poster;
			// var separator = document.createElement("div");
			// separator.setAttribute('class', 'vertical-line');

			// var comment_icon = document.createElement("span");
			// comment_icon.setAttribute('class', 'icon-comment-alt');
			// comment_icon.classList.add("icon");
			// var comment_number = document.createElement("span");
			// comment_number.setAttribute('class', 'comment-number');
			// if (post_replies == 1){
	  //           comment_number.innerHTML = post_replies + " Reply";
			// }
			// else{
			// 	comment_number.innerHTML = post_replies + " Replies";
			// };

			// var likes_icon = document.createElement("span");
			// likes_icon.setAttribute('class', 'icon-like');
			// likes_icon.classList.add("icon");
			// var like_number = document.createElement("span");
			// like_number.setAttribute('class', 'like-number');
			// if (post_likes == 1){
			// 	like_number.innerHTML = post_likes + " Like";
			// }
			// else{
			// 	like_number.innerHTML = post_likes + " Likes";
			// };

			// var span_read = document.createElement("span");
			// var read_more = document.createElement("a");
			// span_read.setAttribute('class', 'go_more');
			// read_more.classList.add('redirect');
			// // read_more.setAttribute('onClick', 'getKey()');
			// read_more.innerHTML = "READ MORE";
			// // $('.go_more').append('<a class="redirect" onclick="getKey()">READ MORE</a>');
			// span_read.append(read_more);
			// lower_part.append(profile_pic);
			// lower_part.append(poster_name);
			// lower_part.append(separator);
			// lower_part.append(comment_icon);
			// lower_part.append(comment_number);
			// lower_part.append(likes_icon);
			// lower_part.append(like_number);
			// lower_part.append(span_read);

			// post_card.append(upper_part);
			// post_card.append(lower_part);
			// post_section.append(post_card);
			// post_section.append(post_card);
			

        	};
		});
	}
	// getKey();
	add_new_post();
});