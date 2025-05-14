const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = 5000;


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todos',
  password: '0415',
  port: 5432,
});


app.use(cors());
app.use(express.json());

app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});


app.post('/todos', async (req, res) => {
  const { id, text, completed, createdAt, scheduledAt, priority, name } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tasks (id, text, completed, created_at, scheduled_at, priority, name)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, text, completed, createdAt, scheduledAt, priority, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding todo:', err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});


app.put('/todos/:id', async (req, res) => {
  const { text, completed, priority, name, scheduledAt } = req.body;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE tasks
       SET text = $1, completed = $2, priority = $3, name = $4, scheduled_at = $5
       WHERE id = $6
       RETURNING *`,
      [text, completed, priority, name, scheduledAt, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});


app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
