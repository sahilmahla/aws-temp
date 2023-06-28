const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'mydbinstance.cuwgbs295spp.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: process.env.RDS_PASSWORD,
  database: 'your-database-name'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handle POST request to save data
app.post('/saveData', (req, res) => {
  const name = req.body.name;
  const id = req.body.id;

  const sql = 'INSERT INTO your_table_name (name, id) VALUES (?, ?)';
  connection.query(sql, [name, id], (err) => {
    if (err) throw err;
    res.send('Data saved successfully!');
  });
});

// Handle POST request to search data
app.post('/searchData', (req, res) => {
  const searchId = req.body.searchId;

  const sql = 'SELECT name FROM your_table_name WHERE id = ?';
  connection.query(sql, [searchId], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.send('No matching data found.');
    } else {
      res.send(`Name: ${results[0].name}`);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
