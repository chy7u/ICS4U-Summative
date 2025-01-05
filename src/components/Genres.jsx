import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { useStoreContext } from "../context/GlobalState";
import "./Genres.css";

function Genres() {
  const { selectedGenres, selectedGenreNames, setCurrentGenre } = useStoreContext();
  console.log(selectedGenres);
  console.log(selectedGenreNames);
  return (
    <div>
      <ul className="genres">
        {
          selectedGenres.map((item) => {
            return (
              <li key={item.id}>
                <Link to={`/movies/genre/${item.id}`} onClick={() =>
                  setCurrentGenre(item.id)
                }>
                  <button>{item.genre}</button>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default Genres;