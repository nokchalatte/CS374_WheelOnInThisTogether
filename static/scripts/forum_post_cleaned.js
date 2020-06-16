$(document).ready(function(){
	//We're going to be redirected from the homepage, so we need to prepare the data already available in Firebase
	var curr_url = new URLSearchParams(window.location.search);
	var post_key = curr_url.get('data-key');
	// console.log(post_key);
	
	// Make textarea height automatically grow with content
	const tx = document.getElementsByTagName('textarea');
	for (let i=0; i<tx.length; i++){
		tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px; overflow-y:hidden;');
		tx[i].addEventListener("input", OnInput, false);
	}

	//The textarea increases in length whenever we exceed current one
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

	firebase.initializeApp(firebaseConfig);

	//Replace the writings at the post with data from Firebase key
	firebase.database().ref('post_comment').once('value',function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var childKey = childSnapshot.key;
			// console.log('childKey: ' + childKey);
			if (childKey.localeCompare(post_key) == 0){
				// console.log('this is the item');
				var childValue = childSnapshot.val(); 
				// console.log(childValue);
				$('#category_badge').html(childValue.category);
				$('.content_post').html(childValue.content);
				$('.username').html(childValue.poster);
				$('.disc_topic').html(childValue.title);

				if (childValue.total_replies == 1){
					$('#total_replies').html(childValue.total_replies + " Reply");
					// console.log('total_replies: ' + childValue.total_replies);
					$('.number_replies').html(childValue.total_replies + " Reply");
				}
				else{
					$('#total_replies').html(childValue.total_replies + " Replies");
					$('.number_replies').html(childValue.total_replies + " Replies");
				}

				if (childValue.total_likes == 1){
					$('#total_hearts').html(childValue.total_likes + " Like");
				}
				else{
					$('#total_hearts').html(childValue.total_likes + " Likes");
				}
			};
		});
	});

	//Delete comment when you push the button
	function delete_comment(){
		console.log('delete button is clicked!');
		//Delete from Web
		

		//Renew data in Firebase
	}

	$('.heart_button').on('click', function(){
		//Update number of comments in Firebase
		var path = firebase.database().ref('post_comment/' + post_key);
		path.once('value').then(function(snapshot){
			var items = snapshot.val();
			var items_content = Object.values(items);
			// console.log('items: '+ Object.values(items));

			var updatedData = {
				category: items_content[0],
				content: items_content[1],
				key: items_content[2],
				poster: items_content[3],
				title: items_content[4],
				total_likes: items_content[5] + 1,
				total_replies: items_content[6],
				user_comments: items_content[7],
			}

			//Update the number of likes on the page
			var updates = {};
			updates['post_comment/' + post_key] = updatedData;
			firebase.database().ref().update(updates);

			var changedLikes = items_content[5] + 1;
			if (changedLikes == 1){
				$('#total_hearts').html(items_content[5] + 1 + " Like");
			}
			else{
				$('#total_hearts').html(items_content[5] + 1 + " Likes");
			}
		});
	});

	//If you press post_comment, the comments will appear and added to the bottom
	$("#post_comment").on('click',function(){
		console.log('the button is clicked');
		var input_content = document.getElementById("user_input");
		if (input_content.value.length != 0){
			//make a firebase database so that it can be editable in the future.
			var key = firebase.database().ref("post_comment/"+post_key+"/").child("user_comments").push().key;
			var comment = {
			  comment: input_content.value,
			  key: key,
			};

			var updates= {};
			updates["post_comment/"+ post_key +"/user_comments/"+key] = comment;
			firebase.database().ref().update(updates);
		}

		var comment_section = document.getElementsByClassName("comment_container")[0]; //the third item with the class container is our card format

		comment_array = [];
		firebase.database().ref("post_comment/"+ post_key +"/user_comments/").once('value', function(snapshot){
			snapshot.forEach(function(childSnapshot){
		        var childKey = childSnapshot.key;
		        var childValue = childSnapshot.val(); //object
		        comment_array.push(Object.values(childValue)); //convert object to array
		    });

			comment_array = comment_array.reverse(); //so that most recent comment comes at the top
			if (comment_array.length > 0){
				comment_section.innerHTML = "";
			}

			//Put all comments on the page
			for (var i=0; i<comment_array.length;i++){
				var username = "username";
				var comment_content = comment_array[i][0];
				var comment_key = comment_array[i][1];

				//Add to HTML
				//Make Container
				var username = "Wheelie (You)";
				var comment_content = comment_array[i][0];
				var comment_key = comment_array[i][1];

				var comment_card = document.createElement('div');
				comment_card.setAttribute("data-key", comment_key);
				comment_card.setAttribute('class', 'card comment_from_user shadow mb-3');
				var comment_body = document.createElement('div');
				comment_body.setAttribute('class', 'card-body p-4');
				comment_card.append(comment_body);


				var user_profile = document.createElement('img');
				user_profile.setAttribute('class', 'rounded-circle user-circle profile-pic d-inline');
				user_profile.setAttribute('width', '32em');
				user_profile.setAttribute('height', '32em');
				user_profile.setAttribute('src', 'duck.jpg');
				comment_body.append(user_profile);

				var user_comment_name = document.createElement('h6');
				user_comment_name.setAttribute('class', 'card-subtitle mb-2 d-inline pl-2 pr-2 username');
				user_comment_name.innerHTML = username;
				comment_body.append(user_comment_name);
				var answered = document.createElement('h6');
				answered.setAttribute('class', 'answered d-inline');
				answered.innerHTML = "answered";
				comment_body.append(answered);

				var comment_p = document.createElement('p');
				comment_p.setAttribute('class', 'd-block comment-content m-0 mt-3');
				comment_p.innerHTML = comment_content;
				comment_body.append(comment_p);


				comment_section.append(comment_card);
			}
		});
		// //clear textarea after inputting
		$('#user_input').val('');

		//Update number of comments in Firebase
		var path = firebase.database().ref('post_comment/' + post_key);
		path.once('value').then(function(snapshot){
			var items = snapshot.val();
			var items_content = Object.values(items);
			console.log('items: '+ Object.values(items));

			var updatedData = {
				category: items_content[0],
				content: items_content[1],
				key: items_content[2],
				poster: items_content[3],
				title: items_content[4],
				total_likes: items_content[5],
				total_replies: items_content[6] + 1,
				user_comments: items_content[7],
			}

			var updates = {};
			updates['post_comment/' + post_key] = updatedData;
			firebase.database().ref().update(updates);

			var changedReply = items_content[6] + 1;
			if (changedReply == 1){
				$('#total_replies').html(items_content[6] + 1 + " Reply");
				$('.number_replies').html(items_content[6] + 1 + " Reply");
			}
			else{
				$('#total_replies').html(items_content[6] + 1 + " Replies");
				$('.number_replies').html(items_content[6] + 1 + " Replies");
			}
		});

	});

	// Initialize comments on page
	function create_comment_section(){
		var input_content = document.getElementById("user_input");
		if (input_content.value.length != 0){
			//make a firebase database so that it can be editable in the future.
			var key = firebase.database().ref().child("").push().key;
			var comment = {
				comment: input_content.value,
				key: key,
			};

			var updates= {};
			updates["post_comment/"+"user_comments/"+key] = comment;
			firebase.database().ref().update(updates);
		}
	}

	//Load all pre-existing comments
	function get_comments(){
		var comment_section = document.getElementsByClassName("comment_container")[0]; //the third item with the class container is our card format
		comment_array = [];
		var comments_section_length = 0;
		firebase.database().ref("post_comment/"+ post_key +"/user_comments/").once('value', function(snapshot){
			snapshot.forEach(function(childSnapshot){
		        var childKey = childSnapshot.key;
		        var childValue = childSnapshot.val(); //object
		        comment_array.push(Object.values(childValue)); //convert object to array
		    });

			comment_array = comment_array.reverse(); //so that most recent comment comes at the top
			if (comment_array.length > 0){
				comment_section.innerHTML = "";
			}
			comments_section_length = comment_array.length;

			//Put all comments on the page
			for (var i=0; i<comment_array.length;i++){
				// console.log('comment_array[i]: '+ comment_array[i]);
				var username = "Wheelie (You)";
				var comment_content = comment_array[i][0];
				var comment_key = comment_array[i][1];

				var comment_card = document.createElement('div');
				comment_card.setAttribute("data-key", comment_key);
				comment_card.setAttribute('class', 'card comment_from_user shadow mb-3');
				var comment_body = document.createElement('div');
				comment_body.setAttribute('class', 'card-body p-4');
				comment_card.append(comment_body);


				var user_profile = document.createElement('img');
				user_profile.setAttribute('class', 'rounded-circle user-circle profile-pic d-inline');
				user_profile.setAttribute('width', '32em');
				user_profile.setAttribute('height', '32em');
				user_profile.setAttribute('src', 'duck.jpg');
				comment_body.append(user_profile);

				var user_comment_name = document.createElement('h6');
				user_comment_name.setAttribute('class', 'card-subtitle mb-2 d-inline pl-2 pr-2 username');
				user_comment_name.innerHTML = username;
				comment_body.append(user_comment_name);
				var answered = document.createElement('h6');
				answered.setAttribute('class', 'answered d-inline');
				answered.innerHTML = "answered";
				comment_body.append(answered);

				var comment_p = document.createElement('p');
				comment_p.setAttribute('class', 'd-block comment-content m-0 mt-3');
				comment_p.innerHTML = comment_content;
				comment_body.append(comment_p);


				comment_section.append(comment_card);
				// //Add to HTML
				// //Make Container
				// var comment_card = document.createElement("container");
				// comment_card.setAttribute("class", "card");
				// comment_card.classList.add("user_comment");
				// comment_card.setAttribute("data-key", comment_key);
				// // comment_card.style.marginLeft="0px";

				// //Comment Data
				// var username_info = document.createElement("div");
				// username_info.setAttribute('class',"username_info row");

				// var user_circle = document.createElement("span");
				// user_circle.setAttribute("class","user-circle");

				// var delete_button = document.createElement("button");
				// delete_button.setAttribute("class","delete_comment_button");
				// delete_button.innerHTML = "Delete";
				// // delete_button.setAttribute('onclick', 'delete_comment(this.parentElement.parentElement, this.parentElement)');

				// var username = document.createElement("span");
				// username.setAttribute("class","username");
				// // username.style.paddingBottom = '12px';
				// username.innerHTML = "Wheelie" + " (you)";

				// var user_write = document.createElement("p");
				// user_write.style.marginTop = '8px';
				// user_write.innerHTML = comment_content;

				// comment_section.append(comment_card);
				// username_info.append(user_circle);
				// username_info.append(username);
				// username_info.append(delete_button);
				// comment_card.append(username_info);
				// comment_card.append(user_write);

				//Change the numbers at the reply_like section
				// var number_replies = document.getElementsByClassName('number_replies')[0];
				// var total_like = document.getElementById('total_like');
				// if (comment_array.length == 1){
				// 	number_replies.innerHTML = comment_array.length + " Reply";
				// 	total_like.innerHTML = comment_array.length + " Reply";
				// }

				// else{
				// 	number_replies.innerHTML = comment_array.length + " Replies";
				// 	total_like.innerHTML = comment_array.length + " Replies";
				// }
			}
		});

		//Update number of comments in Firebase
		// var path = firebase.database().ref('post_comment/'+post_key+'/total_replies');
  //   	path.set(comments_section_length);
  //   	console.log('comment array length: ' + comments_section_length);
  //   	console.log('we changed it here');
	}
	create_comment_section();
	get_comments();
});