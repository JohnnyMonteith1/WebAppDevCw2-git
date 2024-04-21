const db = require('../models/db');
const bcrypt = require('bcryptjs');

module.exports = {
    homePage: (req, res) => {
        res.render('index', { title: 'Home' });
    },
    userHomePage: (req, res) => {
        res.render('userHome', { title: 'User Home Page' }); // Render user home page
    },
    
    pantryHomePage: (req, res) => {
        res.render('pantryHome', { title: 'Pantry Home Page' }); // Render pantry home page
    },
    adminHomePage: (req, res) => {
        res.render('adminHome', { title: 'Pantry Home Page' }); // Render pantry home page
    },
    aboutPage: (req, res) => {
        res.render('about', { title: 'About Us' });
    },
    userAboutPage: (req, res) => {
        res.render('userAbout', { title: 'About Us' });
    },
    pantryAboutPage: (req, res) => {
        res.render('pantryAbout', { title: 'About Us' });
    },
    adminAboutPage: (req, res) => {
        res.render('adminAbout', { title: 'About Us' });
    },
    contactUsPage: (req, res) => {
        res.render('contactUs', {title: 'Contact Us'});
    },
    userContactUsPage: (req, res) => {
        res.render('userContactUs', {title: 'Contact Us'});
    },
    pantryContactUsPage: (req, res) => {
        res.render('pantryContactUs', {title: 'Contact Us'});
    },
    adminContactUsPage: (req, res) => {
        res.render('adminContactUs', {title: 'Contact Us'});
    },
    adminAddUserPage: (req, res) => {
        res.render('adminAddUser', {title: 'Add User'});
    },
    adminDeleteUserPage: (req, res) => {
        db.users.find({}, (err, users) => {
            if (err) {
                res.status(500).send("Error retrieving users.");
            } else {
                res.render('adminDeleteUser', { title: 'Delete Users', users });
            }
        });
    },
    submitContact: (req, res) => {
        const { name, email, message } = req.body;
        const role = req.session.user ? req.session.user.role : null; // Check if user session exists
    
        db.contacts.insert({ name, email, message, submittedAt: new Date() }, (err, newDoc) => {
            if (err) {
                return res.status(500).send("Failed to save contact information.");
            }
    
            let redirectUrl;
            switch (role) {
                case 'user':
                    redirectUrl = '/userContactUs';
                    break;
                case 'pantry':
                    redirectUrl = '/pantryContactUs';
                    break;
                case 'admin':
                    redirectUrl = '/adminContactUs';
                    break;
                default:
                    redirectUrl = '/contactUs'; // Default redirection
            }
            
            res.redirect(redirectUrl);
        });
    },
    
    registerUser: (req, res) => {
        const { username, password, role } = req.body;
        db.users.insert({ username, password, role }, (err, doc) => {
            if (err) res.status(500).send("Error registering user.");
            else res.redirect('/login');
        });
    },
    loginUser: (req, res) => {
        const { username, password } = req.body;
        db.users.findOne({ username, password }, (err, user) => {
            if (user) {
                req.session.user = user;  // Save user data to session
                // Redirect based on user role
                if (user.role === 'admin') {
                    res.redirect('adminHome');
                } else if (user.role === 'user') {
                    res.redirect('userHome'); // Redirect to user home page
                } else if (user.role === 'pantry') {
                    res.redirect('pantryHome'); // Redirect to pantry home page
                }
            } else {
                res.status(401).send("Username or password incorrect");
            }
        });
    },
    logoutUser: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                res.status(500).send("Error logging out.");
            } else {
                res.redirect('/');
            }
        });
    },
    addItemForm: (req, res) => {
        if (req.session.user && req.session.user.role === 'user') {
            res.render('addItem', { title: 'Add Food Item' });
        } else {
            res.status(403).send("Unauthorized access");
        }
    },
    adminAddItemForm: (req, res) => {
        if (req.session.user && req.session.user.role === 'admin') {
            res.render('adminAddItem', { title: 'Add Food Item' });
        } else {
            res.status(403).send("Unauthorized access");
        }
    },
    postItem: (req, res) => {
        const { donatedBy, foodType, quantity, expirationDate } = req.body;
        db.items.insert({
            donatedBy,
            foodType,
            quantity,
            expirationDate: new Date(expirationDate),
            selectedBy: null,
            collectionDate: null
        }, (err, doc) => {
            if (err) res.status(500).send("Error posting item.");
            else res.redirect('/userHome');
        });
    },
    adminPostItem: (req, res) => {
        const { donatedBy, foodType, quantity, expirationDate } = req.body;
        db.items.insert({
            donatedBy,
            foodType,
            quantity,
            expirationDate: new Date(expirationDate),
            selectedBy: null,
            collectionDate: null
        }, (err, doc) => {
            if (err) res.status(500).send("Error posting item.");
            else res.redirect('/adminHome');
        });
    },
    /* viewItems: (req, res) => {
        const today = new Date();
        db.items.find({ expirationDate: { $gte: today } }, (err, items) => {
            if (err) res.status(500).send("Error retrieving items.");
            else {
                items.forEach(item => {
                    item.expirationDate = item.expirationDate.toISOString().split('T')[0];
                });
                res.render('items', { items });
            }
        });
    },
    adminViewItems: (req, res) => {
        const today = new Date();
        db.items.find({ expirationDate: { $gte: today } }, (err, items) => {
            if (err) res.status(500).send("Error retrieving items.");
            else {
                items.forEach(item => {
                    item.expirationDate = item.expirationDate.toISOString().split('T')[0];
                });
                res.render('adminItems', { items });
            }
        });
    },*/
    viewItemsUnselected: (req, res) => {
        const today = new Date();
        db.items.find({ $and: [{ expirationDate: { $gte: today }, selectedBy: null, collectionDate: null }] }, (err, items) => {
            if (err) res.status(500).send("Error retrieving items.");
            else {
                items.forEach(item => {
                    item.expirationDate = item.expirationDate.toISOString().split('T')[0];
                });
                res.render('items', { items });
            }
        });
    },
    adminViewItemsUnselected: (req, res) => {
        const today = new Date();
        db.items.find({ $and: [{ expirationDate: { $gte: today }, selectedBy: null, collectionDate: null }] }, (err, items) => {
            if (err) res.status(500).send("Error retrieving items.");
            else {
                items.forEach(item => {
                    item.expirationDate = item.expirationDate.toISOString().split('T')[0];
                });
                res.render('adminItems', { items });
            }
        });
    },
    selectItem: (req, res) => {
        const itemId = req.params.itemId;
        const selectedBy = req.session.user.username;
        const collectionDate = new Date();
    
        db.items.update(
            { _id: itemId, selectedBy: null }, // Query criteria
            { $set: { selectedBy, collectionDate } }, // Update fields
            { multi: false }, // Update only one document
            (err, numAffected) => { // Callback function
                if (err) {
                    return res.status(500).send("Error selecting item.");
                }
                if (numAffected === 0) {
                    return res.status(400).send("Item is already selected.");
                }
                res.redirect('/items'); // Redirect to the items page after selecting the item
            }
        );
    },
    adminSelectItem: (req, res) => {
        const itemId = req.params.itemId;
        const selectedBy = req.session.user.username;
        const collectionDate = new Date();
    
        db.items.update(
            { _id: itemId, selectedBy: null }, // Query criteria
            { $set: { selectedBy, collectionDate } }, // Update fields
            { multi: false }, // Update only one document
            (err, numAffected) => { // Callback function
                if (err) {
                    return res.status(500).send("Error selecting item.");
                }
                if (numAffected === 0) {
                    return res.status(400).send("Item is already selected.");
                }
                res.redirect('/adminItems'); // Redirect to the items page after selecting the item
            }
        );
    },
    removeSelectedItem: (req, res) => {
        const itemId = req.params.itemId;
    
        db.items.updateOne(
            { _id: itemId, selectedBy: { $ne: null } }, // Ensure the item is already selected
            { $set: { selectedBy: null, collectionDate: null } }, // Clear the selectedBy and collectionDate fields
            (err, result) => {
                if (err) {
                    return res.status(500).send("Error removing selected item.");
                }
                if (result.modifiedCount === 0) {
                    return res.status(400).send("Item is not currently selected.");
                }
                res.redirect('/items'); // Redirect to the items page after removing the selection
            }
        );
    },
    adminPage: (req, res) => {
        if (req.session.user && req.session.user.role === 'admin') {
            res.render('admin', { title: 'Admin Dashboard' });
        } else {
            res.status(403).send("Unauthorized access");
        }
    },
    addUser: (req, res) => {
        const { username, email, password, role } = req.body;

        // Add user to the database
        db.users.insert({ username, email, password, role }, (err, newUser) => {
            if (err) {
                return res.status(500).send("Failed to add user.");
            }
            res.redirect('/adminAddUser'); // Redirect to admin page after adding the user
        });
    },
    deleteUser: (req, res) => {
        if (req.session.user && req.session.user.role === 'admin') {
            const userId = req.params.userId; // Assuming the user ID is passed in the URL
            db.users.remove({ _id: userId }, {}, (err, numRemoved) => {
                if (err) {
                    res.status(500).send("Failed to delete user.");
                } else {
                    res.redirect('/adminDeleteUser');
                }
            });
        } else {
            res.status(403).send("Unauthorized access");
        }
    }
    


   /*  deleteUser: (req, res) => {
        if (req.session.user && req.session.user.role === 'admin') {
            const { userId } = req.body;
            db.users.remove({ _id: userId }, {}, (err, numRemoved) => {
                if (err) res.status(500).send("Failed to delete user.");
                else res.redirect('/admin');
            });
        } else {
            res.status(403).send("Unauthorized access");
        }
    } */
    
};