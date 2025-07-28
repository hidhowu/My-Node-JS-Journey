const express = require('express');
const moviesRouter = require('./Routes/moviesRoutes');
const Movie = require('./Model/movieModel')
// const fs = require('fs');
const morgan = require('morgan'); // third party middleware for logging requests
// LESSON 30 : Setting up Express JS

const app = express();
app.use(express.json()); // Middleware to parse JSON request body

app.use(express.static('./public')); // Middleware to serve static files from the public directory

// const logger = (req, res, next) => {
//     console.log(`${req.method} request for '${req.url}'`);

//     // next() is used to pass control to the next middleware function
//     next();
// }
// Using Custom Middleware
// app.use(logger)


// Using third party middleware
app.use(morgan('dev')); // 'dev' is a predefined format for logging requests
// a middleware should not have () because it is a function that takes three arguments (req, res, next)
//  but if a middleware has () then it is a function that returns a middleware function

// Recieving a get request
// GET - /resource

// app.get('/', (req, res) => {
//     // sending response as text/html
//     // res.status(200).send('server is working...');

//     // sending response as json
//     res.status(200).json({
//         name: "Joshua",
//         age: "27"
//     });

// })


// LESSON 34: Processing our first API request

// const movies = JSON.parse(fs.readFileSync('./files/movies.json', 'utf-8'));

// const getAllMovies = (req, res) => {
//     // Using JSEND JSON FORMAT as our response format
//     res.status(200).json({
//         status: 'success',
//         results: movies.length,
//         data: {
//             movies
//         }
//     });
// }




// GET - /api/v1/movies
// app.get('/api/v1/movies', getAllMovies)

// LESSON 35: Adding a POST request to our API
// POST - /api/v1/movies
// app.post('/api/v1/movies', createMovie)

// LESSON 36: Processing a GET request with a route parameter
// GET - /api/v1/movies/:id
// app.get('/api/v1/movies/:id', getMovieById);

// LESSON 37: Processing a PATCH request with a route parameter
// PATCH - /api/v1/movies/:id
// app.patch('/api/v1/movies/:id', updateMovie)

// LESSON 38: Processing a DELETE request with a route parameter
// DELETE - /api/v1/movies/:id
// app.delete('/api/v1/movies/:id', deleteMovie)



// we can also use a route to chain the routes together
// app.route('/api/v1/movies')
//     .get(getAllMovies)
//     .post(createMovie);

// app.route('/api/v1/movies/:id')
//     .get(getMovieById)
//     .patch(updateMovie)
//     .delete(deleteMovie);




// LESSON 42: USING A CUSTOM ROUTER

// we can define a custom router for our api routes rather then using the app.get... we can have a seperate router for each resource e.g. movies, users, etc.
// This also allow us to be able to move our routes to a different file and import it here

// creating a movies router
// const moviesRouter = express.Router(); // this movies router is also a middleware that can be use to handle requests and we can use middleware by calling it on the app.use() method

// defining the routes for the movies router
app.use('/api/v1/movies', moviesRouter);

// from above we can see that we can define a specific midleware for a specific route or resource path
// the movies router will handle all requests that start with /api/v1/movies 

// defining the routes for the movies router
// moviesRouter
//     .route('/')
//     .get(getAllMovies)
//     .post(createMovie);

// you can see that we didnt enter the full path here because we have already defined the path in the app.use() method above and when a request to that path is made the path is app.use will be appended to the path defined in the moviesRouter resulting in the full path being /api/v1/movies/



// moviesRouter
//     .route('/:id')
//     .get(getMovieById)
//     .patch(updateMovie)
//     .delete(deleteMovie);

// we can also use the moviesRouter to handle requests that start with /api/v1/movies/:id
// the full appended path will be /api/v1/movies/:id




// LESSON 43: Creating custom modules for each routes following mvc architecture
// we hae moved our moviesRouter to a separate file called moviesRoutes.js and we have also moved our controllers to a separate file called moviesController.js


// LESSON 44: Creating a param middleware
// A param middleware is a middleware that is used to handle route parameters
// we can define a param middleware that will be called before the route handler for a specific route parameter
// A param middleware takes four arguments (req, res, next, value) where value is the value of the route parameter e.g. if the route is /api/v1/movies/:id then the value will be the id of the movie
// we have defined it in our moviesController.js file and called it in our moviesRouter.js file

// LESSON 45: Chaining multiple middlewares
// we can chain multiple middlewares together to handle a request
// implementation of this is done in the moviesController.js file and called in the moviesRouter.js file


// LESSON 46: Serving static files
// we can serve static files using the express.static() middleware



// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// })

// app.get('/home', (req, res) => {

//     const content = fs.readFile('./public/index1.html', 'utf-8', (err, data) => {

//         if (!data) return res.status(404).send('File not found (Error 404)');
//         res.status(200).send(data);
//     });


// })


// LESSON 47 - 48: Setting up Environment Variables
// Environment variables are used to store sensitive information such as database connection strings, API keys, etc
module.exports = app

