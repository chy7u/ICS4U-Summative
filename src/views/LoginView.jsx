import React, { useEffect } from 'react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from "../context/GlobalState";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import './LoginView.css';

function LoginView() {
    const { setUser, user, setSelected, setPurchased, setCartItems } = useStoreContext();
    //const enteredPassword = useRef("");
    const enteredEmail = useRef("");
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    console.log(user);

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
          navigate('/movies');
          setUser(user);
        } catch (error) {
          console.log(error);
          alert("Error signing in!");
        }
      }

    useEffect(() => {
      const fetchSelectedGenres = async () => {
        if (user) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setSelected(userData.genres || []);
          }
        }
      };
  
      const fetchPurchased = async() => {
        if (user) {
          const docRef = doc(firestore, "users", user.uid, "data", "purchased");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPurchased(docSnap.data().purchased);
          }
        }
      };
  
      fetchSelectedGenres();
      fetchPurchased();
  
      //if (selectedGenres.length === 0 && user) {
      //  const storedGenres = JSON.parse(localStorage.getItem(`${user?.uid}-genres`))  || [];
      //  setSelected(storedGenres);
      //}
    }, [user, setSelected, setPurchased])
  
    useEffect(() => {
      if (user) {
        const storedCartItems = JSON.parse(localStorage.getItem(`${user.uid}-cart`)) || [];
        setCartItems(storedCartItems);
      }
    }, [user]);  // Only run this effect when the user changes (on login or reload)  

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
                <button onClick={() => loginByGoogle()} className="login-button">Login by Google</button>            
            </div>
        </div>
    );
}

export default LoginView;