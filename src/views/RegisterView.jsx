import React from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context/GlobalState";
import "./RegisterView.css";

function RegisterView() {
  const {
    setFirst,
    setLast,
    setEmail,
    setPass,
    setGenres,
    setSelected,
    setSelectedNames,
    setCurrentGenre,
  } = useStoreContext();

  const navigate = useNavigate();

  const firstName = useRef("");
  const lastName = useRef("");
  const email = useRef("");
  const password = useRef("");
  const confirmedPass = useRef("");

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

  //on submit
  function register(event) {
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

    if (confirmedPass.current.value != password.current.value) {
      alert("Your passwords don't match!");
      return;
    }

    setFirst(firstName.current.value);
    setLast(lastName.current.value);
    setEmail(email.current.value);
    setPass(password.current.value);

    setSelected(selectedGenres);
    setCurrentGenre(selectedGenresIds[0].genre);

    navigate("/login");
  }

  console.log(genres);
  return (
    <div className="register-container">
      <div className="form-container">
        <h2>Create an Account</h2>
        <form
          action="#"
          method="POST"
          onSubmit={(event) => {
            register(event);
          }}
        >
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            ref={firstName}
            required
          />
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            ref={lastName}
            required
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            ref={email}
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            ref={password}
            required
          />
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirm Password"
            ref={confirmedPass}
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

          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterView;