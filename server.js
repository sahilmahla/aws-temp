const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
const dbName = 'MyDBInstance2';

// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.RDS_ENDPOINT,
  user: 'admin',
  password: process.env.RDS_PASSWORD,
  database: dbName,
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create the table if it doesn't exist
connection.query(
  `CREATE TABLE IF NOT EXISTS information (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    info VARCHAR(255)
  )`,
  (error, results) => {
    if (error) {
      console.error('Error creating table:', error);
    } else {
      console.log('Table created successfully');
    }
  }
);

// Handle POST request to save data
app.post('/saveData', (req, res) => {
  const name = req.body.name;
  const id = req.body.id;

  const sql = 'INSERT INTO information (name, info) VALUES (?, ?)';
  connection.query(sql, [name, id], (err) => {
    if (err) throw err;
    res.send('Data saved successfully!');
  });
});

// Handle POST request to search data by id and retrieve name
app.post('/searchData', (req, res) => {
  const searchId = req.body.searchId;

  const sql = 'SELECT name FROM information WHERE info = ?';
  connection.query(sql, [searchId], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.send('No matching data found.');
    } else {
      res.send(`Name: ${results[0].name}`);
    }
  });
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
