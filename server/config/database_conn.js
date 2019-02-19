const mysql = require('mysql');

    const con = mysql.createConnection({
        host: "localhost",
        user : "root",
        password:"",
        database: "hacknyu",
        port: 3306,
        //insecureAuth: false
    });

con.connect((err)=>{
    if(err) console.log(err);
    else console.log("Connected");
    
});

module.exports = con;