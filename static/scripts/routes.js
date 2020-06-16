//Firebase official documentation
const dbRef = firebase.database().ref();
const routesRef = dbRef.child('routes');

function fillContent(id, content) {
  document.getElementById(id).innerHTML = content;
}

//Firebase official documentation
//Thank you StackOverflow (https://stackoverflow.com/questions/40471284/firebase-search-by-child-value, accessed on May 28) for equalTo
function fillPage(id){
  var contentList = [];
  var query = routesRef.orderByKey().equalTo(id);
  query.once('value').then(function(snapshot){
     snapshot.forEach(function(childSnapshot){
       var likes_db = childSnapshot.val().likes;
       var title_db = childSnapshot.val().title;
       var username_db = childSnapshot.val().username;
       var landmarks_db = childSnapshot.val().landmarks;
       var ramp_db = childSnapshot.val().ramp;
       var elevator_db = childSnapshot.val().elevator;
       var wheelchair_db = childSnapshot.val().wheelchair;
       var rampdesc_db = childSnapshot.val().rampdesc;
       var eledesc_db = childSnapshot.val().eledesc;
       var wheeldesc_db = childSnapshot.val().wheeldesc;
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

       contentList = [title_db, username_db, likes_db, descriptionList, landmarks_db, imagesList, ramp_db, elevator_db, wheelchair_db, rampdesc_db, eledesc_db, wheeldesc_db];
     });
  fillContent("card-individual-title", contentList[0]);
  fillContent("card-individual-username", contentList[1]);
  fillContent("card-individual-likes", (contentList[2] + " Likes"));
  fillContent("card-individual-list-1", contentList[3][0]);
  fillContent("card-individual-list-2", contentList[3][1]);
  fillContent("card-individual-list-3", contentList[3][2]);
  fillContent("card-individual-landmarks", contentList[4]);

  if (contentList[6]){
    fillContent("rampContents", contentList[9]);
  } else {
    $("#facilitiesRamp").hide();
  }

  if (contentList[7]){
    fillContent("elevatorContents", contentList[10]);
  } else {
    $("#facilitiesElevator").hide();
  }

  if (contentList[8]){
    fillContent("wheelchairContents", contentList[11]);
  } else {
    $("#facilitiesWheelchair").hide();
  }

  if ((contentList[6] && contentList[6] && contentList[6]) == false){
    nofacil = "<p id='no-facilities'>There are no accessibility facilities in this location</p>";
    $('#individualFacilities').append(nofacil);
  }

  for(var i=0; i<contentList[5].length; i++){
    var image = document.createElement("img");
    image.src = contentList[5][i];
    image.className = "place-picture";
    document.getElementById("individual-pictures").appendChild(image);
  }
  })
}

$( document ).ready(function() {

  //Thank you StackOverflow (stackoverflow.com/questions/29364121/passing-variable-when-opening-another-html-page-using-javascript,
  //accessed on June 9) for using hash to transfer variables between pages
  //https://stackoverflow.com/questions/5096103/jquery-closest-div-that-has-an-id, accessed on June 8, for closest div ID
  function movePage(element){
    var id = $(element).closest("div").attr("id");
    var more_info = window.open("routes-individual.html"+"#"+id);
  }

  function loadCard(id, imgl, title, username, likes, descl, ramp, ele, wheel, i){
    var card = "<div class='card mb-5 ml-3 shadow border-0 route-card' id='" + id + "'><div class='card-body route-card-image'>"
                + "<img class='route-card-img' src='" + imgl[0] + "' width='102%'></div>"
                + "<div class='card-body'><div class='route-card-title'><h5>" + title + "</h5></div><div class='username-group'>"
                + "<img src='icons/person-circle.svg' width='24' height='24'><p class='mb-0 route-card-username'>"
                + username + "</p><div class='route-likes float-right'><img src='icons/heart.svg' width='18' height='18'>"
                + "<p class='route-number-likes'>" + likes + " Likes</p></div></div><div class='route-card-contents my-3'>"
                + "<ol><li class='route-contents-list'>" + descl[0] + "</li><li class='route-contents-list'>" + descl[1] + "</li><li class='route-contents-list'>" + descl[2] + "</li></ol></div>"
                + "<div class='route-card-icons mb-3'>";
    if (ramp){
      card = card + "<span class=icon-ramp aria-hidden='true' id='icon-ramp'></span>";
    }
    if (ele){
      card = card + "<span class=icon-elevator aria-hidden='true' id='icon-elevator'></span>";
    }
    if (wheel){
      card = card + "<span class=icon-wheelchair aria-hidden='true' id='icon-wheelchair'></span>";
    }

    card = card + "</div></div><div class='card-footer route-card-blue'><img src='icons/chevron-right.svg' class='chevron-icon float-right' alt='more_information' style='border:none;' width='24' height='24'></div></div>";

    //$('#routes-index-main').append(card);
    if (i%2 == 0){
      $('#routes-index-col-2').append(card);
    } else{
      $('#routes-index-col-3').append(card);
    }
  }

//Thank you StackOverflow (https://stackoverflow.com/questions/332872/encode-url-in-javascript, accessed around May 28) for encodeURI
  function searchRoute(){
    $('.route-card').remove();

    var from_value = document.getElementById("fromPlace").value;
    var to_value = document.getElementById("toPlace").value;
    var dataList = [];
    var query = routesRef.orderByKey();
    query.once('value').then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        var from_db = childSnapshot.val().from;
        var to_db = childSnapshot.val().to;
        if ((encodeURIComponent(from_value.toLowerCase()) == encodeURIComponent(from_db.toLowerCase())) && (encodeURIComponent(to_value.toLowerCase()) == encodeURIComponent(to_db.toLowerCase()))){
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

    if (dataList.length != 0){
      $("#no_result").hide();
      var x = 0; var y = -468;
      for (var i=0; i<(dataList.length); i++){
        loadCard(dataList[i][0], dataList[i][1], dataList[i][2], dataList[i][3], dataList[i][4], dataList[i][5], dataList[i][6], dataList[i][7], dataList[i][8], i);
      }
    } else{
      $("#no_result").show();
    }
    })
  }

  function changeMapPlace(location){
    var beginlink = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDTFFrlgMNcm4J0uJixFbI5U9pIYDayUmY&q=";
    var place = encodeURIComponent(location);
    var endlink = "&maptype=roadmap&language=en";
    $("#gmaps").attr("src", (beginlink+place+endlink));
  }

  $("#searchRouteButton").click(function(){
    changeMapPlace(document.getElementById("toPlace").value);
    searchRoute();
  })

  $("#addRouteButton").click(function(){
    alert("Sorry, 'Add Routes' is not implemented yet. Please search from the available routes.");
  })

  $("#addToMyListCard").click(function(){
    alert("Sorry, 'Add to My List' is not implemented yet.");
    console.log("Add clicked");
  })

  $( document ).on("click", ".route-card", function(){
    movePage($(this));
  })

})
