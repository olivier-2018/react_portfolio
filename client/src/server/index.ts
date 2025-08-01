import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.VITE_POSTGRES_USER,
  password: process.env.VITE_POSTGRES_PASSWORD,
  database: process.env.VITE_POSTGRES_DB,
  host: process.env.VITE_POSTGRES_HOST,
  port: process.env.VITE_POSTGRES_HOST_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

const app = express();
app.use(cors());
app.use(express.json());

// API Endpoints for projects
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

// API Endpoints for projects categories
app.get('/api/projects-categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint for skills
app.get('/api/skills', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint for skill categories
app.get('/api/skill-categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM skills');
    // Return as array of category strings
    res.json(result.rows.map(row => row.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint for customer feedbacks
app.get('/api/customer-feedbacks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer_feedbacks');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(7845, () => {
  console.log('API server running on port 7845');
});
