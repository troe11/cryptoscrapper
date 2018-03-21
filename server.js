var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var logger = require("morgan");

// Initialize Express
var app = express();

var db = require("./models");

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static("public"));
// If deployed, use the deployed database. Otherwise use the local 
// mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || ("mongodb://heroku_knmg5qnt:Aeris1169@ds117539.mlab.com:17539/heroku_knmg5qnt");

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI)

app.get("/scrape", function(req, res){
	axios.get("https://www.ccn.com/").then(function(response){
		var $ = cheerio.load(response.data);
		
		$("article header h4").each(function(i, element){
			var result = {};

			result.title = $(this).children("a").text();
			result.link = $(this).children("a").attr("href");

			db.Article.create(result)
			.then(function(dbArticle){
				console.log(dbArticle);
			})
			.catch(function(err){
				return res.json(err)
			});
		});
		res.send("Scrape complete")
	});
});

app.get("/articles", function(req,res){
	db.Article.find({})
	.then(function(result){
		res.json(result);
	})
	.catch(function(err) {
		// If an error occurred, send it to the client
		res.json(err);
	  });
});

app.post("/articles/:id", function(req,res){
	db.Article.update({
		_id:req.params.id
	},
	{
		comment:req.body.comment
	}).then(function(data){
		res.json(data)
	})
})

app.listen(process.env.PORT || 3000, function(){
	console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  



