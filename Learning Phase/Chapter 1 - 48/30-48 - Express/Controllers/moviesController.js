const { query } = require('express');
const Movie = require('../Model/movieModel')
const fs = require('fs');

const movies = JSON.parse(fs.readFileSync('./Files/movies.json', 'utf-8'));

// since we have many methods in the movieControllers.js file, we can export them as an object
// this allows us to use the methods in the movieControllers.js file in the moviesRouter.js
const moviesController = {};

moviesController.validateMovie = (req, res, next) => {
    const body = req.body;
    if (!body.title || !body.year) {
        return res.status(400).json({
            status: 'failed',
            message: 'Invalid Request'
        });
    }
    next();
}

moviesController.checkID = async (req, res, next, value) => {
    const id = Number(value);
    // console.log(req.params, id);

    // finding the movie with the id
    const movie = movies.find(movie => movie.id === id);

    // if the movie is not found, we return a 404 error
    if (!movie) {
        return res.status(404).json({ status: 'fail', message: 'Movie not found' });
    }

    next();
}
// rather than a middleware we could have also done it as a function but we are using a middleware because we want all our function in express to be a middleware


// the middleware below doesnt have next as third argument because there is no need for it to call the next function as it is the last function in the request - response cycle
moviesController.getMovies = (req, res) => {
    // Using JSEND JSON FORMAT as our response format
    res.status(200).json({
        status: 'success',
        results: movies.length,
        data: {
            movies
        }
    });
}

moviesController.createMovie = (req, res) => {

    // We cant use req.body directly because we have not set up a middleware to parse the request body 
    // so we have to use express.json() middleware to parse the request body

    // const newMovie = req.body;

    // creating an id for the new movie
    // newMovie.id = movies[movies.length - 1].id + 1;
    // we can also use object.assign() to merge the new id and the body together 
    newMovie = Object.assign({ id: movies[movies.length - 1].id + 1 }, req.body);

    // pushing the new movie to the movies array
    movies.push(newMovie);

    // updating the movies.json file with the new movies array
    fs.writeFile('./files/movies.json', JSON.stringify(movies), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                movie: newMovie
            }
        });
    })
}

moviesController.getMovieById = (req, res) => {
    // params object contains the route parameters
    // all route parameters are stored as strings so you have to convert them to numbers if you want to use them as numbers
    // we can also have multiple route parameters like /api/v1/movies/:id/:name/:duration
    // we can also make a route parameter optional by using a question mark like /api/v1/movies/:id?

    // converting the id to a number using Number() function or by arithmetic operation like +req.params.id
    // const id = +req.params.id; // this will convert the string to a number

    const id = Number(req.params.id);
    // console.log(req.params, id);

    // finding the movie with the id
    const movie = movies.find(movie => movie.id === id);

    // // if the movie is not found, we return a 404 error
    // if (!movie) {
    //     return res.status(404).json({ status: 'fail', message: 'Movie not found' });
    // }

    // if the movie is found, we return the movie
    res.status(200).json({ status: 'success', data: { movie } });
}

moviesController.updateMovie = (req, res) => {
    const id = Number(req.params.id);
    const movie = movies.find(movie => movie.id === id);

    // if the movie is not found, we return a 404 error
    // if (!movie) {
    //     return res.status(404).json({ status: 'fail', message: 'Movie not found' });
    // }

    // const updatedMovie = Object.assign(movie, req.body);    

    // finding the index of the movie in the movies array
    // const index = movies.findIndex(movie => movie.id === id);
    // we can also use indexOf() method which is faster to find the index of the movie in the movies array
    const index = movies.indexOf(movie);
    movies[index] = Object.assign(movie, req.body);


    fs.writeFile('./files/movies.json', JSON.stringify(movies), (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Error updating movie' });
        }
        res.status(200).json({
            status: 'success',
            data: {
                movie: movies[index]
            }
        });
    });
}

moviesController.deleteMovie = (req, res) => {
    const id = Number(req.params.id);

    const movieIndex = movies.findIndex(movie => movie.id === id);
    // if the movie is not found, we return a 404 error

    // if (movieIndex === -1) {
    //     return res.status(404).json({ status: 'fail', message: 'Movie not found' });
    // }

    // removing the movie from the movies array
    movies.splice(movieIndex, 1);

    fs.writeFile('./files/movies.json', JSON.stringify(movies), (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Error deleting movie' });
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    });
}

// instead of using objects to export them we can also use direct exports such as exports.createMovie = (req, res) => {...


module.exports = moviesController;
