//Developed by: Eros Di Pede 
var recipes = [];

var login = () =>{
	var username = prompt("Please enter your username");
	var pass = prompt("Please enter your password")
	
	if (username != "user")
		login();
	if (pass != "pass")
		login();
}

var handleSubmitButton = ()=>{
	//gets the users input
	var ingredients = document.getElementById("searchBox").value;
	console.log(ingredients);
	//clears the input box
	document.getElementById("searchBox").value = "";
	//sends post request to server
	var request = new XMLHttpRequest();
	request.open("POST","/getrecipes",true);
	request.send(ingredients);
	
	request.onreadystatechange = () =>{
		//hecks if the request has responded
		if (request.readyState == XMLHttpRequest.DONE && request.status === 200){
			//clears dom
			document.getElementById("recipes").innerHTML = "";
			//parses recipes received from search
			recipes = JSON.parse(request.responseText);
			//loops through the recipes
			for (var i = 0; i < (recipes).length; i++){	
				//creates a hyperlink element and sets its properties
				var hyperlink = document.createElement('a');
				hyperlink.textContent = recipes[i].recipeName;
				hyperlink.id = i;
				hyperlink.href = "#"
				hyperlink.setAttribute("onclick", "createFoodPage(this);");
				//appends the hyper link to the dom
				document.getElementById("recipes").appendChild(hyperlink);
				//adds a linebreak
				var lineBR = document.createElement('br');
				document.getElementById("recipes").appendChild(lineBR);
			}
			//if theres no responses, tell the user
			if ((JSON.parse(request.responseText)).length == 0){
				var norecipes = document.createElement("h2");
				norecipes.textContent = "NO RECIPES FOUND";
				document.getElementById("recipes").appendChild( norecipes );
			}
		}
	}
}
	
//creates the page for a specific recipe
var createFoodPage = (elm)=>{
	//opens a new tab
	var foodPage = window.open('food.html');
	//when the page loads, fill it with elements
	foodPage.onload = () =>{
		//title of page
		var title = foodPage.document.createElement("h1");
		title.textContent = recipes[elm.id].recipeName;
		//description of recipes
		var description = foodPage.document.createElement("p");
		description.textContent = recipes[elm.id].description;
		//header for ingredients
		var ingredientsHeader = foodPage.document.createElement("h2");
		ingredientsHeader.textContent = "INGREDIENTS";
		//list of ingredients
		var ingredientsElement = foodPage.document.createElement("p");
		ingredientsElement.textContent = recipes[elm.id].ingredients;	
		//header for directions
		var directionsHeader = foodPage.document.createElement("h2");
		directionsHeader.textContent = "DIRECTIONS";
		//directions
		var directions = foodPage.document.createElement("p");
		directions.textContent = recipes[elm.id].directions;
		
		//adds all the elements to the page
		foodPage.document.getElementById("food-item").appendChild( title );
		foodPage.document.getElementById("food-item").appendChild( description );
		foodPage.document.getElementById("food-item").appendChild( ingredientsHeader );
		foodPage.document.getElementById("food-item").appendChild( ingredientsElement );
		foodPage.document.getElementById("food-item").appendChild( directionsHeader );
		foodPage.document.getElementById("food-item").appendChild( directions );
		
	};
	
}

var handleKeyPress = (e)=>{
	if ((e.which == 13) || (e.keycode == 13)) handleSubmitButton();
}