const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'weezyFbaby0',
  port: 5432
});

app.get('/tasks', async (req, res) => {
  const { instanceid } = req.query; // Extract instanceid from query parameters
  try {
    const query = instanceid 
      ? 'SELECT * FROM tasks WHERE instanceid = $1' 
      : 'SELECT * FROM tasks';
    const params = instanceid ? [instanceid] : [];
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/instances', async (req, res) => {
  try {
    const result = await pool.query('SELECT instanceid, name FROM instances');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching instances', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
