/*

This is the back-end logic for the RESTful services of a simple CRUD Api which has a MySQL back-end server.

Written by: Mostofa Adib Shakib
Language: Node.JS using Express

*/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var path = require('path');
var cors = require('cors');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors())

// mysql connection configuration

var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'node_js_api'
});

global.db = db;

// default routes

app.get('/', function(req, res){
        const query = "SELECT * FROM `users` ORDER BY id ASC";
        const result = db.query(query, function(err, result){
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: "Welcome to the home page! | View Developer"
                ,developer: result
        	});
    });
});

app.get("/add", function(req, res){
        res.render('add.ejs', {
            title: "Welcome to the home page! | Add a new Developer!"
            ,message: ''
        });
});

app.get("/edit/:id", function(req, res) {
        const devId = req.params.id;
        const query = "SELECT * FROM `users` WHERE id = '" + devId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit.ejs', {
                title: "Edit  Deveoper"
                ,developer: result[0]
                ,message: ''
            });
        });
});

app.get("/delete/:id'", function(req, res) {
        const developerId = req.params.id;
        const deconsteUserQuery = 'DELETE FROM users WHERE id = "' + developerId + '"';

        db.query(deconsteUserQuery, function(err, result) {
        	if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
});

app.post("/edit/:id", function(req, res) {
        const developerId = req.params.id;
        const name = req.body.name;
        const details = req.body.details;
        const age = req.body.age;
        const email = req.body.email;
        const position = req.body.position;

        const query = "UPDATE `users` SET `name` = '" + name + "', `details` = '" + details + "', `age` = '" + age + "', `email` = '" + email + "' WHERE `developer`.`id` = '" + developerId + "'";
        db.query(query, function (err, result) {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
});

app.post('/add', function (req, res) {
        const message = '';
        const name = req.body.name;
        const details = req.body.details;
        const age = req.body.age;
        const email = req.body.email;
        const position = req.body.position;

        const usernameQuery = "SELECT * FROM `users` WHERE name = '" + name + "'";

        db.query(usernameQuery, function (err, result){
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add.ejs', {
                    message,
                    title: "Welcome  | Add a new Developer"
                });
            }
            else {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the developer's detail to the database
                        const query = "INSERT INTO `users` (message, name, details, age, email, position) VALUES ('" +
                            message + "', '" + name + "', '" + details + "', '" + age + "', '" + email + "', '" + position + "')";
                        db.query(query, function(err, result){
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                }
        });
});

// Setting the application Locally at port 3000.

app.listen(3000, () => {
   console.log("The server is running successfully!");

   // connecting to database

	db.connect(function(err){
    	if (err) {
        	throw err;
    }
    	console.log('Connected to the MySQL database');
	});
});