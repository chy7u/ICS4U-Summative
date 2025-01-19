import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Map } from "immutable";
import React from "react";

const StoreContext = React.createContext();

export const StoreProvider = ({ children }) => {
  const [purchased, setPurchased] = useState(Map());
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelected] = useState([]);
  const [selectedGenreNames, setSelectedNames] = useState([]);
  const [currentGenre, setCurrentGenre] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(Map());
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirestoreData = async (user) => {
      try {
        const purchasedDocRef = doc(firestore, "users", user.uid, "data", "purchased");
        const purchasedDocSnap = await getDoc(purchasedDocRef);
        if (purchasedDocSnap.exists()) {
          setPurchased(Map(purchasedDocSnap.data()));
        }

        const genresDocRef = doc(firestore, "users", user.uid, "data", "genres");
        const genresDocSnap = await getDoc(genresDocRef);
        if (genresDocSnap.exists()) {
          setGenres(genresDocSnap.data().genres);
          setSelected(genresDocSnap.data().genres);
        }
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const sessionCart = localStorage.getItem(user.uid);
        if (sessionCart) {
          setCart(Map(JSON.parse(sessionCart)));
        }

        await fetchFirestoreData(user);
      }
      setLoading(false);
    });
  }, [setSelected]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <StoreContext.Provider value={{
      user, setUser,
      cart, setCart,
      genres, setGenres,
      selectedGenres, setSelected,
      selectedGenreNames, setSelectedNames,
      currentGenre, setCurrentGenre,
      purchased, setPurchased,
      cartItems, setCartItems
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => React.useContext(StoreContext);