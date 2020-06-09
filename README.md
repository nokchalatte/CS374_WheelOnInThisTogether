# CS374_WheelOnInThisTogether
CS374 WheelOnInThisTogether main documentation hub.

### Using Icon

Class names for icons are located on the bottom part of style guide
To use it, use 
```
<span class=“icon-class”></span>
```
To change the styling of the icon for individual page, add new styling in the page's CSS.
**DO NOT** modify the styling in styleguide.css, unless it is already agreed upon (e.g must fit 24 x 24 box)

### Implementation
The Web application is made using with HTML, CSS, Javascript, and applying the Bootstrap and jQuery framework.

### Homepage
The homepage shows the three core functionalities of our application: routes, forum, and rating. By clicking on the "View More" button, you will be redirected to the page you want to see.

### Routes
You can find the most optimal route to go to a certain place according to other users here. Type in the place you want to go from in the "from" input box, and then type in the place you want to go to in the "to" input box. After that, click on the search button. If the places you want to go to and from have been added by other users, route cards will show. The maps at the bottom of the route search form will also show the place you want to go to. Otherwise, the page will show "No entry to show".

If you click on the blue arrow button at the bottom of each card, a new window containing the full route information, which includes the complete route description, landmarks, and pictures, will open. You can click on the "Back to Route Search Page" to go back to the routes search page.

Route information is stored in Firebase Realtime Database, and pictures are stored in Firebase Storage. Links to each image a user includes in their route card are stored under each route entry's data in the realtime database. When you search for a certain route, the web application will look for matching routes in the database.

In this prototype, we prepared route cards for going from "한국과학기술원 진리관" to "Starbucks Eoeun-dong, Yuseong-gu, Daejeon".

### Forum
In this page, users are able to create forum posts to ask other users. Each post has a topic category, a topic title, and its content. Users are free to leave a comment and like other people's post. 

The backend implementation of this page uses mainly javascript and jQuery. To send data between two different html pages without relying on database frameworks, we used the Firebase and manipulated the data with javascript and jQuery. The representative code is as follows:

[Code Photo]

We created a key for every new post, and when a user clicks on the post, a data-key attribute is added to the url and the url is changed to the post's Forum Post page.

[Photo]

From there, we change the items such as the post title, category, and content according to the attributes stored in the Firebase. That way, when we go back, or refresh, the data remains.


### Rating

You can find the rating and reviews of a certain restaurant. The rating homepage is a search page, where user can input the restaurant name, and it will show the result as rating card. Otherwise, if there is no corresponding review, it will show the "No result found".

When a rating card is clicked, it will lead to the restaurant review page. The page consists of the the restaurant info, rating, and user reviews. There are three subratings, "Facility", "Accessibility", and "Safety". 

User can input their review using "RATE YOUR EXPERIENCE" button. It will open a new popup, where use can input their ratings and comment. The review can be only submitted if all the rating is filled. Otherwise, a warning message will appear to remind user to fill all the rating. 


Once the review is submitted, a feedback message will appear, telling that it has been successfully posted, and the new review will appear on the top of the comment section
