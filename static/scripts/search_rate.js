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
    $('[data-toggle="tooltip"]').tooltip()
    
    $(".spinner").show()
    get_restaurants().then((res) => {
        //console.log(res)
        display_explore(res)
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

    $(document).on("mouseenter", ".rest-card", function() {
        $(this).animate({
            marginTop: "-=3%"
        }, 250)
        $(this).removeClass("shadow-sm").addClass("shadow")
    })
    $(document).on("mouseleave", ".rest-card", function() {
        $(this).animate({
            marginTop: "0"
        }, 250)
        $(this).removeClass("shadow").addClass("shadow-sm")
    })

    $(document).on("click", ".rest-card", function(){
        // console.log($(this).find(".rstrnt-name").text())
        var rest_name = $(this).find(".rstrnt-name").text().toLowerCase()
        var new_pathname = "/restaurant_rate.html" + "?name=" + rest_name
        var curr_html = window.location.href
        var new_url = curr_html.replace(/\/[^\/]*$/, new_pathname)
        window.location.href = new_url
    })

    $("#add-new-place").click(function(){
        alert("Sorry, this feature is not available yet")
    })
})

function display_query_result(rest_db, query) {
    $('#rec-text').hide()
    // console.log(rest_db)
    var result = null
    for (idx in rest_db) {
        if (rest_db[idx].name.toLowerCase() == query.toLowerCase()) {
            result = rest_db[idx]
            break;
        }
    }
    if (!result) {
        $(".no-result").show()
        $('.result-cards').empty()
    }
    else {
        $(".no-result").hide()
        $('.result-cards').empty()
        // console.log(result)
        display_rest_card(result)
    }
}

async function display_autofill(rest_db) {
    get_rest_names().then((res) => {
        // console.log(res)
        $("#search-input").autocomplete({
            source: res,
            minLength: 1,
            select: function(event, ui) {
                $("#search-input").val(ui.item.value)
                display_query_result(rest_db, $("#search-input").val())
                $("#search-input").val('')
                event.preventDefault()
            }
          });
    })
}

async function display_image(rest_name) {
    try {
        var img_url = null
        var img_ref = firebase.storage().ref('restaurants/'+rest_name+'/'+rest_name+'.jpg')
        return await img_ref.getDownloadURL()
    }
    catch(error) {
        console.log(error)
    }
}

function display_rest_card(result) {
    $(".spinner").show()
    console.log(result)
    var size = Object.keys(result.user_ratings).length
    var rating = result.rating
    display_image(result.name).then((img_url) => {
        var rest_img = ''
        console.log(result.name)
        if (img_url ==null) {
            rest_img ="<img src='https://www.solidbackgrounds.com/images/1920x1080/1920x1080-gray-solid-color-background.jpg' class='card-img-top'></img>"
        }
        else {
            rest_img = "<img src='" + img_url + "' class='card-img-top'></img>"
        }
        const rest_name = "<h5 class='card-title rstrnt-name'>" + result.name + "</h5>"
        const overall =  (rating.facility+rating.accessibility + rating.safety)/3
        const rest_star = "<p class='card-text'>" + generate_star(Math.round(overall/size)) + "</p>"
        const rest_body = "<div class='card-body rstrnt-card color-yellow'>" + rest_name + rest_star + "</div>"
        
        // display_image(result.name)
        var card_html = "<div class='col-md-3 col-sm-6'><div class='card rest-card shadow-sm color-yellow border-0'>" + rest_img + rest_body + "</div></div>"
        $('.result-cards').append(card_html)
        $(".spinner").hide()
    })
}

function generate_star(num, size=24) {
    var star_html = ""
    for (i = 0; i < num; i++) {
        star_html += "<img src='icons/star-fill.svg' width='"+size+"' height='"+size+"'></img>\n"
    }
    return star_html
}

async function get_restaurants() {
    try {
        var rest_names = []
        await firebase.database().ref('restaurant/').once('value', function(snapshot) {
            snapshot.forEach(function(data) {
                rest_names.push(data.val())
            })
        })
    }
    catch(error) {
        console.log(error)
    }
    finally {
        console.log(rest_names)
        return rest_names
    }
}

async function get_rest_names() {
    try {
        var rest_names = []
        await firebase.database().ref('restaurant/').once('value', function(snapshot) {
            snapshot.forEach(function(data) {
                rest_names.push(data.val().name)
            })
        })
    }
    finally {
        return rest_names
    }
}

function display_explore(rest_db) {
    console.log("hey")
    console.log(rest_db.length)
    for (i = 1; i < 4; i++)  {
        display_rest_card(rest_db[rest_db.length-i])
    }
}
