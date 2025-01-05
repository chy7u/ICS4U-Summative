import { Link, useNavigate } from "react-router-dom";
import { useStoreContext } from "../context/GlobalState";
import './Header.css';

function Header() {
    const {
        loggedIn, setLoggedIn,
        firstName
    } = useStoreContext();
    console.log(loggedIn);

    const navigate = useNavigate();

    function logout() {
        setLoggedIn(false);
        navigate(`/`);
    }

    return (
        <div className="header">
            <div className="title">Notflix</div>
            {!loggedIn ? (
                <div className="navigation">
                    <Link to={`/`} className="button">Home</Link>
                    <div className="dropdown">
                        <button className="drop-button">Profile</button>
                        <div className="drop-content">
                            <Link to={`/login`} className="button">Sign In</Link>
                            <a href="#">Help</a>
                        </div>
                    </div>
                    <button className="Register">
                        <Link to={`/register`} className="button">Join Notflix</Link>
                    </button>
                </div>
            ) : (
                <div className="navigation-logged-in">
                    <Link to={`/`} className="button">Home</Link>
                    <Link to={`/movies`} className="button">Movies</Link>
                    <div className="dropdown">
                        <button className="drop-button">Profile</button>
                        <div className="drop-content">
                            <Link to={`/settings`} className="button">Settings</Link>
                        </div>
                    </div>
                    <button className="Cart">
                        <Link to={`/cart`} className="button">Cart</Link>
                    </button>
                    <button className="Log-Out"
                        onClick={() => { logout() }}
                        >
                        Log Out
                    </button>
                </div>
            )}
        </div>
    )
}

export default Header;

//<div className="header">
//<div className="title">Notflix</div>
//<div className="navigation">
//    <Link to={`/`} className="button">Home</Link>
//    <div className="dropdown">
//        <button className="drop-button">Profile</button>
//        <div className="drop-content">
//            <Link to={`/login`} className="button">Sign In</Link>
//            <a href="#">Help</a>
//        </div>
//    </div>
//    <button className="Register">
//        <Link to={`/register`} className="button">Join Notflix</Link>
//    </button>
//</div>
//</div>