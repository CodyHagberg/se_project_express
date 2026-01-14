# WTWR (What to Wear?): Back End
The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.
## Running the Project
`npm run start` — to launch the server 

`npm run dev` — to launch the server with the hot reload feature

### Testing
Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12

#### Technology
MongoDB — Database for storing users and clothing items
Express — Web framework for Node.js
Nodemon — Automatically restarts server during development
ESLint — Code linting and style checking
Postman — API testing

##### Description 
The WTWR back-end server stores and manages information for users and clothing items. It receives requests from the front-end application and responds with clothing suggestions based on temperature. Data is stored in a database rather than being hard-coded, allowing dynamic updates and scalability.
