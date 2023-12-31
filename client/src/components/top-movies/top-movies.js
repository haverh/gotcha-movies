import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './top-movies.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPlus } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../../contexts/CartContext';

const TopMovies = () => {

    const cart = useContext(CartContext);

    const [rows, setRows] = useState([]);

    const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        console.time("fetchTime");
        try {
            const response = await fetch(`${fetchURL}/api/topmovies`);
            const jsonData = await response.json();
            console.log(jsonData)
            setRows(jsonData);
            console.timeEnd("fetchTime");
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="page-content">
            <h1>Top 20 Rated Movies</h1>
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" >Title</th>
                        <th scope="col" >Release Year</th>
                        <th scope="col" >Director</th>
                        <th scope="col" >Genres</th>
                        <th scope="col" >Stars</th>
                        <th scope="col" >Rating</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((item) => (
                        <tr key={item.movieId}>
                            <td><Link to={`/single-movie?movieId=${item.movieId}`} className="link">{item.movieTitle}</Link></td>
                            <td>{item.movieYear}</td>
                            <td>{item.movieDirector}</td>
                            <td>
                                {item.movieGenres.map((gObj, gIndex) => (
                                    <React.Fragment key={gObj.genreid}>
                                        <Link to={`/movies?genreId=${gObj.genreid}`} className="link">{gObj.name}</Link>
                                        {gIndex < item.movieGenres.length - 1 && ', '}
                                    </React.Fragment>
                                ))}
                            </td>
                            <td>
                                {item.movieStars.map((sObj, sIndex) => (
                                    <React.Fragment key={sObj.starId}>
                                        <Link to={`/single-star?starId=${sObj.starid}`} className="link">{sObj.name}</Link>
                                        {sIndex < item.movieStars.length - 1 && ', '}
                                    </React.Fragment>
                                ))}
                            </td>
                            <td>{item.movieRating}
                                <FontAwesomeIcon icon={faStar} color="#8DBA5E" size="sm" /></td>
                            <td>
                                <button className='addToCart' name='addToCart'
                                    onClick={() => cart.addOne(item.movieId, item.movieTitle)}>
                                    <FontAwesomeIcon icon={faPlus} color="white" size="sm" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TopMovies;