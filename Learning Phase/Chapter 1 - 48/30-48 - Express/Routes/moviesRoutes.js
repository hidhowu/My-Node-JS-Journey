const express = require('express');
const moviesController = require('../Controllers/moviesController')

// creating a custom router as a middleware for movies routes
// this allows us to handle requests for the movies resource in a separate file
const router = express.Router();

// activating the param middleware to check if the movie exists before processing the request
// this will be called before the route handler for the specific route parameter
router.param('id', moviesController.checkID);

router.route("/")
    .get(moviesController.getMovies)
    .post(moviesController.validateMovie, moviesController.createMovie)
    .delete(moviesController.deleteMovie);

router.route("/:id")
    .get(moviesController.getMovieById)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie);


// exporting the router so that it can be used in the app.js file
module.exports = router;