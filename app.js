//Eros Di Pede

//import express module
const express = require('express');
//imports http module
const http = require('http');
//parsing middleware
var bodyParser = require('body-parser');
//database 
var MongoClient = require('mongodb').MongoClient;
//line reader used to parse xml
var lineReader = require('line-reader');
//path for database
const DB_PATH = 'mongodb://localhost:27017/recipeDB';
//starts express server
const server = express();

server.use(bodyParser.text());

//handles all requests
//also prints out request information
server.use((req, res, next) =>{
	console.log('\n============================');
	console.log("PATHNAME: " + req.path);
	console.log("METHOD: " + req.method);
	console.log("REQUEST: " + __dirname + req.path);
	
	//next middleware
	next();	
	
});

//loads static files
server.use(express.static(__dirname, {
	index: 'recipes.html'
}));

//handles get recipes request from client
server.post("/getrecipes", (req,res)=>{
	console.log("REQUEST: " + req.body)
	MongoClient.connect(DB_PATH, (err,db) =>{
		//if cannot connect, print error
		if (err) console.log("Unable to connect to MongoDB: ",err);
		else{
			//print connected
			console.log("Connected to MongoDB");
			//specifys the collection needed
			var collection = db.collection('recipes');
			var searchParamsArr = req.body.split(",");
			var searchParamsStr = "";
			//formates the received search for the find function
			//by default, $search will search the collection using the OR operator,
			//this format searches the collection using the AND operator
			for (var i = 0; i < searchParamsArr.length; i++){
				searchParamsStr += '\"' + searchParamsArr[i] + '\" ';
			}
			//removes blank space from both sides of the string
			searchParamsStr = searchParamsStr.trim(" ");
			console.log(searchParamsStr);
			//searches for parameters
			//creates index for searching
			db.collection('recipes').createIndex( { ingredients: "text"} )
			//searches collection recipes for searchParams
			db.collection('recipes').find({$text: { $search: searchParamsStr }}).toArray(function(err, result) {
				if (err) throw err;
				db.close();
				res.writeHead(200);
				res.end(JSON.stringify(result));
			});
		}
	});
});

server.listen(3000, () =>{
	console.log("Server running at http://localhost:3000/recipes");
});

//FILE PARSING CODE
function isOpeningTag(input){
	return input.startsWith("<") && !input.startsWith("</");
}
function isClosingTag(input){
	return input.startsWith("</");
}

//modules that reads each line in a provided fileC
var openingTag = "";
var data = "";
var recipeObject = {};
var recipes = [];
//reads each line in the provided file (xml file)
lineReader.eachLine("aLaCarteData_rev3.xml",(line,last) =>{
	//removes spaces from line
	line = line.trim();
	//checks if the line is an opening tag and clears the data var
	if (isOpeningTag(line)){
		data = "";
	}
	//checks if the line is a closing tag
	else if (isClosingTag(line)){
		//checks for certain tags 
		if (line == "</recipe>"){
			recipes.push(recipeObject);
			recipeObject = {};	
		}
		else if (line == "</recipe_name>")
			recipeObject.recipeName = data;
		else if (line == "</category>")
			recipeObject.category = data;
		else if (line == "</ingredients>")
			recipeObject.ingredients = data;
		else if (line == "</spices>")
			recipeObject.spices = data;
		else if (line == "</description>")
			recipeObject.description = data;
		else if (line == "</rating>")
			recipeObject.rating = data;
		else if (line == "</directions>")
			recipeObject.directions = data;
	}
	//if not a tag, add line to data var
	else{
		data += " " + line;
	}
	
	//checks if at the last line
	if (last){
		//connects to mongo database
		MongoClient.connect(DB_PATH, (err,db) =>{
			//if cannot connect, print error
			if (err) console.log("Unable to connect to MongoDB: ",err);
			else{
				//print connected
				console.log("Connected to MongoDB");
				//specifys the collection needed
				var collection = db.collection('recipes');
				//clears the collection
				collection.remove()
				//adds each recipe
				recipes.forEach( (item) =>{
					collection.insert({
						 recipeName : item.recipeName,
						 ingredients : item.ingredients,
						 spices : item.spices,
						 category : item.category,
						 description : item.description,
						 rating : item.rating,
						 directions : item.directions
					}); 
				});
				db.close();
			}
		});
	}
});