import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context/GlobalState";
import { firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import "./CartView.css";

function CartView() {
    const { cartItems, setCartItems, 
        firstName, user,
        purchased, setPurchased 
    } = useStoreContext();

    const removeFromCart = (movie) => {
        const updatedCart = cartItems.filter(item => item.id !== movie.id);
        setCartItems(updatedCart);
        localStorage.setItem(user.uid, JSON.stringify(updatedCart));
    }

    const checkout = async () => {
        try {
            const docRef = doc(firestore, "users", user.uid);
    
            // Save cartItems directly since it's a plain array

            const updatedPurchased = [
                ...purchased, 
                ...cartItems.map((movie) => movie.title),
            ];
            setPurchased(updatedPurchased);

            await setDoc(docRef, { purchased: updatedPurchased }, { merge: true });

            localStorage.setItem(
                `${user.uid}-purchased`,
                JSON.stringify(updatedPurchased)
            );

            localStorage.removeItem(user.uid);
            setCartItems([]);
    
            // Clear local storage and state
            //localStorage.clear();
            //setCartItems([]);
            console.log("Checkout successful and cart saved to Firestore.");
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };
    
    console.log(cartItems, typeof cartItems, Array.isArray(cartItems));
    console.log(cartItems);

    return (
        <div className="cart-view">
            <h2>{user.displayName}'s Cart</h2>
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
            {purchased.length > 0 && (
                <div className="purchased-movies">
                    <h3>Purchased Movies:</h3>
                    <ul>
                        {purchased.map((id) => {
                            const purchasedMovie = cartItems.find((movie) => movie.id === id);
                            return (
                                <li key={id}>
                                    {purchasedMovie ? purchasedMovie.title : `Movie Title: ${id}`}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default CartView;