import React from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context/GlobalState";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import "./RegisterView.css";

function RegisterView() {
  const {
    setSelected,
    setCurrentGenre,
    setUser
  } = useStoreContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

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
  console.log(firstName);
  const checkBoxesRef = useRef({});

  const registerByEmail = async (event) => {
    event.preventDefault();

    const selectedGenresIds = Object.keys(checkBoxesRef.current)
    .filter((genreId) => checkBoxesRef.current[genreId].checked)
    .map(Number); // convert string ids to number

    if (selectedGenresIds.length < 10) {
      alert("You need at least 10 genres!");
      return;
    }

    const selectedGenres = genres.filter((genre) =>
      selectedGenresIds.includes(genre.id)
    );

    if (confirmPassword != password) {
      alert("Your passwords don't match!");
      return;
    }
    setSelected(selectedGenres);
    setCurrentGenre(selectedGenresIds[0].genre);

    try {
      const user = (await createUserWithEmailAndPassword(auth, email, password)).user;
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      setUser(user);
      navigate('/movies');
    } catch (error) {
      console.log(error);
      alert("Error creating user with email and password!");
    }
  };

  const registerByGoogle = async () => {
    const selectedGenresIds = Object.keys(checkBoxesRef.current)
    .filter((genreId) => checkBoxesRef.current[genreId].checked)
    .map(Number); // convert string ids to number

    if (selectedGenresIds.length < 10) {
      alert("You need at least 10 genres!");
      return;
    }

    const selectedGenres = genres.filter((genre) =>
      selectedGenresIds.includes(genre.id)
    );

    if (confirmPassword != password) {
      alert("Your passwords don't match!");
      return;
    }
    setSelected(selectedGenres);
    setCurrentGenre(selectedGenresIds[0].genre);

    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      setUser(user);
      navigate('/movies');
    } catch {
      alert("Error creating user with email and password!");
    }
  }

  return (
    <div className="register-container">
      <div className="form-container">
        <h2>Create an Account</h2>
        <form onSubmit={(e) => registerByEmail(e)}>
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          
          <label htmlFor="check-genres">Genre Options:</label>
          <div className="genresList">
            {genres.map((item) => {
              //maps through each genre item and creates checkbox
              return (
                <label key={item.id}>
                  <input
                    type="checkbox"
                    id="check"
                    ref={(el) => (checkBoxesRef.current[item.id] = el)}
                  />{" "}
                  {item.genre}
                </label>
              );
            })}
          </div>

          <button type="submit" className="register-button">Register</button>
        </form>
        <p className="login-link">
          Already have an account? <a href="#">Login</a>
        </p>
        <button onClick={() => registerByGoogle()} className="register-button">Register by Google</button>
      </div>
    </div>
  );
}

export default RegisterView;