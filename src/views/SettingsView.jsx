import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context/GlobalState";
import "./SettingsView.css";

function SettingsView() {
  const {
    firstName, setFirst,
    lastName, setLast,
    email, setCurrentGenre,
    setSelected
  } = useStoreContext();

  const navigate = useNavigate();

  const [changedFirst, setChangeFirst] = useState(false);
  const [changedLast, setChangeLast] = useState(false);
  const newFirst = useRef();
  const newLast = useRef();

  const genres = [
    { genre: "Action", id: 28 },
    { genre:"Adventure", id: 12 },
    { genre: "Animation", id: 16 },
    { genre:"Comedy", id: 35 },
    { genre: "Crime", id: 80 },
    { genre: "Family", id: 10751 },
    { genre: "Fantasy", id: 14 },
    { genre:"History", id: 36 },
    { genre: "Horror", id: 27 },
    { genre: "Music", id: 10402 },
    { genre: "Mystery", id: 9648 },
    { genre: "Sci-Fi", id: 878 },
    { genre: "Thriller", id: 53 },
    { genre: "War", id: 10752 },
    { genre: "Western", id: 37}
  ];

  const checkboxesRef = useRef({});

  const firstNameChange = () => {
    setChangeFirst(!changedFirst);
  }

  const lastNameChange = () => {
    setChangeLast(!changedLast);
  }

  function settings(e) {
    e.preventDefault();
    const selectedGenresIds = Object.keys(checkboxesRef.current)
      .filter((genreId) => checkboxesRef.current[genreId].checked)
      .map(Number);
    
    if (selectedGenresIds.length < 10) {
      alert("You need to select at least 10 genres!");
    } else if (selectedGenresIds.length >= 3) {

      const selectedGenres = genres.filter((genre) =>
        selectedGenresIds.includes(genre.id)
      );

      setSelected(selectedGenres);
      setCurrentGenre(selectedGenres[0].genre);
      setInfo();
      navigate(`/movies`);
    }
  }

  function setInfo() {
    if (newFirst !== null) {
      setChangeFirst(newFirst.current.value);
      setFirst(newFirst.current.value);
    }
    if (newLast !== null) {
      setChangeLast(newLast.current.value);
      setLast(newLast.current.value);
    }
  }
  
  return (
    <>
      <div className="settings-container">
        <h2>Settings</h2>
        <form onSubmit={settings}>
          <label className="user-email">Email: {email}</label>

          <div className="user-info-div">
            <label className="user-info">First Name: {firstName}</label>
            <button className="change-button" type="button" onClick={firstNameChange}>Change</button>
          </div>
          {changedFirst && (
            <input 
              type="text"
              placeholder="New First Name"
              ref={newFirst}
            />
          )}

          <div className="user-info-div">
            <label className="user-info">Last Name: {lastName}</label>
            <button className="change-button" type="button" onClick={lastNameChange}>Change</button>
          </div>
          {changedLast && (
            <input 
              type="text"
              placeholder="New Last Name"
              ref={newLast}
            />
          )}

          <label className="genre-label">Genres:</label>
          <div className="genres-list">
            {genres.map((item) => {
              return (
                <label key={item.id}>
                  <input
                    type="checkbox"
                    id="check"
                    ref={(el) => (checkboxesRef.current[item.id] = el)}
                  /> {item.genre}
                </label>
              );
            })}
          </div>
          <button className="submit" type="submit" onChange={settings}>Submit Changes</button>
        </form>
      </div>
    </>
  )
}

export default SettingsView;