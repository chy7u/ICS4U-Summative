import { createContext, useState, useContext, useEffect } from "react";
import { Map } from 'immutable';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

//creates context
export const StoreContext = createContext();

//provider components.. children is the props
export const StoreProvider = ({ children }) => {
    //states to keep track of where user is
    //const [loggedIn, setLoggedIn] = useState(false);
    //user info
    //const [firstName, setFirst] = useState("");
    //const [lastName, setLast] = useState("");
    //const [email, setEmail] = useState("");
    //const [password, setPass] = useState("");
    //cart
    const [cartItems, setCartItems] = useState(Map());
    //genres
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelected] = useState([]);
    const [selectedGenreNames, setSelectedNames] = useState([]);
    const [currentGenre, setCurrentGenre] = useState([]);
    //user for firebase
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(Map());

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user);
                const sessionCart = localStorage.getItem(user.uid);
                if (sessionCart) {
                    setCart(Map(JSON.parse(sessionCart)));
                    
                }
            }
        });
    }, [])

    return (
        //value is initial values
        <StoreContext.Provider value={{
            user, setUser,
            cart, setCart,
            cartItems, setCartItems, 
            genres, setGenres, 
            selectedGenres, setSelected,
            selectedGenreNames, setSelectedNames,
            currentGenre, setCurrentGenre,
            //loggedIn, //setLoggedIn
            //sets these states as values inside the context
        }}>
            {children}
        </StoreContext.Provider>
        //wraps the children inside the Provider, can be
        //used globally
    );
}
//creates variable useStoreContext
//function that returns whatever child is called,
//from the StoreContext
export const useStoreContext = () => {
    return useContext(StoreContext);
}