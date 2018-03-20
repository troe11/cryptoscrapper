var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var logger = require("morgan");

// Initialize Express
var app = express();

var db = require("./models");

var PORT = 3000;

app.use(logger("dev"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static("public"));
// If deployed, use the deployed database. Otherwise use the local 
// mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || ("mongodb://heroku_knmg5qnt:Aeris1169@ds117539.mlab.com:17539/heroku_knmg5qnt",{auth:{authdb:"admin"}});

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI)

app.get("/", function(req, res){
	axios.get("https://www.reddit.com/r/nfl/").then(function(response){
		var $ = cheerio.load(response.data);
		console.log($)
		// $("article h4").each(function(i, element){
		// 	var result = {};

		// 	result.title = $(this).children("a").text();
		// 	result.link = $(this).children("a").attr("href");

		// 	db.Article.create(result)
		// 	.then(function(dbArticle){
		// 		console.log(dbArticle);
		// 	})
		// 	.catch(function(err){
		// 		return res.json(err)
		// 	});
		// });
		res.send("Scrape complete")
	});
});


app.listen(PORT, function() {
	console.log("App running on port " + PORT + "!");
  });
  



