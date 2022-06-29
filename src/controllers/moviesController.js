const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {

        Genres.findAll()
        .then(allGenres => {
            
            (res.render("moviesAdd", {allGenres}))

        }) 
            
        
    },
    create: function (req,res) {

        Movies
        .create({

            ...req.body

        })

        .then((movie) =>{


        console.log("🚀 ~ file: moviesController.js ~ line 75 ~ .then ~ movie", movie)
            
            res.redirect("/movies")

        })


    },
    edit: function(req,res) {

         let movieId = req.params.id

         let promMovies = Movies.findByPk(movieId, {include: ['genre']})
         let promGenres = Genres.findAll()

         Promise
         .all([promMovies, promGenres])

         .then(([Movie, allGenres]) => {

         console.log("🚀 ~ file: moviesController.js ~ line 96 ~ .then ~ Movie", Movie)

            res.render("moviesEdit", {Movie, allGenres})

         })


    },
    update: function (req,res) {
        
        let movieId = req.params.id

        Movies.update({

            ...req.body

        },
        {
            where: { id: movieId }
        }
        )
        .then((movie)=>{

            console.log("🚀 ~ file: moviesController.js ~ line 119 ~ movie", movie)

            res.redirect("/movies")

        })


    },
    delete: function (req,res) {

        let movieId = req.params.id

        Movies
        .findByPk(movieId)
        .then(Movie => {

            res.render("moviesDelete", {Movie})

        })
        

    },
    destroy: function (req,res) {


        let movieId = req.params.id
        Movies
        .destroy({ where: { id: movieId }})
        .then(()=> {

                res.redirect("/movies")

        })
        .catch(error => res.send(error))

    }
}

module.exports = moviesController;