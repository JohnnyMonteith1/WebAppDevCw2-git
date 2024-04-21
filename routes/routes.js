const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers'); // Make sure the path is correct

// Middleware for checking if the user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Middleware for checking user roles
function checkRole(roles) {
    return function(req, res, next) {
        if (req.session.user && roles.includes(req.session.user.role)) {
            next();
        } else {
            res.status(403).send("Access denied");
        }
    };
}

// Setting up routes
router.get('/', controllers.homePage);                     // Home page route
router.get('/about', controllers.aboutPage);               // About page route
router.get('/contactUs', controllers.contactUsPage);   // Contact Us page route
router.post('/submit-contact', controllers.submitContact); // Contact form submission route
router.get('/logout', controllers.logoutUser);

// user specific routes

router.get('/userContactUs', controllers.userContactUsPage);
router.get('/userAbout', controllers.userAboutPage);

// Pantry specific routes

router.get('/pantryContactUs', controllers.pantryContactUsPage);
router.get('/pantryAbout', controllers.pantryAboutPage);

// Admin specific routes
router.get('/adminHome', isAuthenticated, checkRole('admin'), controllers.adminHomePage); // Ensures only logged-in users can add items
router.get('/adminContactUs', controllers.adminContactUsPage);
router.get('/adminAbout', controllers.adminAboutPage);
router.get('/adminAddItems', isAuthenticated, checkRole('admin'), controllers.adminAddItemForm); // Ensures only logged-in users can add items
router.post('/adminAddItems', isAuthenticated, checkRole('admin'), controllers.adminPostItem);   // Handle the posting of an item with role check
router.get('/admin', isAuthenticated, checkRole('admin'), controllers.adminPage); // Admin dashboard access
router.get('/adminItems', isAuthenticated, checkRole('admin'), controllers.adminViewItemsUnselected);
router.post('/admin-select-item/:itemId', isAuthenticated, checkRole('admin'), controllers.adminSelectItem); // Route for selecting an item
router.get('/adminAddUser', isAuthenticated, checkRole('admin'), controllers.adminAddUserPage);
router.post('/adminAddUser', isAuthenticated, checkRole('admin'), controllers.addUser);
router.get('/adminDeleteUser', isAuthenticated, checkRole('admin'), controllers.adminDeleteUserPage); // Render the delete user page
router.post('/adminDeleteUser/:userId', isAuthenticated, checkRole('admin'), controllers.deleteUser); // Handle user deletion


// User registration and login routes
router.get('/register', (req, res) => res.render('register', { title: 'Register' }));
router.post('/register', controllers.registerUser);
router.get('/login', (req, res) => res.render('login', { title: 'Login' }));
router.post('/login', controllers.loginUser);
router.get('/userHome', isAuthenticated, checkRole('user'), controllers.userHomePage);
router.get('/pantryHome', isAuthenticated, checkRole('pantry'), controllers.pantryHomePage);
router.post('/select-item/:itemId', isAuthenticated, checkRole(['admin', 'pantry']), controllers.selectItem); // Route for selecting an item
router.post('/remove-selected-item/itemId', isAuthenticated, checkRole(['admin', 'pantry']), controllers.removeSelectedItem);


// Item management routes
router.get('/addItem', isAuthenticated, checkRole('user'), controllers.addItemForm); // Ensures only logged-in users can add items
router.post('/addItem', isAuthenticated, checkRole('user'), controllers.postItem);   // Handle the posting of an item with role check
router.get('/items', isAuthenticated, checkRole(['admin', 'pantry']), controllers.viewItemsUnselected);

module.exports = router;








