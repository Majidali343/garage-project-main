var mysql = require('mysql');

var connectDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: '',
  database: 'garage'
});
//local connection
 
connectDB.connect(function(err) {
  if (err) throw err;
  console.log("Database is Connected!");
});

module.exports= connectDB;