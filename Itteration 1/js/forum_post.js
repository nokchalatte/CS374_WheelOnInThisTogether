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

  // $('.bi-trash-fill').on('click', function(){
  //   console.log('trash obiz');
  // })
  function delete_comment(){
    console.log('delete button is clicked!');
    var key = $(this).attr('title');
    console.log('key is: ', key);
  }
  document.getElementsByClassName("delete_comment_button")[0].addEventListener("click", delete_comment);


  // $('button.delete_comment_button').click(function(){
  //   console.log('delete button is clicked!');
  //   var key = $(this).parent().parent().getAttribute('data-key');
  //   console.log('key is: ', key);
  // });
    $('.heart_button').on('click', function(){
      console.log('you pressed like:D');
      var path = firebase.database().ref('post_comment/'+post_key+'/total_likes');
      var total_in_firebase = 0;
      path.once('value', function(snapshot){
        // console.log('snapshot: '+ snapshot.val());
        total_in_firebase = snapshot.val() + 1;
        // snapshot.val() = snapshot.val() + 1;
        // console.log('snapshot: '+ snapshot.val());
      })
      // console.log('path: '+path);
      var number_likes = document.getElementById('total_hearts');
      // var total = path.val();
      // console.log('total: ' + total);
      // console.log(number_likes.innerHTML.split('')[1]);
      // var number = parseFloat(number_likes.innerHTML.split('')[1]) + 1;
      if (total_in_firebase == 1){
        number_likes.innerHTML = total_in_firebase + " Like";
      }
      else{
        number_likes.innerHTML = total_in_firebase + " Likes";
      }
      //increment value in firebase by 1.
      var path = firebase.database().ref('post_comment/'+post_key+'/total_likes');
      path.set(total_in_firebase);
      console.log('added');
    });

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
      comment_array = comment_array.reverse();
      if (comment_array.length >0){
        comment_section.innerHTML = "";
      }

      for (var i=0; i<comment_array.length;i++){
        var username = "username";
        var comment_content = comment_array[i][0];
        var comment_key = comment_array[i][1];

        //Add to HTML
        //Make Container
        var comment_card = document.createElement("container");
        comment_card.setAttribute("class", "card");
        comment_card.classList.add("user_comment");
        comment_card.setAttribute("data-key", comment_key);
        // comment_card.style.marginLeft="0px";

        //Comment Data
        var username_info = document.createElement("div");
        username_info.setAttribute('class',"username_info row");

        var user_circle = document.createElement("span");
        user_circle.setAttribute("class","user-circle");

        var delete_button = document.createElement("button");
        delete_button.setAttribute("class","float-right delete_comment_button");
        delete_button.innerHTML = "Delete";

        var username = document.createElement("span");
        username.setAttribute("class","username");
        // username.style.paddingBottom = '12px';
        username.innerHTML = "Wheelie" + " (you)";

        var user_write = document.createElement("p");
        user_write.style.marginTop = '8px';
        user_write.innerHTML = comment_content;

        comment_section.append(comment_card);
        username_info.append(user_circle);
        username_info.append(username);
        username_info.append(delete_button);
        comment_card.append(username_info);
        comment_card.append(user_write);

        var number_replies = document.getElementsByClassName('number_replies')[0];
        var total_like = document.getElementById('total_like');
        if (comment_array.length == 1){
          number_replies.innerHTML = comment_array.length + " Reply";
          total_like.innerHTML = comment_array.length + " Reply";
        }
        else{
          number_replies.innerHTML = comment_array.length + " Replies";
          total_like.innerHTML = comment_array.length + " Replies";
        }

      // $(.comment_container).append('<div class="container comment_card"> <div class="user_comment card"><div class="username_info row"><span class="user-circle"></span><label class="username">Username</label></div><p class="comment_content">I’m having trouble with finding food around here. Hello I’m a new student here and I’m not that familiar with the campus, do you guys have recommended places to go to that’s accessible?</p></div></div>');

      }
    });
      //clear textarea after inputting
      $('#user_input').val('');

      var comment_card = document.createElement("div");
      comment_card.setAttribute('class','alert');
      var writing = document.createElement('p');
      writing.innerHTML = "you succesfully made a comment!";
      comment_card.append(writing);
      // comment_card.append(comment_card);
      document.body.appendChild(comment_card);
      console.log('it should appear');
    })

  var values = [];
  
  //Read the Data from Firebase
  firebase.database().ref('post_comment').once('value',function(snapshot){
    snapshot.forEach(function(childSnapshot){
        var childKey = childSnapshot.key;
        if (childKey.localeCompare(post_key) == 0){
          // console.log('this is the item');
          var childValue = childSnapshot.val(); 
          // console.log(childValue);
          $('.tag').html(childValue.category);
          $('.content_post').html(childValue.content);
          $('.username').html(childValue.poster);
          $('.disc_topic').html(childValue.title);
          if (childValue.total_replies == 1){
            $('#total_likes').html(childValue.total_replies + " Reply");
            $('.number_replies').html(childValue.total_replies + " Reply");
          } else{
            $('#total_likes').html(childValue.total_replies + " Replies");
            $('.number_replies').html(childValue.total_replies + " Replies");
          }
          if (childValue.total_likes == 1){
            $('#total_replies').html(childValue.total_likes + " Like");
          } else{
            $('#total_replies').html(childValue.total_likes + " Likes");
          }
        }
    })

    // Initiaze comments on page
    function get_comment(){
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

  // Load all the pre-existing comments
  function create_comment(){
  	var comment_section = document.getElementsByClassName("comment_container")[0]; //the third item with the class container is our card format

  	comment_array = [];
  	firebase.database().ref("post_comment/"+post_key+ "/user_comments/").once('value', function(snapshot){
  		snapshot.forEach(function(childSnapshot){
  			var childKey = childSnapshot.key;
  			var childValue = childSnapshot.val(); //object
  			comment_array.push(Object.values(childValue)); //convert object to array
  		});
  		comment_array = comment_array.reverse();
  		if (comment_array.length >0){
  			comment_section.innerHTML = "";
  		}

  		for (var i=0; i<comment_array.length;i++){
  			var username = "username";
  			var comment_content = comment_array[i][0];
  			var comment_key = comment_array[i][1];

  			//Add to HTML
  			//Make Container
  			var comment_card = document.createElement("container");
  			comment_card.setAttribute("class", "card");
  			comment_card.classList.add("user_comment");
  			comment_card.setAttribute("data-key", comment_key);
  			// comment_card.style.marginLeft="0px";

  			//Comment Data
  			var username_info = document.createElement("div");
  			username_info.setAttribute('class',"username_info row");

        //icon for deleting
        var delete_button = document.createElement("button");
        delete_button.setAttribute("class","float-right delete_comment_button");
        // delete_button.setAttribute('onclick',"delete_comment(this.parentElement.parentElement)");
        delete_button.innerHTML = "Delete";

  			var user_circle = document.createElement("span");
  			user_circle.setAttribute("class","user-circle");

  			var username = document.createElement("span");
  			username.setAttribute("class","username");
        // username.style.paddingBottom = '12px';
  			username.innerHTML = "Wheelie" + " (you)";

  			var user_write = document.createElement("p");
        user_write.style.marginTop = '8px';
  			user_write.innerHTML = comment_content;

			comment_section.append(comment_card);
			username_info.append(user_circle);
			username_info.append(username);
      username_info.append(delete_button);
			comment_card.append(username_info);
			comment_card.append(user_write);

			var number_replies = document.getElementsByClassName('number_replies')[0];
      var number_comment = document.getElementsByClassName('number_replies')[1];
			var total_like = document.getElementById('total_like');
			if (comment_array.length == 1){
				number_replies.innerHTML = comment_array.length + " Reply";
				total_like.innerHTML = comment_array.length + " Reply";
			}
			else{
				number_replies.innerHTML = comment_array.length + " Replies";
				total_like.innerHTML = comment_array.length + " Replies";
			}
  		}
      // Testing
      // firebase.database().ref('post_comment/'+post_key).on('value',function(snapshot){
      //   snapshot.val()[6] = comment_array.length;
      //   // console.log(Object.values(snapshot.val()));
      // });
  	});
    var path = firebase.database().ref('post_comment/'+post_key+'/total_replies');
    path.set(comment_array.length);
  }

  create_comment();
});
});















