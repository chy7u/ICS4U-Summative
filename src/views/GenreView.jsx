import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStoreContext } from "../context/GlobalState";
import "./GenreView.css";

function GenreView() {
  const { 
    selectedGenres, firstName
  } = useStoreContext();

    const { id } = useParams();
    console.log("Genre ID:", id); //returning undefined??
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [previousId, setPreviousId] = useState(selectedGenres[0].id);
  
    useEffect(() => {
      window.scrollTo(0, 0);
      if (id !== previousId) {
        setPage(1);
        setPreviousId(id);
      }

      async function fetchMovies() {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=${id}&page=${page}`
          );
          setMovies(response.data.results);
          setTotalPages(response.data.total_pages);
          console.log("Genre ID:", id);
        } catch (error) {
          console.error("Error fetching movies:", error);
        }
      }
      fetchMovies();
    }, [id, page]);

    function nextPage() {
        if (page < totalPages) {
            setPage(page + 1);
        }
    }

    function previousPage() {
        if (page !== 1) {
            setPage(page - 1);
        }
    }

  return (
    <div className="hero">
      <h2>Welcome, {firstName}</h2>
      <h2>Movies</h2>
      <div className="genre-view-container">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="genre-view-item">
              <Link to={`/movies/details/${movie.id}`}>
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="genre-view-image"
                  />
                ) : (
                  <div className="no-image">No Image Available</div>
                )}
              </Link>
            </div>
          ))
        ) : (
          <p>No movies available for this genre.</p>
        )}
      </div>

      <div className='pages'>
        <button className="page-button" onClick={previousPage}>
            Previous
        </button>
        <p className="page-number">Page: {page}/{totalPages}</p>
        {page < totalPages && (
            <button className="page-button" onClick={nextPage}>
                Next
            </button>
        )}        
      </div>
    </div>
  );
}

export default GenreView;