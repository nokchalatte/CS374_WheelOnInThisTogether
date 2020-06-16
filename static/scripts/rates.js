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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

$(document).ready(function(){
    // var rest_db = null;
    get_restaurants().then((res) => {
        console.log("test")
        console.log(res)
        $(".spinner").hide()
        rest_names = []
        console.log(res[0])
        for (idx in res) {
            console.log()
        }
        display_autofill(res)
        $("#search-input").keypress(function(event) {
            if (event.which == "13") {
                event.preventDefault()
                console.log($("#search-input").val())
                display_query_result(res, $("#search-input").val())
                $("#search-input").val('')
            }
        })

        $("#search-btn").click(function() {
            event.preventDefault()
            console.log($("#search-input").val())
            display_query_result(res, $("#search-input").val())
            $("#search-input").val('')
        })


    })

    $(document).on("click", ".rest-card", function(){
        console.log($(this).find(".restaurant-name").text())
        var rest_name = $(this).find(".restaurant-name").text().toLowerCase()
        var new_pathname = "/rating_ind.html" + "?name=" + rest_name
        var curr_html = window.location.href
        var new_url = curr_html.replace(/\/[^\/]*$/, new_pathname)
        window.location.href = new_url
    })
})

async function display_autofill(rest_db) {
    get_rest_names().then((res) => {
        console.log(res)
        $("#search-input").autocomplete({
            source: res,
            select: function(event, ui) {
                $("#search-input").val(ui.item.value)
                display_query_result(rest_db, $("#search-input").val())
                $("#search-input").val('')
                event.preventDefault()
            }
          });
    })
}

async function get_rest_names() {
    try {
        var rest_names = []
        var rest 
        firebase.database().ref('restaurant/').once('value', function(snapshot) {
            snapshot.forEach(function(data) {
                rest_names.push(data.val().name)
            })
        })
    }
    finally {
        return rest_names
    }
}

function display_query_result(rest_db, query) {
    // console.log(rest_name)
    var result = null
    for (idx in rest_db) {
        if (rest_db[idx].name.toLowerCase() == query) {
            result = rest_db[idx]
            console.log(query)
            break;
        }
    }
    if (!result) {
        $(".no-result").show()
        $('#restaurant-cards').empty()
    }
    else {
        $(".no-result").hide()
        display_rest_card(result)
    }
}

async function display_image(rest_name) {
    try {
        var img_ref = firebase.storage().ref('restaurants/'+rest_name+'/'+rest_name+'.jpg')
        img_ref.getDownloadURL().then(function(url) {
            //Display the image
            var image_html = "<img class='rest-image' src='"+url+"'>"
            $(".card-image").html(image_html)
        })
    }
    finally {
        $(".spinner").hide()
    }
}

function display_rest_card(result) {
    $(".spinner").show()
    const rest_name = "<h3 class='rest-name'>" + result.name + "</h3>"
    const rest_star = "<h3>" + generate_star( result.rating.overall) + "</h3>"
    display_image(result.name)
    var card_html = "<div class='card rest-card'><div class='card-image'> </div><div class='card-content'><div  class='restaurant-name'>" + rest_name + rest_star + "</div></div></div>"
    $('#restaurant-cards').append(card_html)
}

function generate_star(star_num) {
    var star_html = ""
    for (i = 0; i < star_num; i++) {
        star_html += "<span class='icon-star'></span>"
    }
    return star_html
}

async function get_restaurants() {
    try {
        var rest_names = []
        firebase.database().ref('restaurant/').once('value', function(snapshot) {
            snapshot.forEach(function(data) {
                rest_names.push(data.val())
            })
        })
    }
    catch(error) {
        console.log(error)
    }
    finally {
        console.log('hey')
        console.log(rest_names)
        return rest_names
    }
}