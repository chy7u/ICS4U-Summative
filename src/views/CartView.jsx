import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context/GlobalState";
import { firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import "./CartView.css";

function CartView() {
    const { cartItems, setCartItems, firstName, user } = useStoreContext();

    const removeFromCart = (movie) => {
        const updatedCart = cartItems.filter(item => item.id !== movie.id);
        setCartItems(updatedCart);
        localStorage.setItem(user.uid, JSON.stringify(updatedCart));
    }

    const checkout = async () => {
        try {
            const docRef = doc(firestore, "users", user.uid);
    
            // Save cartItems directly since it's a plain array
            await setDoc(docRef, { cart: cartItems });
    
            // Clear local storage and state
            localStorage.clear();
            setCartItems([]);
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
                    <button
                        className="checkoutButton"
                        onClick={() => checkout()}
                    > 
                        Checkout
                    </button>
                </div>
            )}
        </div>
    )
}

export default CartView;