const express = require('express');
const request = require('request');
const db = require('../config/database_conn');

var key_auth= 'Bearer add-key';

const router = express.Router();
var sess;
var USER_ID, USER_NAME;

var eventDetails = [];
var favourite_events = [];
var selectedDate = "";

module.exports = () => {
    router.get('/',(req,res,next) => {
        sess = req.session;
        if (!sess.sessId) {
            return res.render('registration', {
                page: 'Registration',
                flag: 0
            });


        } else {
            var userId = sess.sessId;
            console.log("Inside Route 1");
            var userFullName = "";
            var sql = "SELECT fullname from users where uid='"+userId+"'";
            db.query(sql, (err, result) => {
                if (result.length > 0) {
                    userFullName = result[0].fullname;
                    USER_ID = userId;
                    USER_NAME = userFullName;

                    res.redirect('/home');
                } else {
                    return next();
                }
            });
        }
    });

    router.post('/register',(req,res,next) => {
        const username = req.body.username;
        const password = req.body.password;
        const fullName = req.body.fullname;

        // Save to Database and redirect to login
        const sql = "INSERT INTO users (fullname,password,uname) VALUES('"+fullName+"','"+ password + "','" + username + "')";
        db.query(sql,(err,result) => {
            if (err){
                successfulRegistration = false;
                console.log(err);
                return res.render('registration', {
                    page: 'Registration',
                    flag: 1
                });
            }else{
                return res.render('registration', {
                    page: 'Registration',
                    flag: 2
                });
            }
        });
    });
    
    router.post('/login',(req,res,next) => {
        const userName = req.body.userName;
        const password = req.body.password;
        
        db.query("SELECT * FROM users where uname = '"+ userName +"' and password='" + password + "'",
            (err, result) => {
                if (err){
                    return res.send(err);
                }
                if (result.length == 0) {
                    res.render('registration', {
                        page: 'Registration',
                        flag: 3
                    })
                } else {
                    sess = req.session;
                    sess.sessId = result[0].uid;
                    USER_ID = result[0].uid;
                    USER_NAME = result[0].fullname;
                    res.redirect('/home');
                }
            });
    });

    router.post('/logout', (req, res, next) => {
        console.log("inside logout");
        req.session.destroy((err) => {
            if (err) {
                console.log("Error");
            } else {
                console.log("Completing Logout");
                res.redirect('/');
            }
        });
    });

    router.get('/home', async (req,res,next) => {
        var courseResults = [];
        var enrolledCourseIds = [];
        var enrolledCoursesDict = [];
        var enrolledCourseStartTime = [];
        var enrolledCourseEndTime = [];
        var enrolledCourseDay = [];

        db.query("SELECT courseid,starttime,endtime,day from courses where uid='"+ USER_ID +"'",
          (err,result) => {
            if (result.length > 0){
               for (var i = 0; i < result.length; i++){
                   enrolledCourseIds.push(result[i].courseid);
                   enrolledCourseStartTime.push(result[i].starttime);
                   enrolledCourseEndTime.push(result[i].endtime);
                   enrolledCourseDay.push(result[i].day);
               }
            }
          });

       request({
            url: 'https://sandbox.api.it.nyu.edu/course-catalog-exp/courses',
            headers: {
               'Authorization': key_auth
            },
            rejectUnauthorized: false
          }, function(err, result) {
                if(err) {
                  console.error(err);
                } else {
                  var results = JSON.parse(result.body);
                  var i;
                  
                  for (i = 0; i < results.length; i++) {
                    courseResults.push({
                        'courseId': results[i].course_id,
                        'courseName': results[i].course_title
                    }); 
                  }

                  for (var j = 0; j < enrolledCourseIds.length; j++){
                      if (courseResults.some(e => e.courseId == enrolledCourseIds[j])){
                          enrolledCoursesDict.push({
                            'enrolledCourseId': enrolledCourseIds[j],
                            'enrolledCourseName':courseResults[j]['courseName'],
                            'enrolledCourseStartTime':enrolledCourseStartTime[j],
                            'enrolledCourseEndTime':enrolledCourseEndTime[j],
                            'enrolledCourseDay':enrolledCourseDay[j]
                          });
                      }
                  }
                }
                
                return res.render('home',{
                    id:USER_ID,
                    name:USER_NAME,
                    courseResults: courseResults,
                    enrolledCourses: enrolledCoursesDict,
                    eventDetails: eventDetails
                });
          });
    });
    
    router.post('/home/getevents',(req,res,next) => {
       var startDate = req.body.startDate;
       selectedDate = startDate;
       var startDateNew = new Date(startDate);

       var days = {0:'Monday', 1:'Tuesday', 2:'Wednesday', 3:'Thursday', 4:'Friday', 5:'Saturday', 6:'Sunday'};
       startDate = startDateNew.getFullYear() + "-" + (startDateNew.getMonth() + 1)+ "-" + (startDateNew.getDate()+1);

       const request = require('request');
       var startTime="",endTime="";
       var endDate = startDateNew.getFullYear() + "-" + (startDateNew.getMonth() + 1)+ "-" + (startDateNew.getDate()+2);
       var description = "",title="";

request({
  url: 'https://sandbox.api.it.nyu.edu/engage-exp/events?start_date='+startDate+'&end_date='+endDate+'&keywords=',
  headers: {
     'Authorization': key_auth
  },
  rejectUnauthorized: false
}, function(err, result) {

      if(err) {
        console.error(err);
      } else {
        var results = JSON.parse(result.body);
        var i;
        eventDetails=[];
        for (i = 0; i < results.length; i++) {
         
         if (results[i].description.trim().length > 0){ 
             description = results[i].description.replace('"','');
             title=results[i].name.replace('"','');
          if(results[i].occurrences[0].is_all_day == true){
            startTime = "00:00:00";
            endTime = "11:59:00";
          }
          else{
            
            startTime = results[i].occurrences[0].starts_at.split("T")[1].split("Z")[0];
            endTime = results[i].occurrences[0].ends_at.split("T")[1].split("Z")[0];
          }

          if (results[i].occurrences[0].starts_at.split('-')[2].split('T')[0] == startDate.split('-')[2]){
            var test = new Date(results[i].occurrences[0].starts_at.split('T')[0]);
            eventDetails.push({
                "eventName":title,
                "eventDescription":description,
                "eventLocation":results[i].location,
                "eventStartTime":startTime,
                "eventEndTime":endTime,
                "eventDate":results[i].occurrences[0].starts_at,
                "eventDateEnd":results[i].occurrences[0].ends_at, 
                "eventDay": days[test.getDay()]
            });
          }
        }

        function dynamicSort(property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }
        eventDetails=eventDetails.sort(dynamicSort("eventStartTime")); 
        }
      }
      res.redirect('/home');
});
    });

    router.post('/home',(req,res,next) => {
        courseId = req.body.courseId;
        startTime = req.body.startTime;
        endTime = req.body.endTime;
        courseDay = req.body.day;

        const sql = "INSERT INTO courses (uid,courseid,starttime,endtime,day) VALUES('"+USER_ID+"','"+ courseId + "','" + startTime + "','"+endTime+"','"+courseDay+"')";
        db.query(sql,(err,result) => {
            if (err){
                console.log(err);
            }else{
               console.log("Saved Successfully");
               res.redirect('/home');
            }
        });
        
    });

    router.post('/favourite',(req,res,next) => {
        uid = req.body.uid;
        event_name = req.body.event_name;
        event_date = selectedDate;
        event_starttime = req.body.event_starttime;
        event_endtime = req.body.event_endtime;
        event_desc = req.body.event_desc;

        console.log(uid);
        console.log(event_name);

        // console.log(courseId, startTime, endTime, courseDay);
        // const sql =  "SELECT * FROM favourites";
        const sql = 'INSERT INTO favourites VALUES("'+uid+'","'+ event_name +'","' + event_desc + '","'+event_date+'","'+event_starttime+'","'+event_endtime+'")';
        db.query(sql,(err,result) => {
            if (err){
                
                console.log(err);
               
            }else{
               console.log("Saved Successfully");
               res.redirect('/home');
            }
        });
        
    });

    router.post('/unfavourite',(req,res,next) => {
        
        event_name = req.body.event_name;
        
        const sql = "DELETE FROM favourites where uid='5' and event_name='"+ event_name +"'";
        db.query(sql,(err,result) => {
            if (err){
                
                console.log(err);
               
            }else{
               console.log("Saved Successfully");
               res.redirect('/home/favourite');
            }
        });
        
    });


    router.get('/home/favourite',(req,res,next) =>{
 
        db.query("SELECT uid,event_name,event_desc,event_date,event_starttime,event_endtime from favourites where uid='"+ USER_ID +"'",
          (err,result) => {
            //   console.log(result)
            favourite_events=[];
            if (result.length > 0){
               for (var i = 0; i < result.length; i++){
                    
                    favourite_events.push({
                        "event_name":result[i].event_name,
                        "event_desc":result[i].event_desc,
                        "event_date":result[i].event_date,
                        "event_starttime":result[i].event_starttime,
                        "event_endtime":result[i].event_endtime,
                        
                    });
                    // console.log(favourite_events);  
                
               }
               
            }
            // console.log(favourite_events);
            return res.render('favourite',{
                favourite_events: favourite_events
            });
          });
        
    });

    router.get('/home/route',(req,res,next) =>{
        return res.render('route');
    });

    return router;
};