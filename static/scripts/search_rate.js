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
    get_restaurants().then((res) => {
        console.log(res)
        // $(".spinner").hide()
        // rest_names = []
        // console.log(res[0])
        // for (idx in res) {
        //     console.log()
        // }
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
        // console.log($(this).find(".rstrnt-name").text())
        var rest_name = $(this).find(".rstrnt-name").text().toLowerCase()
        var new_pathname = "/restaurant_rate.html" + "?name=" + rest_name
        var curr_html = window.location.href
        var new_url = curr_html.replace(/\/[^\/]*$/, new_pathname)
        window.location.href = new_url
    })
})

function display_query_result(rest_db, query) {
    console.log(rest_db)
    var result = null
    for (idx in rest_db) {
        if (rest_db[idx].name.toLowerCase() == query) {
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
        console.log(result)
        display_rest_card(result)
    }
}

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
    display_image(result.name).then((img_url) => {
        var rest_img = ''
        console.log(result.name)
        if (img_url ==null) {
            rest_img ="<img src='https://www.solidbackgrounds.com/images/1920x1080/1920x1080-gray-solid-color-background.jpg' class='card-img-top'></img>"
        }
        else {
            rest_img = "<img src='" + img_url + "' class='card-img-top'></img>"
        }
        const rest_name = "<h3 class='card-title rstrnt-name'>" + result.name + "</h3>"
        const rest_star = "<p class='card-text'>" + generate_star(result.rating.overall) + "</p>"
        const rest_body = "<div class='card-body rstrnt-card'>" + rest_name + rest_star + "</div>"
        
        // display_image(result.name)
        var card_html = "<div class='col-md-3 col-sm-6'><div class='card rest-card'>" + rest_img + rest_body + "</div></div>"
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
        console.log('hey')
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
