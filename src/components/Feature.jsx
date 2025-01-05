import axios from "axios";
import { useEffect, useState } from "react";
import "./Feature.css";

function Feature() {
    const [featured, setFeatured] = useState ([]);

    useEffect(() => {
        (async function getFeatured() {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}`
            );

            let shuffled = response.data.results
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)

            setFeatured(shuffled);
            
            console.log("API Key:", import.meta.env.VITE_TMDB_KEY);
        }) ();
    }, []);

    return (
        <div className="featured-section">
            <h2>Featured Movies</h2>
            <div>
                {featured.slice(0,3).map((feature) => (
                    <div key={feature.id} className="featured-movie">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${feature.poster_path}`}
                            alt={feature.title}
                        />
                        <div className="movie-info">
                            <h3>{feature.title}</h3>
                            <p>{feature.overview}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )

}

export default Feature;