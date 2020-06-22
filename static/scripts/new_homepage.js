$(document).ready(function () {
    var from_set; var to_set;
    var from_places = []; var to_places = []; var key_places = [];

    var firebaseConfig = {
        apiKey: "AIzaSyDTFFrlgMNcm4J0uJixFbI5U9pIYDayUmY",
        authDomain: "wheeloninthistogether123.firebaseapp.com",
        databaseURL: "https://wheeloninthistogether123.firebaseio.com",
        projectId: "wheeloninthistogether123",
        storageBucket: "wheeloninthistogether123.appspot.com",
        messagingSenderId: "728495178731",
        appId: "1:728495178731:web:06792b904ccd5693b2cfae",
        measurementId: "G-2SRFF7XTB2"
    };

    firebase.initializeApp(firebaseConfig);

    const dbRef = firebase.database().ref();
    const routesRef = dbRef.child('routes');
    const restaurantRef = dbRef.child('restaurant');
    var routesQuery = routesRef.orderByKey();
    var restaurantQuery = restaurantRef.orderByKey();

    //AUTOCOMPLETE
    routesQuery.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var from_db = childSnapshot.val().from;
            var to_db = childSnapshot.val().to;
            var key_db = childSnapshot.key;
            if(!from_places.includes(from_db)) {
                from_places.push(from_db);
                to_places.push(to_db);  
                key_places.push(key_db);              
            }
            
        });
    });

    $("#fromLocation").autocomplete({
        source: from_places, 
        autoFocus: true,
        delay: 0,
        minLength: 1
    });

    $("#toLocation").autocomplete({
        source: to_places, 
        autoFocus: true,
        delay: 0,
        minLength: 1
    });

    // ROUTES SEARCHING
    $('.our_buttons').on('click', function() {
        let inputsFrom = document.getElementsByClassName('form-control')[0].value;
        let inputsTo = document.getElementsByClassName('form-control')[1].value;
        let alertMessage = document.getElementsByClassName('alertMessage')[0];

        $('.alertMessage').addClass('alert alert-danger');

        if ((inputsFrom == "") && (inputsTo == "")) { 
            alertMessage.innerHTML = "Please fill in your starting place and destination."
            $(".alertMessage").slideDown()
            setTimeout(function() {
                $(".alertMessage").slideUp()
            }, 5000);
        }
        else if (inputsFrom == "") { 
            alertMessage.innerHTML = "Please fill in your starting place.";
            $(".alertMessage").slideDown()
            setTimeout(function() {
                $(".alertMessage").slideUp()
            }, 5000);
        }
        else if (inputsTo == "") { 
            alertMessage.innerHTML = "Please fill in your destination.";
            $(".alertMessage").slideDown()
            setTimeout(function() {
                $(".alertMessage").slideUp()
            }, 5000);
        }
        else {
            for (k=0; k<from_places.length; k++) {
                if (inputsFrom == from_places[k]) {
                    window.location.href = "routes-index.html" + "#" + key_places[k];
                }
            }            
        }
    })

    // HOMEPAGE ANIMATION
    $(document).on('mouseenter', '.rest-card', function(){
        $(this).animate({marginTop: "-=3%"}, 150);
    });   

    $(document).on('mouseleave', '.rest-card', function(){
        $(this).animate({marginTop: "0"}, 150);
    }); 

    // FORUM SPECIFIC CATEGORIES 
    $('.advice_card').on('click', function() {
        let categoryName = $(this).find('.category').html();
        if (categoryName == "Advice") { window.open('forum_homepage_advice.html','_self'); }
        else if (categoryName == "Health") { window.open('forum_homepage_health.html','_self'); }
        else if (categoryName == "Events") { window.open('forum_homepage_exercise.html','_self'); }
    }) 

    //RATES CLICK PLACES
    $('.rest-card').on('click', function() {
        let restaurantRates = $(this).find('.card-title').html();
        if (restaurantRates == "Jungsik Seoul") { window.open('restaurant_rate.html?name=jungsik%20seoul','_self'); }
        else if (restaurantRates == "Museum of Fine Arts") { window.open('restaurant_rate.html?name=museum%20of%20fine%20arts','_self'); }
        else if (restaurantRates == "Haeundae Beach") { window.open('restaurant_rate.html?name=haeundae%20beach','_self'); }
        else if (restaurantRates == "Robinsons Otis") { window.open('restaurant_rate.html?name=robinsons%20otis','_self'); }
    }) 
});