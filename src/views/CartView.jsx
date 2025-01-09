import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context/GlobalState";
import "./CartView.css";

function CartView() {
    const { cartItems, setCartItems, firstName, user } = useStoreContext();

    //function remove(movie) {
    //    setCartItems(cartItems.filter(item => item !== movie)); // Correct the cartItems state update
    //}

    const removeFromCart = (movie) => {
        const updatedCart = cartItems.filter(item => item.id !== movie.id);
        setCartItems(updatedCart);
        localStorage.setItem(user.uid, JSON.stringify(updatedCart));
    }

    console.log(cartItems);

    return (
        <div className="cart-view">
            <h2>{firstName}'s Cart</h2>
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
                    <button> 
                        Purchase
                    </button>
                </div>
            )}
        </div>
    )
}

export default CartView;