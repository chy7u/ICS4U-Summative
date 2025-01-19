import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context/GlobalState";
import { firestore } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./CartView.css";

function CartView() {
    const { cartItems, setCartItems, 
        firstName, user,
        purchased, setPurchased 
    } = useStoreContext();

    const removeFromCart = (movie) => {
        const updatedCart = cartItems.filter(item => item.id !== movie.id);
        setCartItems(updatedCart);
        localStorage.setItem(`${user.uid}-cart`, JSON.stringify(updatedCart));
    }

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPurchases = async () => {
            if (user) {
                const storedCartItems = JSON.parse(localStorage.getItem(`${user.uid}-cart`)) || [];
                setCartItems(storedCartItems);

                const docRef = doc(firestore, "users", user.uid, "data", "purchased");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPurchased(docSnap.data().purchased);
                }

                setLoading(false);
            }
        };
        fetchPurchases();
    }, [user, setPurchased]);  // Only run this effect when the user changes (on login or reload)  

    const checkout = async () => {
        try {
            const docRef = doc(firestore, "users", user.uid, "data", "purchased");
    
            // Save cartItems directly since it's a plain array

            const updatedPurchased = [
                ...purchased, 
                ...cartItems.map((movie) =>  movie.title),
            ];
            setPurchased(updatedPurchased);

            await setDoc(docRef, { purchased: updatedPurchased }, { merge: true });

            localStorage.removeItem(
                `${user.uid}-cart`
            );
            
            setCartItems([]);
    
            // Clear local storage and state
            //localStorage.clear();
            //setCartItems([]);
            console.log("Checkout successful and cart saved to Firestore.");
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };
    
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="cart-view">
            <h2>{user ? `${user.displayName}'s Cart`: `Cart`}</h2>
            {cartItems.length === 0 ? (
                <p className="empty-cart-message">Your cart is empty. Add some movies!</p>
            ) : (
                <>
                <div className="cart-item-container">
                    {cartItems.map((movie) => (
                        <div key={movie.id} className="cart-view-item">
                            <p>{movie.title}</p>
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                                alt={movie.title}
                                className="cart-view-image"
                            />
                            <button className="trash" onClick={() => { removeFromCart(movie) }}>
                                Delete item
                            </button>
                        </div>
                    ))}
                </div>
                <div className="checkout-container">
                    <button
                        className="checkoutButton"
                        onClick={() => {
                            checkout();
                            }}
                    > 
                        Checkout
                    </button>
                </div>
                </>
            )}
        </div>
    );
}

export default CartView;