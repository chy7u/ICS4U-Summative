import { Link } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Feature from "../components/Feature";
import Footer from "../components/Footer";
import "./Homeview.css";

function HomeView() {

    return (
        <div className="home-view-container">
            <Header/>
            <Hero/>
            <Feature/>
            <Footer/>
        </div>
    )
}

export default HomeView;