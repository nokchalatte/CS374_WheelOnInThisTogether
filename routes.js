const dbRef = firebase.database().ref();
const routesRef = dbRef.child('routes');

function fillContent(id, content) {
  document.getElementById(id).innerHTML = content;
}

function fillPage(id){
  var contentList = [];
  var query = routesRef.orderByKey().equalTo(id);
  query.once('value').then(function(snapshot){
     snapshot.forEach(function(childSnapshot){
       var likes_db = childSnapshot.val().likes;
       var title_db = childSnapshot.val().title;
       var username_db = childSnapshot.val().username;
       var landmarks_db = childSnapshot.val().landmarks;
       var description_db = childSnapshot.val().description;
       var images_db = childSnapshot.val().images;

       var descriptionList = [];
       var imagesList = [];

       for (var i in description_db){
         descriptionList.push(description_db[i]);
       }

       for (var i in images_db){
         imagesList.push(images_db[i]);
       }

       contentList = [title_db, username_db, likes_db, descriptionList, landmarks_db, imagesList];
     });
  fillContent("card-individual-title", contentList[0]);
  fillContent("card-individual-username", contentList[1]);
  fillContent("card-individual-likes", (contentList[2] + " Likes"));
  fillContent("card-individual-list-1", contentList[3][0]);
  fillContent("card-individual-list-2", contentList[3][1]);
  fillContent("card-individual-list-3", contentList[3][2]);
  fillContent("card-individual-landmarks", contentList[4]);

  for(var i=0; i<contentList[5].length; i++){
    var image = document.createElement("img");
    image.src = contentList[5][i];
    image.className = "place-picture";
    document.getElementById("individual-pictures").appendChild(image);
  }
  })
}

$( document ).ready(function() {

  function movePage(element){
    console.log("move move");
    var id = $(element).closest("div").attr("id");
    var more_info = window.open("routes-individual.html"+"#"+id);
  }

  function loadCard(id, imgl, title, username, likes, descl, ramp, ele, wheel){
    var card = "<div class='card route-card' id='" + id + "'><div class='route-card-image' style='background-image: url('" + imgl[0] + "');'></div>"
                + "<div class='route-card-title'><h5>" + title + "</h5></div><div class='username-group'>"
                + "<div class='username-circle'></div><div class='username' id='username-index'><p>"
                + username + "</p></div><div class='route-likes'><span class=icon-like aria-hidden='true' id='heart-number'></span>"
                + "<small class='number-of-likes' id='route-number-likes'>" + likes + " Likes</small></div></div><div class='route-card-contents'>"
                + "<ol><li>" + descl[0] + "</li><li>" + descl[1] + "</li><li>" + descl[2] + "</li></ol></div>"
                + "<div class='route-card-icons'>";
    if (ramp == true){
      card = card + "<span class=icon-ramp aria-hidden='true' id='icon-ramp'></span>";
    }
    if (ele == true){
      card = card + "<span class=icon-elevator aria-hidden='true' id='icon-elevator'></span>";
    }
    if (wheel == true){
      card = card + "<span class=icon-wheelchair aria-hidden='true' id='icon-wheelchair'></span>";
    }

    card = card + "</div><div class='route-card-blue'></div><a href='#'>"
                + "<img src='icon-chevron.svg' class='chevron-icon' alt='more_information' style='border:none;'></a></div>";

    $('#routes-index-main').append(card);
    console.log("card loaded");
  }

  function searchRoute(){
    var from_value = document.getElementById("fromPlace").value;
    var to_value = document.getElementById("toPlace").value;
    var dataList = [];
    var query = routesRef.orderByKey();
    query.once('value').then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        var from_db = childSnapshot.val().from;
        var to_db = childSnapshot.val().to;
        if ((encodeURIComponent(from_value) == encodeURIComponent(from_db)) && (encodeURIComponent(to_value) == encodeURIComponent(to_db))){
          var pushid = childSnapshot.key;
          var likes_db = childSnapshot.val().likes;
          var title_db = childSnapshot.val().title;
          var username_db = childSnapshot.val().username;
          var ramp_db = childSnapshot.val().ramp;
          var elevator_db = childSnapshot.val().elevator;
          var wheelchair_db = childSnapshot.val().wheelchair;
          var description_db = childSnapshot.val().description;
          var images_db = childSnapshot.val().images;

          var descriptionList = [];
          var imagesList = [];

          for (var i in description_db){
            descriptionList.push(description_db[i]);
          }

          for (var i in images_db){
            imagesList.push(images_db[i]);
          }

          dataList.push([pushid, imagesList, title_db, username_db, likes_db, descriptionList, ramp_db, elevator_db, wheelchair_db]);
        }
      });

    var x = 0; var y = -468;
    for (var i=0; i<(dataList.length); i++){
      loadCard(dataList[i][0], dataList[i][1], dataList[i][2], dataList[i][3], dataList[i][4], dataList[i][5], dataList[i][6], dataList[i][7], dataList[i][8]);
      if (i%2 == 0){
        x = 38;
        y = y + 524;
      } else {
        x = 66;
      }
      document.getElementById(dataList[i][0]).style.cssText = "left:" + x + "%; top:" + y + "px;";
    }
    })
  }

  function changeMapPlace(location){
    var beginlink = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDTFFrlgMNcm4J0uJixFbI5U9pIYDayUmY&q=";
    var place = encodeURIComponent(location);
    var endlink = "&maptype=roadmap&language=en";
    $("#gmaps").attr("src", (beginlink+place+endlink));
    console.log("map changed");
  }

  $("#searchRouteButton").click(function(){
    console.log("search button clicked");
    changeMapPlace(document.getElementById("toPlace").value);
    searchRoute();
  })

  $("#routes-index-main").on("click", ".chevron-icon", function(){
    console.log("arrow clicked!");
    movePage($(this));
  })

})
