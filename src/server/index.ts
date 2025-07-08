import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';

const pool = new Pool({
  user: 'portfolio',
  password: 'your_password',
  host: 'localhost',
  port: 5432,
  database: 'portfolio_db'
});

const app = express();
app.use(cors());
app.use(express.json());

// Endpoints for projects and skills
app.get('/api/projects', async (req, res) => {
  const { category } = req.query;
  try {
    const query = category 
      ? 'SELECT * FROM projects WHERE category_id = $1'
      : 'SELECT * FROM projects';
    const result = await pool.query(query, category ? [category] : []);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log('API server running on port 3001');
});
