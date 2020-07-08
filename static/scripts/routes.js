//Firebase official documentation
const dbRef = firebase.database().ref();
const routesRef = dbRef.child('routes');

function fillContent(id, content) {
  document.getElementById(id).innerHTML = content;
}

var from_places = [];
var to_places = [];
var query = routesRef.orderByKey();
query.once('value').then(function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var from_db = childSnapshot.val().from;
    var to_db = childSnapshot.val().to;
    from_places.push(from_db);
    to_places.push(to_db);
  });
  //Thank you https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
  var from_set = [...new Set(from_places)];
  var to_set = [...new Set(to_places)];
  $("#fromPlace").autocomplete({
    source: from_set,
    autoFocus: true,
    delay: 0,
    minLength: 1
  });
  $("#toPlace").autocomplete({
    source: to_set,
    autoFocus: true,
    delay: 0,
    minLength: 1
  });
})

//Firebase official documentation
//Thank you StackOverflow (https://stackoverflow.com/questions/40471284/firebase-search-by-child-value, accessed on May 28) for equalTo
function fillPage(id) {
  $(".spinner").show();
  fillContent("hidID", id);
  var contentList = [];
  var query = routesRef.orderByKey().equalTo(id);
  query.once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var from_db = childSnapshot.val().from;
      var to_db = childSnapshot.val().to;
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
      var desc_db = childSnapshot.val().desc;
      var description_db = childSnapshot.val().description;
      var images_db = childSnapshot.val().images;
      var liked_db = childSnapshot.val().z_liked;

      var descriptionList = [];
      var imagesList = [];

      for (var i in description_db) {
        descriptionList.push(description_db[i]);
      }

      for (var i in images_db) {
        imagesList.push(images_db[i]);
      }

      contentList = [title_db, username_db, likes_db, descriptionList, landmarks_db, imagesList, ramp_db, elevator_db, wheelchair_db, rampdesc_db, eledesc_db, wheeldesc_db, desc_db, from_db, to_db, liked_db];
    });
    fillContent("card-individual-title", contentList[0]);
    fillContent("card-individual-username", contentList[1]);
    fillContent("card-individual-likes", (contentList[2] + " Likes"));
    fillContent("card-individual-description", contentList[12]);
    fillContent("card-individual-landmarks", contentList[4]);
    fillContent("rampContents", "Ramp: " + contentList[9]);
    fillContent("elevatorContents", "Elevator: " + contentList[10]);
    fillContent("wheelchairContents", "Wheelchair: " + contentList[11]);
    fillContent("hidfromPlace", contentList[13]);
    fillContent("hidtoPlace", contentList[14]);

    // if (!contentList[6]) {
    //   $("#rampAccordion").addClass("text-secondary");
    // }
    //
    // if (!contentList[7]) {
    //   $("#eleAccordion").addClass("text-secondary");
    // }
    //
    // if (!contentList[8]) {
    //   $("#wheelAccordion").addClass("text-secondary");
    // }

    if ((contentList[6] || contentList[7] || contentList[8]) == false) {
      nofacil = "<p id='no-facilities'>There are no accessibility facilities in this location</p>";
      $('#individualFacilities').append(nofacil);
    }

    for (var i = 0; i < contentList[3].length; i++) {
      var lst = "<li class='description-list'>" + contentList[3][i] + "</li>";
      $('#card-individual-how').append(lst);
    }

    for (var i = 0; i < contentList[5].length; i++) {
      var image = document.createElement("img");
      image.src = contentList[5][i];
      image.className = "place-picture";
      document.getElementById("individual-pictures").appendChild(image);
    }


    if (contentList[15]) {
      $('.like_icon').attr('src', 'icons/heart-fill.svg');
    }

    initMapindiv();
    $(".spinner").hide();
  })
}

//Thank you StackOverflow (stackoverflow.com/questions/29364121/passing-variable-when-opening-another-html-page-using-javascript,
//accessed on June 9) for using hash to transfer variables between pages
//https://stackoverflow.com/questions/5096103/jquery-closest-div-that-has-an-id, accessed on June 8, for closest div ID
function movePage(element) {
  var id = $(element).closest("div").attr("id");
  console.log(id);
  console.log($(element).attr("class"));
  if ($(element).hasClass("fromIndex")) {
    window.location.href = "routes-individual.html" + "#" + id + "/fromindex";
  } else {
    window.location.href = "routes-individual.html" + "#" + id + "/fromsearch";
  }
}

function loadCard(id, imgl, title, username, likes, desc, ramp, ele, wheel, liked, i) {
  var card = "<div class='card mb-5 ml-3 shadow border-0 route-card' id='" + id + "'><div class='card-body route-card-image'>" +
    "<img class='route-card-img' src='" + imgl[0] + "' width='102%'></div>" +
    "<div class='card-body'><div class='route-card-title'><h5>" + title + "</h5></div><div class='route-card-contents my-3'>" +
    desc + "</div><div class='d-flex justify-content-center align-items-center'><div class='route-card-icons'>";
  if (ramp) {
    card = card + "<span class=icon-ramp aria-hidden='true' id='icon-ramp'></span>";
  }
  if (ele) {
    card = card + "<span class=icon-elevator aria-hidden='true' id='icon-elevator'></span>";
  }
  if (wheel) {
    card = card + "<span class=icon-wheelchair aria-hidden='true' id='icon-wheelchair'></span>";
  }


  if (liked) {
    card = card + "</div></div></div><div class='card-footer color-yellow pb-0'>" +
      "<img src='homepagePictures/duck.jpg' width='24em' height='24em' class='rounded-circle profile-pic'><p class='route-card-username text-black'>" +
      username + "</p><div class='float-right'><img src='icons/heart-fill.svg' width='18' height='18'>" +
      "<span class='mx-2 pl-0 route-number-likes likes-and-comment text-black'>" + likes + " Likes </span></div></div></div>";
  } else {
    card = card + "</div></div></div><div class='card-footer color-yellow pb-0'>" +
      "<img src='homepagePictures/duck.jpg' width='24em' height='24em' class='rounded-circle profile-pic'><p class='route-card-username text-black'>" +
      username + "</p><div class='float-right'><img src='icons/heart.svg' width='18' height='18'>" +
      "<span class='mx-2 pl-0 route-number-likes likes-and-comment text-black'>" + likes + " Likes </span></div></div></div>";
  }

  //$('#routes-index-main').append(card);
  if (i % 2 == 0) {
    $('#routes-index-col-2').append(card);
  } else {
    $('#routes-index-col-3').append(card);
  }
}

//Thank you StackOverflow (https://stackoverflow.com/questions/332872/encode-url-in-javascript, accessed around May 28) for encodeURI
function searchRoute() {
  $(".spinner").show();
  $('.route-card').remove();
  $('#recommended-routes').remove();

  var from_value = document.getElementById("fromPlace").value;
  var to_value = document.getElementById("toPlace").value;
  var dataList = [];
  var query = routesRef.orderByKey();
  query.once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var from_db = childSnapshot.val().from;
      var to_db = childSnapshot.val().to;
      if ((encodeURIComponent(from_value.toLowerCase()) == encodeURIComponent(from_db.toLowerCase())) && (encodeURIComponent(to_value.toLowerCase()) == encodeURIComponent(to_db.toLowerCase()))) {
        var pushid = childSnapshot.key;
        var likes_db = childSnapshot.val().likes;
        var title_db = childSnapshot.val().title;
        var username_db = childSnapshot.val().username;
        var ramp_db = childSnapshot.val().ramp;
        var elevator_db = childSnapshot.val().elevator;
        var wheelchair_db = childSnapshot.val().wheelchair;
        var description_db = childSnapshot.val().desc;
        var images_db = childSnapshot.val().images;
        var liked = childSnapshot.val().z_liked;

        var imagesList = [];

        for (var i in images_db) {
          imagesList.push(images_db[i]);
        }

        dataList.push([pushid, imagesList, title_db, username_db, likes_db, description_db, ramp_db, elevator_db, wheelchair_db, liked]);
      }
    });

    if (dataList.length != 0) {
      $("#no_result").hide();
      for (var i = 0; i < (dataList.length); i++) {
        loadCard(dataList[i][0], dataList[i][1], dataList[i][2], dataList[i][3], dataList[i][4], dataList[i][5], dataList[i][6], dataList[i][7], dataList[i][8], dataList[i][9], i);
      }
    } else {
      $("#no_result").show();
    }
    $(".spinner").hide();
  })
}

//Thank you Google Maps official documentation
function initMap() {
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var daejeon = new google.maps.LatLng(36.3501, 127.3849);
  var mapOptions = {
    zoom: 13,
    center: daejeon
  }
  var map = new google.maps.Map(document.getElementById('gmaps'), mapOptions);
  directionsRenderer.setMap(map);

  var onClickHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };

  document.getElementById('searchRouteButton').addEventListener('click', onClickHandler);
}

function initMapindiv() {
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var daejeon = new google.maps.LatLng(36.3501, 127.3849);
  var mapOptions = {
    zoom: 13,
    center: daejeon
  }
  var map = new google.maps.Map(document.getElementById('gmaps-indiv'), mapOptions);
  directionsRenderer.setMap(map);

  $(document).ready(function() {
    calculateAndDisplayRouteindiv(directionsService, directionsRenderer);
  })
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService.route({
      origin: {
        query: document.getElementById('fromPlace').value
      },
      destination: {
        query: document.getElementById('toPlace').value
      },
      travelMode: 'TRANSIT'
    },
    function(response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
}

function calculateAndDisplayRouteindiv(directionsService, directionsRenderer) {
  directionsService.route({
      origin: {
        query: document.getElementById('hidfromPlace').innerHTML
      },
      destination: {
        query: document.getElementById('hidtoPlace').innerHTML
      },
      travelMode: 'TRANSIT'
    },
    function(response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
}

// function changeMapPlace(location) {
//   var beginlink = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDTFFrlgMNcm4J0uJixFbI5U9pIYDayUmY&q=";
//   var place = encodeURIComponent(location);
//   var endlink = "&maptype=roadmap&language=en";
//   $("#gmaps").attr("src", (beginlink + place + endlink));
// }

$("#individual-backto").click(function() {
  if ($(this).closest("div").hasClass("fromindex")) {
    window.location.href = "routes-index.html";
  } else {
    var id = $(this).closest("div").attr("id");
    window.location.href = "routes-index.html" + "#" + id;
  }
})

$("#searchRouteButton").click(function() {
  //  changeMapPlace(document.getElementById("toPlace").value);

  let inputsFrom = document.getElementById('fromPlace').value;
  let inputsTo = document.getElementById('toPlace').value;
  let alertMessage = document.getElementsByClassName('alertMessage')[0];

  $('.alertMessage').hide();
  $('.alertMessage').addClass('alert alert-danger');

  if ((inputsFrom == "") && (inputsTo == "")) {
    alertMessage.innerHTML = "Please fill in your starting place and destination.";
    $(".alertMessage").slideDown();
    setTimeout(function() {
      $(".alertMessage").slideUp();
    }, 5000);
  } else if (inputsFrom == "") {
    alertMessage.innerHTML = "Please fill in your starting place.";
    $(".alertMessage").slideDown();
    setTimeout(function() {
      $(".alertMessage").slideUp();
    }, 5000);
  } else if (inputsTo == "") {
    alertMessage.innerHTML = "Please fill in your destination.";
    $(".alertMessage").slideDown();
    setTimeout(function() {
      $(".alertMessage").slideUp();
    }, 5000);
  } else {
    searchRoute();
  }
})

$("#addRouteButton").click(function() {
  alert("Sorry, 'Add Routes' is not implemented yet. Please search from the available routes.");
})

$("#goRatesButton").click(function() {
  var destrate = document.getElementById("hidtoPlace").innerHTML;
  var destencoded = encodeURIComponent(destrate.toLowerCase());
  window.location.href = "restaurant_rate.html?name=" + destencoded;
})

// $("#addToMyListCard").click(function() {
//   alert("Sorry, 'Add to My List' is not implemented yet.");
// })

$(".arrow-up-down").click(function() {
  var temp = document.getElementById("fromPlace").value;
  document.getElementById("fromPlace").value = document.getElementById("toPlace").value;
  document.getElementById("toPlace").value = temp;
})

$(document).on("click", ".route-card", function() {
  movePage($(this));
})

//Thank youhttps: stackoverflow.com/questions/40589397/firebase-db-how-to-update-particular-value-of-child-in-firebase-database
function click_heart(id) {
  var query = routesRef.orderByKey().equalTo(id);
  query.once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var liked = childSnapshot.val().z_liked;
      var total_likes = childSnapshot.val().likes;
      if (!liked) {
        console.log('liked is false: ', liked);
        firebase.database().ref('routes/' + id + '/z_liked').set(true);
        firebase.database().ref('routes/' + id + '/likes').set(total_likes + 1);
        $('#card-individual-likes').html(total_likes + 1 + ' Likes');
        $('.like_icon').attr('src', 'icons/heart-fill.svg');
      } else {
        firebase.database().ref('routes/' + id + '/z_liked').set(false);
        firebase.database().ref('routes/' + id + '/likes').set(total_likes - 1);
        $('#card-individual-likes').html(total_likes - 1 + ' Likes');
        $('.like_icon').attr('src', 'icons/heart.svg');
      }
    });
  });
}

$('.like_icon').on('click', function() {
  console.log("clicked");
  var this_id = document.getElementById("hidID");
  var id = this_id.innerHTML;
  click_heart(id);
})

$(document).on("mouseenter", ".route-card", function() {
  $(this).animate({
    marginTop: "-=3%"
  }, 250)
  $(this).removeClass("shadow").addClass("shadow-lg")
})
$(document).on("mouseleave", ".route-card", function() {
  $(this).animate({
    marginTop: "0"
  }, 250)
  $(this).removeClass("shadow-lg").addClass("shadow")
})

//Thank you very much http://jsfiddle.net/4p57wx8r/
$(document).on("click", ".place-picture", function() {
  $('.imagepreview').attr('src', $(this).attr('src'));
  $('#imagemodal').modal('show');
});
