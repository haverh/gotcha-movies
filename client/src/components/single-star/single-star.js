/* eslint-disable no-throw-literal */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
// import { useAuth0 } from "@auth0/auth0-react";
import './single-star.css';

function SingleStar() {

    // const { isAuthenticated, loginWithRedirect } = useAuth0();

    const [starInfo, setStarInfo] = useState({});
    const location = useLocation()

    const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

    // const fetchURL = process.env.REACT_APP_VERCEL_FETCH_URL;
    const fetchURL = process.env.REACT_APP_LOCAL_FETCH_URL;

    const fetchData = useCallback(async (starId) => {
        console.log("FETCHING STAR INFO")
        try {

            const response = await fetch(`${fetchURL}/api/single-star?starId=${starId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            });
            const jsonData = await response.json();

            if (!response.ok) {
                throw {
                    ...jsonData,
                    status: response.status,
                }
            }
            // console.log(jsonData)
            setStarInfo(jsonData);
          } catch (error) {
            console.error('Error fetching data:', error);
            if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
                window.location.href = "login";
            }
        }
    }, [fetchURL]);

    useEffect(() => {
        fetchData(urlParams.get('starId'));
    },[urlParams, fetchData])
    
    return ( 
        // isAuthenticated ?
        <div className="single-star-content">
            <h1>{starInfo.starName} ({starInfo.starBirth || 'N/A'})</h1>
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                    <th scope="col" >Title</th>
                    <th scope="col" >Release Year</th>
                    <th scope="col" >Director</th>
                    <th scope="col" >Genres</th>
                    <th scope="col" >Stars</th>
                    <th scope="col" >Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {starInfo.starMoviesList && starInfo.starMoviesList.map((movieInfo) => (
                        <tr key={movieInfo.movieId}>
                            <td><Link to={`/single-movie?movieId=${movieInfo.movieId}`} className="link">{movieInfo.movieTitle}</Link></td>
                            <td>{movieInfo.movieYear} </td>
                            <td>{movieInfo.movieDirector} </td>
                            <td>
                                {movieInfo.movieGenres.map((gObj, gIndex) => (
                                <React.Fragment key={gObj.genreId}>
                                    <Link to={`/movies?genreId=${gObj.genreId}`} className="link">{gObj.genreName}</Link>
                                    {gIndex < movieInfo.movieGenres.length - 1 && ', '}
                                </React.Fragment>
                                ))}
                            </td>
                            <td>
                                {movieInfo.movieStars && movieInfo.movieStars.map((sObj, sIndex) => (
                                <React.Fragment key={sObj.starId}>
                                    <Link to={`/single-star?starId=${sObj.starId}`} className="link">{sObj.starName}</Link>
                                    {sIndex < movieInfo.movieStars.length - 1 && ', '}
                                </React.Fragment>
                                ))}
                            </td>
                            <td>{movieInfo.movieRating}
                            <FontAwesomeIcon icon={faStar} color="#8DBA5E" size="sm" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        // : loginWithRedirect()
    )
}


export default SingleStar;