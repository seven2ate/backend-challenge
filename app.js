const express = require('express');
const cors = require('cors');
const organizationRouter = require('./src/routes/organizationRoutes');
const userRouter = require('./src/routes/userRoutes');
const db = require('./db/connect');

const app = express();
const PORT = process.env.PORT || 8080;

// middleware setup
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON request bodies

// Route handlers setup
app.use('/api/organizations', organizationRouter);
app.use('/api/users', userRouter);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
  });
});

module.exports = app;
