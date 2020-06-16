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

$(document).ready(function() {
    var urlParams = new URLSearchParams(window.location.search)
    var rest_name = urlParams.get('name')
    var rest_key = null

    //----------------INPUT STAR THANG-------------------------
    var facility_input = null;
    var access_input = null;
    var safety_input = null;
    turn_rating_on()
    //------------------------------------------------------------


    $(".post-btn").click(function() {
        if (facility_input == null || access_input == null || safety_input == null) {
            $("#error-msg").show()
        } else {
            $(".star-input .icon-star").removeClass("icon-star").addClass("icon-star-unselected")
            turn_rating_on()
            var input_data = {
                facility: facility_input,
                accessibility: access_input,
                safety: safety_input,
                comment: $("#comment").val(),
                username: "wheelie"
            }
            console.log(input_data)
            insert_new_comment(rest_key, input_data).then(function() {
                //Refresh and add the new comment
                $("#comment-list").prepend(comment_format(input_data))
                $("#rating-modal").modal('hide')
                $("#success-msg").show()
            })
        }
    })

    $(".cross").click(function(){
        $(this).parent().parent().hide()
    })
    // Find the data from the database
    get_restaurant_db(rest_name).then((result) => {
        console.log(result.key)
        rest_key = result.key
        display_rating_page(result.val())
        $(".spinner").hide()
    })

    //Helper function
    //turn_rating_on(): turn on the listener of stars for hover
    function turn_rating_on() {
        $(".star-input .icon-star-unselected").hover(function() {
            $(this).removeClass("icon-star-unselected").addClass("icon-star")
            var star_val = parseInt($(this).data('value'))
            
            //Highlight all the required star
            $(this).parent().children().each(function() {
                if ($(this).data('value') < star_val) {
                    $(this).removeClass("icon-star-unselected").addClass("icon-star")
                }
            })
        }, function() {
            $(this).removeClass("icon-star").addClass("icon-star-unselected")
            var star_val = parseInt($(this).data('value'))
            
            //Highlight all the required star
            $(this).parent().children().each(function() {
                if ($(this).data('value') < star_val) {
                    $(this).removeClass("icon-star").addClass("icon-star-unselected")
                }
            })
        }
        )

        $(".star-input .icon-star-unselected").click(function() {
            $(this).off('mouseenter mouseleave')
            $(this).removeClass("icon-star-unselected").addClass("icon-star")
            var star_val = parseInt($(this).data('value'))
            var category = $(this).parent().attr('id')
            //Highlight all the required star
            $(this).parent().children().each(function() {
                $(this).off('mouseenter mouseleave')
                if ($(this).data('value') <= star_val) {
                    $(this).removeClass("icon-star-unselected").addClass("icon-star")
                } else {
                    $(this).removeClass("icon-star").addClass("icon-star-unselected")
                }
            })
            if (category=="facility-input") {
                facility_input = star_val
                console.log(facility_input)
            }
            else if (category=="accessibility-input") {
                access_input = star_val
                console.log(access_input)
            }
            else {
                safety_input = star_val
                console.log(safety_input)
            }
            console.log(category)
        })
    }
})

async function get_restaurant_db(rest_name) {
    try {
        var ref = firebase.database().ref("restaurant/")
        var result = null
        await ref.orderByChild('name').equalTo(rest_name).once('value', function(snapshot) {
            snapshot.forEach(res => {
                result = res
            });
        })
        await display_image(rest_name)
    }
    finally {
        return result
    }
}

async function insert_new_comment(rest_key, new_comment) {
    try {
        const ref = firebase.database().ref("restaurant/"+rest_key).child("user_ratings")
        await ref.push(new_comment)
    }
    catch(error) {
        console.log(error)
    }
}

async function display_image(rest_name) {
    try {
        var img_ref = firebase.storage().ref('restaurants/'+rest_name+'/'+rest_name+'.jpg')
        img_ref.getDownloadURL().then(function(url) {
            //Display the image
            var image_html = "<img class='rest-image' src='"+url+"'>"
            $(".image").html(image_html)
        })
    }
    catch(error) {
        console.log(error)
    }
}

function display_rating_page(rest_db) {
    // Display the name
    const name = rest_db.name
    $('.restaurant-name').text(name)
    console.log(name)

    //Display the main rating
    const ratings = rest_db.rating
    var facility_rating = ratings.facility
    var star = generate_star(facility_rating)
    $('#facility-star').html(star)
    var accessibility_rating = ratings.accessibility
    star = generate_star(accessibility_rating)
    $('#accessibility-star').html(star)
    var safety_rating = ratings.safety
    star = generate_star(safety_rating)
    $('#safety-star').html(star)
    var overall_rating = ratings.overall
    star = generate_star(overall_rating)
    $('#overall-star').html(star)

    //Display restaurant info
    $('#info-phone').text(rest_db.phone)
    $('#info-tel').text(rest_db.tel)
    $('#info-web').text(rest_db.site)

    //Display comment
    display_comment(rest_db)
}

function generate_star(star_num) {
    var star_html = ""
    for (i = 0; i < star_num; i++) {
        star_html += "<span class='icon-star'></span>"
    }
    return star_html
}

function display_comment(restaurant_db) {
    const user_ratings = restaurant_db.user_ratings
    console.log(user_ratings)
    for (var key of Object.keys(user_ratings)) {
        $("#comment-list").prepend(comment_format(user_ratings[key]))
    }
}

function comment_format(user_rating) {
    //Comment star
    var facility_star = "<h5>" + generate_star(user_rating.facility) +"</h5>"
    var accessibility_star = "<h5>" + generate_star(user_rating.accessibility) +"</h5>"
    var safety_star = "<h5>" + generate_star(user_rating.safety) +"</h5>"

    var overall = Math.floor((user_rating.facility+ user_rating.accessibility + user_rating.safety)/3)
    var overall_star = "<h3 class='overall'>" + generate_star(overall) + "</h3>"
    var star_rating = "<div class='comment-star col-md-2'>" + overall_star+ facility_star + accessibility_star + safety_star + "</div>"

    //Comment detail
    var comment_detail = "<div class='comment-detail col-md-6'> <p>" + user_rating.comment + "</p></div>"

    //Comment info
    var comment_info = "<div class='comment-info row'><div class='comment-category col-md-2'> <h3 class='overall'> OVERALL</h3><h5> Facility </h5><h5> Accessibility</h5><h5> Safety</h5> </div>" + star_rating + "<div class='vertical-line'></div>" + comment_detail + "</div>"

    //user info
    var user_info = "<div class='user-info row'><span class='user-circle'></span><span class='username'>" + user_rating.username + "</span><div class='vertical-line'></div><span class='icon-like icon'></span><span class='like-number'> 24 Likes </span></div>"

    // Full comment
    var comment = "<div class='card comment'>" + comment_info + user_info + "</div>"
    return comment
}