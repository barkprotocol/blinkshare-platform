import express from 'express';

// Initialize the express app
const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Sample in-memory database for simplicity
let users = [];

// Route 1: Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route 2: Get all users
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

// Route 3: Get user by ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(user);
});

// Route 4: Create a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Email are required' });
  }

  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);

  res.status(201).json(newUser);
});

// Route 5: Update a user by ID
app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;

  res.status(200).json(user);
});

// Route 6: Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(userIndex, 1);

  res.status(200).json({ message: 'User deleted successfully' });
});

// Start the server and listen on port 3000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
