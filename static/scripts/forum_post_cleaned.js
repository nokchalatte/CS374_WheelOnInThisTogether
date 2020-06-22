// Fix comment amount bug

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
	$("#like-msg").hide();
	$("#post-msg").hide();
	$("#empty-msg").hide();
	$("#delete-msg").hide()

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

				//If it's liked before, then initialize as liked
				if (childValue.liked){
					var like_button = document.getElementsByClassName('heart_button')[0];
					like_button.setAttribute('src','icons/heart-fill.svg');
				}

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

				if (childValue.liked){
					var like_heart = document.getElementsByClassName('heart_button')[0];
					like_button.setAttribute('src','icons/heart-fill.svg');
				}
			};
		});
	});

	// Delete comment posted by user when they push the button
	$(document).on('click','.delete_comment_button', function(){
		var selected_comment =  $(this).closest('.comment_from_user');
		console.log('the selected comment: ',selected_comment.html());

		//Delete the html 
		selected_comment.remove();
		//Change the firebase database
		var comment_key = selected_comment.attr('data-key');
		console.log('comment key: ', comment_key);
		var path = firebase.database().ref('post_comment/' + post_key+'/user_comments/'+comment_key);
		path.remove(); //remove from database
		var main_path = firebase.database().ref('post_comment/' + post_key);
		main_path.once('value').then(function(snapshot){
			var items = snapshot.val();
			var items_content = Object.values(items);
			var updatedData = {
				category: items_content[0],
				content: items_content[1],
				key: items_content[2],
				liked: items_content[3],
				poster: items_content[4],
				title: items_content[5],
				total_likes: items_content[6],
				total_replies: items_content[7]-1,
				user_comments: items_content[8],
				// if (items.length == 8){
				// 	user_comments: null,
				// }
				// else{
				// 	user_comments: items_content[8],
				// }
			}
			//Update the number of likes on the page
			var updates = {};
			updates['post_comment/' + post_key] = updatedData;
			firebase.database().ref().update(updates);

			var changedReplies = items_content[7] - 1;
			if (changedReplies == 1){
				$('#total_replies').html(items_content[7] - 1 + " Reply");
				$('.number_replies').html(items_content[7] - 1 + " Reply");
			}
			else{
				$('#total_replies').html(items_content[7] - 1 + " Replies");
				$('.number_replies').html(items_content[7] - 1 + " Replies");
			}
		});
		$("#delete-msg").slideDown()
        setTimeout(function() {
            $("#delete-msg").slideUp()
        }, 5000);
	});

	$('.heart_button').on('click', function(){
		var path = firebase.database().ref('post_comment/' + post_key);
		path.once('value').then(function(snapshot){
			// var liked = false;
			var items = snapshot.val();
			var items_content = Object.values(items);
			// console.log('items: '+ Object.values(items));
			var liked = items_content[3];
			// console.log('liked: '+ !liked);
			console.log('liked: '+ liked);
			//If liked, popup comes up
			if (liked){
				// console.log("you already liked it!");
				// var like_message = document.getElementById('like-msg');
				// like_message.setAttribute('style', 'display:')

				var like_button = document.getElementsByClassName('heart_button')[0];
				like_button.setAttribute('src','icons/heart.svg');
				var path = firebase.database().ref('post_comment/' + post_key);
				//Update number of likes in Firebase
				path.once('value').then(function(snapshot){
					var items = snapshot.val();
					var items_content = Object.values(items);
					// console.log('items: '+ Object.values(items));
					var updated_userComments = null;
					if (items.length >8){
						updated_userComments = items_content[8]
					}

					var updatedData = {
						category: items_content[0],
						content: items_content[1],
						key: items_content[2],
						liked: false,
						poster: items_content[4],
						title: items_content[5],
						total_likes: items_content[6] - 1,
						total_replies: items_content[7],
						user_comments: updated_userComments,
						// if (items.length == 8){
						// 	user_comments: null,
						// }
						// else{
						// 	user_comments: items_content[8],
						// }
					}
					//Update the number of likes on the page
					var updates = {};
					updates['post_comment/' + post_key] = updatedData;
					firebase.database().ref().update(updates);

					var changedLikes = items_content[6] - 1;
					if (changedLikes == 1){
						$('#total_hearts').html(items_content[6] - 1 + " Like");
					}
					else{
						$('#total_hearts').html(items_content[6] - 1 + " Likes");
					}
				});
			}
			//If the post is not liked yet, it can like.
			else{
				$("#like-msg").slideDown()
	            setTimeout(function() {
	                $("#like-msg").slideUp()
	            }, 5000);
				console.log('tis ');
				//Change heart to colored
				var like_button = document.getElementsByClassName('heart_button')[0];
				like_button.setAttribute('src','icons/heart-fill.svg');
				var path = firebase.database().ref('post_comment/' + post_key);

				//Update number of likes in Firebase
				path.once('value').then(function(snapshot){
					var items = snapshot.val();
					var items_content = Object.values(items);
					// console.log('items: '+ Object.values(items));
					var updated_userComments = null;
					if (items.length >8){
						updated_userComments = items_content[8]
					}

					var updatedData = {
						category: items_content[0],
						content: items_content[1],
						key: items_content[2],
						liked: true,
						poster: items_content[4],
						title: items_content[5],
						total_likes: items_content[6] + 1,
						total_replies: items_content[7],
						user_comments: updated_userComments,
						// if (items.length == 8){
						// 	user_comments: null,
						// }
						// else{
						// 	user_comments: items_content[8],
						// }
					}

					//Update the number of likes on the page
					var updates = {};
					updates['post_comment/' + post_key] = updatedData;
					firebase.database().ref().update(updates);

					var changedLikes = items_content[6] + 1;
					if (changedLikes == 1){
						$('#total_hearts').html(items_content[6] + 1 + " Like");
					}
					else{
						$('#total_hearts').html(items_content[6] + 1 + " Likes");
					}
				});
			};
		});
	});

	// $('.heart_button').hover(function(e){
	// 	e.preventDefault();
	// 	// console.log('it\'s hovering.');
	// });

	//If you press post_comment, the comments will appear and added to the bottom
	$("#post_comment").on('click',function(){
		// if the text is empty, then make error popup
		var user_input = document.getElementById('user_input');
		// console.log('user_input: ', user_input.innerHTML);
		if (user_input.value == ''){
			console.log('it is empty');
			$("#empty-msg").slideDown()
	        setTimeout(function() {
	            $("#empty-msg").slideUp()
	        }, 5000);
		}
		else{
			// if not you then post it
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

					var delete_button = document.createElement('button');
					delete_button.setAttribute('class', 'btn float-right delete_comment_button');
					// delete_button.setAttribute('onclick', "delete_comment");
					delete_button.innerHTML = 'Delete';
					comment_body.append(delete_button);


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
					liked: items_content[3],
					poster: items_content[4],
					title: items_content[5],
					total_likes: items_content[6],
					total_replies: items_content[7] + 1,
					user_comments: items_content[8],
				}

				var updates = {};
				updates['post_comment/' + post_key] = updatedData;
				firebase.database().ref().update(updates);

				var changedReply = items_content[7] + 1;
				if (changedReply == 1){
					$('#total_replies').html(items_content[7] + 1 + " Reply");
					$('.number_replies').html(items_content[7] + 1 + " Reply");
				}
				else{
					$('#total_replies').html(items_content[7] + 1 + " Replies");
					$('.number_replies').html(items_content[7] + 1 + " Replies");
				}
			});
	        $("#post-msg").slideDown()
	        setTimeout(function() {
	            $("#post-msg").slideUp()
	        }, 5000);
    	};
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
		$(".spinner").show();
		var comment_section = document.getElementsByClassName("comment_container")[0]; //the third item with the class container is our card format
		document.getElementsByClassName("comment_container").innerHTML = ''
		comment_array = [];
		var comments_section_length = 0;
		$(".spinner").show();
		firebase.database().ref("post_comment/"+ post_key +"/user_comments/").once('value', function(snapshot){
			snapshot.forEach(function(childSnapshot){
		        var childKey = childSnapshot.key;
		        var childValue = childSnapshot.val(); //object
		        comment_array.push(Object.values(childValue)); //convert object to array
		    });
		    // $(".spinner").hide();

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

				var delete_button = document.createElement('button');
				delete_button.setAttribute('class', 'btn float-right delete_comment_button');
				// delete_button.setAttribute('onclick', "delete_comment");
				delete_button.innerHTML = 'Delete';
				comment_body.append(delete_button);

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
			$(".spinner").hide();
		});

		//Update number of comments in Firebase
		// var path = firebase.database().ref('post_comment/'+post_key+'/total_replies');
  //   	path.set(comments_section_length);
  //   	console.log('comment array length: ' + comments_section_length);
  //   	console.log('we changed it here');
	}

	// document.getElementById('user_input').onkeypress = function(e){
	// 	if (!e) e = window.event;
	// 	var key = e.keyCode || e.which;
	// 	if (key == '13'){
	// 		document.getElementById('post_comment').click();
	// 		$('#user_input').html('');
	// 		console.log('it is pressed');
	// 	}
	// }
	create_comment_section();
	get_comments();
});