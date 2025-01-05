import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Genres from "../components/Genres";
import { useStoreContext } from "../context/GlobalState";
import "./MoviesView.css";

function MoviesView() {
    const { 
        genreList, loggedIn
    } = useStoreContext();

    useEffect(() => {
        console.log("Logged In changed to:", loggedIn);
    }, [loggedIn]);
    
    return (
        <div>
            <div className="header">
                <Header/>
            </div>
            <div className="movies-view-container">
                <div className="main-container">
                    <aside className="genre-list">
                        <Genres genresList={genreList}/>
                    </aside>
                    <main className="genre-movies">
                        <Outlet/>
                    </main>
                </div>
                <Footer/>
            </div>
        </div>
    );
}

export default MoviesView;