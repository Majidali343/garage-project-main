var mysql = require('mysql');

var connectDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: 'Majid@37406',
  database: 'garaga_management_system'
});
//local connection
 
connectDB.connect(function(err) {
  if (err) throw err;
  console.log("Database is Connected!");
});

module.exports= connectDB;