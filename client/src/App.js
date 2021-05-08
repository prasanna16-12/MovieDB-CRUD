import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from './Card';
import serverError from './server_down.svg'



function App() {
    const [query, setQuery] = useState('');
    const [count, setCount] = useState(0);
    const [movieName, setMovieName] = useState('');
    const [review, setReview] = useState('');
    const [sucess, setSucess] = useState(0);
    const [movieReviewList, setMovieReviewList] = useState([]);
    const [serverDown, setserverDown] = useState(false);

    useEffect(() => {
        axios
            .get(
                'http://localhost:5000/api/get'
            )
            .then((res) => {
                setMovieReviewList(res.data);
                setserverDown(false);
            })
            .catch((err) => {
                console.error(err);
                console.log('server down');
                setserverDown(true);
            });
    }, [count]);



    const handleName = (e) => {
        e.preventDefault();
        setMovieName(e.target.value);
    }

    const handleReview = (e) => {
        e.preventDefault();
        setReview(e.target.value);
    }

    const submitMovieData = () => {

        const data = {
            movieName: movieName,
            review: review
        }

        console.log(data);

        axios
            .post(
                'http://localhost:5000/api/insert',
                data
            )
            .then((res) => {
                if (res.data === "no") {
                    console.log('no');
                    setSucess(2);

                } else {
                    console.log('yes');
                    setSucess(1);
                    setCount(count + 1);
                }
                window.setTimeout(() => {
                    setSucess(0);
                }, 2000);
            })
            .catch((err) => {
                console.error(err);
                setserverDown(true);
            });


        setMovieName('');
        setReview('');

    };

    const changeState = () => {
        console.log('count incremented');
        setCount(count + 1);
    };


    const searchQuery = () => {

        if (query !== '' && query !== 'No Data found') {
            axios
                .get(
                    `http://localhost:5000/api/getSpecific/${query}`
                )
                .then((res) => {
                    console.log(res.data);
                    setMovieReviewList(res.data);
                })
                .catch((err) => {
                    console.error(err);
                    setserverDown(true);
                });

        } else {
            setQuery('No Data found');
        }

    };


    const refresh = () => {
        setQuery('');
        setCount(count + 1);
    }

    return (
        <React.Fragment>
            <div className='container'>
                <h1>Movie Database</h1>
                <div className={sucess !== 1 ? sucess === 0 ? 'form-container' : 'form-container form-container-on-error' : 'form-container form-container-on-sucess'}>
                    <div>
                        <input
                            type="text"
                            name='movieName'
                            placeholder='Enter movie name...'
                            onChange={handleName}
                            required
                            value={movieName} />
                    </div>
                    <div>
                        <textarea
                            type="text"
                            placeholder='What do you think about this movie ?'
                            name='review'
                            onChange={handleReview}
                            rows='4'
                            maxLength='200'
                            required
                            value={review} />
                    </div>
                    <div>
                        <button
                            type='submit'
                            onClick={submitMovieData}>
                            Submit</button>
                        {sucess === 2 ? <h1 style={{
                            color: "white"
                        }} >Empty input <i className="fas fa-exclamation"></i> </h1> : null}


                    </div>

                </div>
                {/* {
                    serverDown 
                        && 
                        <div className='serverStatus'>
                            Server Down <i className="fas fa-exclamation"></i>
                        </div>
                } */}
                <br></br>
                <div className='search-bar-container'>
                    <h1 style={{ fontSize: '1rem' }}>Reviews</h1>
                    <div className='search-container'>
                        <button
                            onClick={refresh}
                            className='refresh-btn'>
                            <i className="fas fa-redo-alt"></i>
                        </button>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className='search-bar'
                            type="text"
                            placeholder='Search by movie name...' />
                        <button onClick={searchQuery} className='search-btn'><i className="fas fa-search"></i></button>
                    </div>

                </div>


                {serverDown ?
                    <img style={
                        {
                            width: "100%",
                            marginTop: "1rem"
                        }} src={serverError} alt="error" />
                    :
                    <div className='movie-cards'>
                        {
                            movieReviewList.map((movie) => {
                                const { id, movieName, movieReview } = movie;
                                return (
                                    <Card key={id} changeState={changeState} setserverDown={setserverDown} id={id} movieName={movieName} movieReview={movieReview} />
                                );
                            })
                        }
                    </div>
                }
            </div>
        </React.Fragment >
    )
}

export default App;

