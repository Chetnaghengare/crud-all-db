const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const dbURI = 'mongodb+srv://chetnaghengare:chetna@tuneminders.clbgans.mongodb.net/tuneminders?retryWrites=true&w=majority'; 
// ^ Added '/tuneminders' at the end to explicitly select your database

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB Database.');
})
.catch((err) => {
    console.error('Error connecting to DB:', err);
});

// MongoDB Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Routes

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = new User({ name, email });
        await newUser.save();
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
        await User.findByIdAndUpdate(id, { name, email }, { new: true });
        res.json({ message: 'User updated successfully.' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully.' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
