
import './Card.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react'



export const Card = (props) => {

    const { id, movieName, movieReview, changeState, serServerStatus } = props;
    const [isEdit, setIsEdit] = useState(true);


    const editSaveData = () => {


        const card = document.getElementById(id.toString());
        const movieName = document.getElementById(id.toString() + "name");
        const review = document.getElementById(id.toString() + "review");


        if (isEdit) {
            setIsEdit(!isEdit);




            card.classList.add('edit-card');
            card.classList.remove('card');
            movieName.contentEditable = true;
            movieName.focus();
            review.contentEditable = true;



        } else {
            card.classList.remove('edit-card');
            card.classList.add('card');
            movieName.contentEditable = false;
            review.contentEditable = false;
            const changedData = {
                movieId: id,
                movieName: movieName.innerHTML,
                movieReview: review.innerHTML
            };

            updateData(changedData);
            setIsEdit(!isEdit);
        }



    };

    const updateData = (changedData) => {
        axios
            .post(
                'http://localhost:5000/api/update',
                changedData
            )
            .then((res) => {
                console.log(res.data);
                if (res.data === 'yes') {
                    console.log('updated successfully');
                    document.getElementById(id.toString()).classList.add('card-edied');
                    window.setTimeout(() => {
                        document.getElementById(id.toString()).classList.remove('card-edied');
                        props.changeState();
                    }, 1000);

                } else {
                    console.log('not updated');
                    const data = res.data[0];
                    console.log(data);

                    document.getElementById(id.toString() + "name").innerHTML = data.movieName;
                    document.getElementById(id.toString() + "review").innerHTML = data.movieReview;



                    props.changeState();
                }
            })
            .catch((err) => {
                console.error(err);
                props.setserverDown(true);
            });
    }

    const deleteMovieReivw = () => {
        console.log(id);
        axios
            .post(
                'http://localhost:5000/api/delete',
                { id }
            )
            .then(() => {
                console.log('deleted successfully');

                document.getElementById(id.toString()).classList.add('remove-card');
                window.setTimeout(() => {
                    props.changeState();
                }, 950);
            })
            .catch((err) => {
                console.error(err);
                props.setserverDown(true);
            });
    };



    return (
        <div className='card' id={id.toString()}>
            <h3 id={id.toString() + "name"}>{movieName}</h3>
            <p id={id.toString() + "review"}>{movieReview}</p>
            <div className='card-btns'>

                <button
                    onClick={editSaveData}
                    className={
                        isEdit ?
                            'edit-btn' : 'save-btn'
                    }>
                    {
                        isEdit ?
                            <i className="fas fa-pen"></i> : <i className="fas fa-check"></i>
                    }
                </button>
                <button onClick={deleteMovieReivw} className='delete-btn'><i className="far fa-trash-alt"></i></button>
            </div>
        </div>
    );
};
