const Datastore = require('nedb');
const path = require('path');

const db = {
    contacts: new Datastore({ filename: path.join(__dirname, 'contact.db'), autoload: true })
};

const users = new Datastore({ filename: path.join(__dirname, 'users.db'), autoload: true });
db.users = users;

const items = new Datastore({ filename: path.join(__dirname, 'items.db'), autoload: true });
db.items = items;

module.exports = db;
