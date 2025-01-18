import React from 'react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from "../context/GlobalState";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import './LoginView.css';

function LoginView() {
    const { setUser, user } = useStoreContext();
    //const enteredPassword = useRef("");
    const enteredEmail = useRef("");
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function loginByEmail(event) {
        event.preventDefault();

        try {
            const user = (await signInWithEmailAndPassword(auth, enteredEmail.current.value, password)).user;
            navigate('/movies');
            setUser(user);
          } catch (error) {
            console.log(error);
            alert("Error signing in!");
          }        
    }

    async function loginByGoogle() {
        try {
          const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
          navigate('/movies/all');
          setUser(user);
        } catch (error) {
          console.log(error);
          alert("Error signing in!");
        }
      }

//    function login(event) {
//        event.preventDefault();
//        if (enteredPassword.current.value === password
//            && enteredEmail.current.value === email
//        ) {
//            setLoggedIn(true);
//            setTimeout(() => {
//                navigate('/movies');
//            }, 0);
//        } else {
//            alert("Wrong email or password!");
//        }
//    }
//
//    console.log(loggedIn);
  console.log(user);

    return (
        <div className="login-container">
            <div className="form-container">
                <h2>Login</h2>
                <form onSubmit={(event) => { loginByEmail(event) }}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" ref={enteredEmail} required/>

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={password} onChange={(event) => { setPassword(event.target.value) }} required/>

                    <button type="submit" className="login-button">Login</button>
                </form>
                <p className="register-link">New to Notflix? <a href="/register">Register Now</a></p>
            </div>
        </div>
    );
}

export default LoginView;