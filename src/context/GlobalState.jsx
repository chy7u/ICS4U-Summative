import { createContext, useState, useContext } from "react";
import { Map } from 'immutable';

//creates context
export const StoreContext = createContext();

//provider components.. children is the props
export const StoreProvider = ({ children }) => {
    //states to keep track of where user is
    const [loggedIn, setLoggedIn] = useState(false);
    //user info
    const [firstName, setFirst] = useState("");
    const [lastName, setLast] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");
    //cart
    const [cartItems, setCartItems] = useState([]);
    //genres
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelected] = useState([]);
    const [selectedGenreNames, setSelectedNames] = useState([]);
    const [currentGenre, setCurrentGenre] = useState([]);

    return (
        //value is initial values
        <StoreContext.Provider value={{
            cartItems, setCartItems, 
            password, setPass, 
            genres, setGenres,
            email, setEmail, 
            firstName, setFirst,
            lastName, setLast,
            selectedGenres, setSelected,
            selectedGenreNames, setSelectedNames,
            currentGenre, setCurrentGenre,
            loggedIn, setLoggedIn
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