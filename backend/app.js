const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const dbConfig = {
    host: 'localhost',         // Change if your MySQL server is hosted elsewhere
    user: 'root',
    password: 'Chetna@07',
    database: 'crud_db'
};

let connection;

async function connectDB() {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL Database.');
    } catch (err) {
        console.error('Error connecting to DB:', err);
    }
}

connectDB();

// Routes

// Get all users
app.get('/users', async (req, res) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        await connection.execute('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
        res.json({ message: 'User created successfully.' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Update user
app.put('/users/:id', async (req, res) => {
    try {
        const { name, email } = req.body;
        const { id } = req.params;
        await connection.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
        res.json({ message: 'User updated successfully.' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await connection.execute('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully.' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
