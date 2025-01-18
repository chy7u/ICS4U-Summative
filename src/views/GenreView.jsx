import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStoreContext } from "../context/GlobalState";
import { auth } from "../firebase";
import { firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import "./GenreView.css";

function GenreView() {
  const { 
    selectedGenres, firstName,
    cartItems, setCartItems, 
    purchased, setPurchased, user, setSelected
  } = useStoreContext();

  const { id } = useParams();
  console.log("Genre ID:", id);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previousId, setPreviousId] = useState(null);
  
  useEffect(() => {
    if (!id) {
      console.warn("No genre ID");
      return;
    }

    if (id !== previousId) {
      setPage(1);
      setPreviousId(id);
    }

    window.scrollTo(0, 0);

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

  // Modify to track added state per movie
  const addToCart = async (movie) => {
    if (!cartItems.some(item => item.id === movie.id)) {
      const updatedCart = [...cartItems, { 
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path,
      }];

      try {
        const docRef = doc(firestore, "users", user.uid);
        await setDoc(docRef, { cart: updatedCart }, {merge: true});

        localStorage.setItem(`${user.uid}-cart`, JSON.stringify(updatedCart));
        setCartItems(updatedCart);

      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  useEffect(() => {
    if (selectedGenres.length === 0 && user) {
      const storedGenres = JSON.parse(localStorage.getItem(`${user?.uid}-genres`))  || [];
      setSelected(storedGenres);
    }
  }, [selectedGenres, setSelected])

  useEffect(() => {
    if (user) {
      const storedCartItems = JSON.parse(localStorage.getItem(`${user.uid}-cart`)) || [];
      setCartItems(storedCartItems);
    }
  }, [user]);  // Only run this effect when the user changes (on login or reload)  

  console.log(cartItems);

  //const markAsPurchased = (movie) => {
  //  if (!purchased.includes(movie.id)) {
  //    const updatedPurchased = [...purchased, movie.id];
  //    setPurchased(updatedPurchased);
  //    localStorage.setItem(`${user.uid}-purchased`, JSON.stringify(updatedPurchased));
  //  }
  //}

  //console.log(user);
  //console.log(user.emailVerified);

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

              <button
                className="addButton"
                onClick={() => {
                  addToCart(movie);
                  //markAsPurchased(movie);
                }} // Pass the specific movie
                disabled={cartItems.some(item => item.id === movie.id) || purchased.includes(movie.title)}
              >
                {purchased.includes(movie.title) ? "Purchased" : cartItems.some(item => item.id === movie.id) ? "Added" : "Add To Cart"}
              </button>
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

//{cartItems.some(item => item.id === movie.id) ? "Added" : "Add To Cart"}