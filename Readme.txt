Title of Application: Cooking Central
Writen and Developed by: Eros Di Pede
OS Developed in: Windows 10
Browser Tested in: Google Chrome

Purpose:
	To allow users to search recipes given their ingredients

How to run:
	Install mongodb at: https://www.mongodb.com/download-center?jmp=nav#atlas into the project folder
	Launch a command prompt and navigate the directorys in the following order:
		[projectfolder] > mongodb > Server > 3.4 > bin
	Then type this command into the prompt: mongod.exe -dbpath [PATH]
	Where [PATH] is, is the path of the data\db directory is, located in the project folder
	Once this is done, launch a new command prompt and navigate to the directory holding the server. 
	Before launching the server, type npm install to install all modules used
	Once located, in the command prompt type: node app.js
	Open a chrome browser tab and type: localhost:3000/recipes
	To login, enter the username: "user" and enter the password: "pass"
	Once logged in, enter ingredients or spices to find search results!