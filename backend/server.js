const express = require('express');
const cors = require('cors');
const cassandra = require('cassandra-driver');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Cassandra connection
const SECURE_CONNECT_BUNDLE_PATH = path.join(__dirname, 'secure-connect-users.zip'); 
// Replace 'yourzipname' with your extracted secure bundle folder name

const client = new cassandra.Client({
    cloud: {
        secureConnectBundle: SECURE_CONNECT_BUNDLE_PATH,
    },
    credentials: {
        username: 'EhvwnEuqlGAlBpGXvfbbYhSi',     // replace with your Client ID
        password: 'PC9jwF-AkIAjZo0Pv.lRIacwB,+E-ZOOZqluu9X.a7cdIe+rxuPcCThGoWcONrv2,p7tUEpjf0oMK+p-4QcWvUaCFAffqKeGSAp067JJM9xLIKDv9e72RkMTem8U6BFA'  // replace with your Client Secret
    },
    keyspace: 'cse'       // replace with your Keyspace
});

client.connect()
    .then(() => console.log('Connected to Cassandra Database'))
    .catch(err => console.error('Error connecting to DB:', err));

// Routes

// Get all users
app.get('/users', async (req, res) => {
    const query = 'SELECT * FROM users'; // assuming table name is users
    try {
        const result = await client.execute(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Create a new user
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    const id = cassandra.types.Uuid.random(); // create a random UUID for the new user

    const query = 'INSERT INTO users (id, name, email) VALUES (?, ?, ?)';
    try {
        await client.execute(query, [id, name, email], { prepare: true });
        res.json({ message: 'User created successfully.' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Update user
app.put('/users/:id', async (req, res) => {
    const { name, email } = req.body;
    const { id } = req.params;

    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    try {
        await client.execute(query, [name, email, cassandra.types.Uuid.fromString(id)], { prepare: true });
        res.json({ message: 'User updated successfully.' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM users WHERE id = ?';
    try {
        await client.execute(query, [cassandra.types.Uuid.fromString(id)], { prepare: true });
        res.json({ message: 'User deleted successfully.' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
