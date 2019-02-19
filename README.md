# Day2Day-HaclkNYU-2019

## Inspiration
Planning a day has always been a problem when we need to figure out which events to attend without missing a class every semester. There are lot of events which happen at NYU but it is difficult to keep a track of them due the large count. We do not want to miss the class and want to attend the interesting events which do not overlap with the 
class schedule. We wanted something which could help us plan the day effectively and this motivated us to build this web application. 

## What it does
The web application first takes the user details in the registration process. Then we can add the courses which we want attend and take user input for the class timings and day. Then we select a date for which we want our schedule. After we select a date, all the events on that day are listed and we mark the events by red stating that it is overlapping with the schedule of class. We also have a feature of bookmark where a user can save the favorite events for easy access to them. For each event, we have used Google Maps API to show the distance from the current location to the destination where the event is by bus, train and walking and guide the person to the destination. On the map, we have highlighted the unsafe area (data obtained using the Public Safety Incident Data API). After every calendar year(Academic Calendar API), we delete the user profile so that he can create a new profile and add the new courses.  

## How we built it
We first created a backend MySQL database to store the user information which is name, password, email, courses attending with their details and list of favorite events. We then created a web application for the User Interface so that people can register and login to the application. Then, we use the course list using the NYU IT API (Course Catalog). User selects the courses and adds the timing and day when the course is which is then added to the database corresponding to the user. User is then allowed to select a date from the calendar to see an ideal schedule. The courses on that particular day are highlighted with green and all the event on the same day are listed (Engage API). The events overlapping the timings with the class schedule are marked red. Then we added a feature for the user to mark the favorite events which are updated in the database. For each event, we have used Google Maps API to show the distance from the current location to the destination where the event is by bus, train and walking and guide the person to the destination. We analyzed the data obtained from the Public Safety Incident Data API and highlighted the area on the Google Map.

## Challenges we ran into
Scheduling the events along with the class timings was a challenging task during the process of making this web application.

## Accomplishments that we're proud of
We are able successfully write the algorithm for the scheduling of the classes with the events and implement the feature of bookmarks for the favorite events and sessions for the web application.

## What we learned
We learnt how to work in a team and time management. Also, we learnt data visualization by analyzing the Public Safety Incident Data API to find crime rate in the areas. We majorly used Node.js Express framework which was a major learning.

## What's next for Day2Day
Create a mobile application for it and launch it on Apple store and Android play store for NYU students.

## Screenshots
![login](https://user-images.githubusercontent.com/32939619/52917226-ef325280-32b6-11e9-99be-7273cbb286b2.jpeg)
![register](https://user-images.githubusercontent.com/32939619/52917227-ef325280-32b6-11e9-876b-e371737106e4.jpeg)
![courses](https://user-images.githubusercontent.com/32939619/52917222-ef325280-32b6-11e9-9b84-46811d171c04.jpeg)
![events](https://user-images.githubusercontent.com/32939619/52917224-ef325280-32b6-11e9-89ed-f03413aa4120.jpeg)
![favourites](https://user-images.githubusercontent.com/32939619/52917225-ef325280-32b6-11e9-87f1-b2c381681669.jpeg)

