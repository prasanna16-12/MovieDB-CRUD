const express = require("express");
const app = express();
const mysql = require('mysql');
const cors = require('cors');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Prasanna89',
    database: 'moviedb',
});

db.connect(
    function(err){
        if (err) {
            throw err;
        }
    }
);

/**
 * Get all data from movie database
 */
app.get('/api/get', (req, res) => {

    const SQL_SELECT = "SELECT * FROM movie_review;";
    db.query(SQL_SELECT, (err, result) => {
        console.log(result);
        res.send(result);
    });
});


/**
 * Get data from movie database using movie name as query
 */
app.get('/api/getSpecific/:query', (req, res) => {

    const query = req.params.query;
    console.log(req.params.query);
    const SQL_SELECT_BY_NAME = 'SELECT * FROM movie_review WHERE movieName LIKE \'%'+ query +'%\';';
    db.query(SQL_SELECT_BY_NAME, (err, result) => {
        console.log(result);
        res.send(result);
    });
});

/**
 * Insert Data into batabase
 */
app.post('/api/insert', (req, res) => {

    const movieName = req.body.movieName;
    const review = req.body.review;

    console.log("movie name : " + movieName + "\nreview : " + review);

    const SQL_INSERT =
        "INSERT INTO movie_review (movieName, movieReview) VALUES (?, ?);";

    if (movieName !== '' && review !== '') {
        db.query(SQL_INSERT, [movieName, review], (err, result) => {
            console.log(result);
            res.end('yes');
        });
    } else {
        res.end('no');
    }


});

/**
 * Delete movie data
 */
app.post('/api/delete', (req, res) => {

    const movieId = req.body.id;

    console.log(movieId);

    const SQL_DELETE =
        "DELETE FROM movie_review WHERE(id = ?)";

    db.query(SQL_DELETE, [movieId], (err, result) => {
        console.log(result);
        res.end('yes');
    });
});


/**
 * update movie data 
 */
app.post('/api/update', (req, res) => {

    const movieid = req.body.movieId;
    const movieName = req.body.movieName;
    const movieReview = req.body.movieReview;

    const SQL_UPDATE =
        "UPDATE movie_review SET movieName = ?, movieReview = ? WHERE(id = ?)";


    if (movieName !== '' && movieReview!== '') {
        db.query(SQL_UPDATE, [movieName, movieReview, movieid], (err, result) => {
            console.log(result);
            res.end('yes');
        });
    }else{
        const SQL_SELECT = "SELECT * FROM movie_review WHERE (id = ?);;";
        db.query(SQL_SELECT, [movieid], (err, result) => {
            console.log(result);
            res.send(result);
        });
        
    }

});
////////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.send("hello i'm in server");
})

//start your server on port 3001
app.listen(5000, () => {
    console.log('Server Listening on port 5000');
});
