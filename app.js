const express = require('express');
const MustacheExpress = require('mustache-express');
const session = require('express-session');  // Include express-session
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');  // Ensure this path is correct

const app = express();
const port = 3000;

// Set up Mustache as the view engine
app.engine('mustache', MustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Body-parser middleware to handle form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(session({
    secret: 'your_secret_key',  // Replace 'your_secret_key' with a real secret key
    resave: false,
    saveUninitialized: false,  // Change to true if you want the session to be saved even if unmodified
    cookie: { secure: false }  // Set to true if you're on HTTPS
}));

// Routes
app.use('/', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



