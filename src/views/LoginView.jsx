import React from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from "../context/GlobalState";
import './LoginView.css';

function LoginView() {
    const { password, email, loggedIn, setLoggedIn } = useStoreContext();
    const enteredPassword = useRef("");
    const enteredEmail = useRef("");
    const navigate = useNavigate();

    function login(event) {
        event.preventDefault();
        if (enteredPassword.current.value === password
            && enteredEmail.current.value === email
        ) {
            setLoggedIn(true);
            setTimeout(() => {
                navigate('/movies');
            }, 0);
        } else {
            alert("Wrong email or password!");
        }
    }

    console.log(loggedIn);

    return (
        <div className="login-container">
            <div className="form-container">
                <h2>Login</h2>
                <form onSubmit={(event) => {login(event)}}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" ref={enteredEmail} required/>

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" ref={enteredPassword} required/>

                    <button type="submit" className="login-button">Login</button>
                </form>
                <p className="register-link">New to Notflix? <a href="/register">Register Now</a></p>
            </div>
        </div>
    );
}

export default LoginView;