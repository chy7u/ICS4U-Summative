import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context/GlobalState";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import "./SettingsView.css";

function SettingsView() {
  const {
    setCurrentGenre,
    setSelected, user,
    purchased, cartItems,
    setPurchased
  } = useStoreContext();

  const navigate = useNavigate();

  const [changedFirst, setChangeFirst] = useState(false);
  const [changedLast, setChangeLast] = useState(false);
  const newFirst = useRef();
  const newLast = useRef();
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");

  const [loading, setLoading] = useState(true);

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

  const checkBoxesRef = useRef({});

  useEffect(() => {
    if (user && user.displayName) {
      const [firstName, ...lastNameParts] = user.displayName.split(" ");
      const lastName = lastNameParts.join(" ");
      setFirst(firstName);
      setLast(lastName);
    }

    const loadGenres = async () => {
      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.genres) {
          setSelected(userData.genres);
          userData.genres.forEach((genre) => {
            if (checkBoxesRef.current[genre.id]) {
              checkBoxesRef.current[genre.id].checked = true;
            }
          });
        }
      }
    };

    const fetchPurchases = async () => {
      if (user) {
          const docRef = doc(firestore, "users", user.uid, "data", "purchased");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
              setPurchased(docSnap.data().purchased);
          }
      }
    };
    setLoading(false);
    fetchPurchases();
    loadGenres();
  }, [user, setPurchased]);

  const firstNameChange = () => {
    setChangeFirst(!changedFirst);
  }

  const lastNameChange = () => {
    setChangeLast(!changedLast);
  }

  const settingsChange = async (e) => {
    e.preventDefault();

    const selectedGenresIds = Object.keys(checkBoxesRef.current)
      .filter((genreId) => checkBoxesRef.current[genreId].checked)
      .map(Number);

    if (selectedGenresIds.length < 10) {
      alert("You need at least 10 genres!");
      return;
    }

    const selectedGenres = genres.filter((genre) =>
      selectedGenresIds.includes(genre.id)
    );

    setSelected(selectedGenres);
    setCurrentGenre(selectedGenresIds[0].genre);

    try {
      if (changedFirst || changedLast) {
        await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      }

      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, { genres: selectedGenres }, { merge: true });

      //localStorage.setItem(`${user.uid}-genres`, JSON.stringify(selectedGenres));
      setSelected(selectedGenres);

      navigate(`/movies`);
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="settings-container">
        <h2>Settings</h2>
        {user.emailVerified ? (
          <form onSubmit={settingsChange}>
          <label className="user-email">Email: {user.email}</label>
          <label className="genre-label">Genres:</label>
          <div className="genres-list">
            {genres.map((item) => {
              return (
                <label key={item.id}>
                  <input
                    type="checkbox"
                    id="check"
                    ref={(el) => (checkBoxesRef.current[item.id] = el)}
                  /> {item.genre}
                </label>
              );
            })}
          </div>
          <button className="submit" type="submit">Submit Changes</button>
          </form>          
        ) : (
          <form onSubmit={settingsChange}>
          <label className="user-email">Email: {user.email}</label>
          <div className="user-info-div">
            <label className="user-info">First Name: {firstName}</label>
            <button className="change-button" type="button" onClick={firstNameChange}>Change first name</button>
          </div>
          {changedFirst && (
            <input 
              type="text"
              placeholder="New First Name"
              ref={newFirst}
              onChange={(e) => setFirst(e.target.value)}
            />
          )}
          <div className="user-info-div">
            <label className="user-info">Last Name: {lastName}</label>
            <button className="change-button" type="button" onClick={lastNameChange}>Change last name</button>  
          </div>
          {changedLast && (
            <input 
              type="text"
              placeholder="New Last Name"
              ref={newLast}
              onChange={(e) => setLast(e.target.value)}
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
                    ref={(el) => (checkBoxesRef.current[item.id] = el)}
                  /> {item.genre}
                </label>
              );
            })}
          </div>
          <button className="submit" type="submit">Submit Changes</button>
        </form>
        )}
        {purchased.length > 0 && (
          <div className="purchased-movies">
              <h3>Purchased Movies:</h3>
              <ul className="purchased-movies-list">
                  {purchased.map((id) => {
                      const purchasedMovie = cartItems.find((movie) => movie.id === id);
                      return (
                          <li key={id}>
                              {purchasedMovie ? purchasedMovie.title : `Title: ${id}`}
                          </li>
                      );
                  })}
              </ul>
          </div>
        )}
      </div>
    </>
  )
}

export default SettingsView;

//<form onSubmit={settings}>
//  <label className="user-email">Email: {email}</label>
//  
//  <div className="user-info-div">
//    <label className="user-info">First Name: {firstName}</label>
//    <button className="change-button" type="button" onClick={firstNameChange}>Change</button>
//  </div>
//  {changedFirst && (
//    <input 
//      type="text"
//      placeholder="New First Name"
//      ref={newFirst}
//    />
//  )}
//  
//  <div className="user-info-div">
//    <label className="user-info">Last Name: {lastName}</label>
//    <button className="change-button" type="button" onClick={lastNameChange}>Change</button>
//  </div>
//  {changedLast && (
//    <input 
//      type="text"
//      placeholder="New Last Name"
//      ref={newLast}
//    />
//  )}
//  
//  <label className="genre-label">Genres:</label>
//  <div className="genres-list">
//    {genres.map((item) => {
//      return (
//        <label key={item.id}>
//          <input
//            type="checkbox"
//            id="check"
//            ref={(el) => (checkboxesRef.current[item.id] = el)}
//          /> {item.genre}
//        </label>
//      );
//    })}
//  </div>
//  <button className="submit" type="submit" onChange={settings}>Submit Changes</button>
//</form>