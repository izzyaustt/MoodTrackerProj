import React from "react";
import { FiHome, FiBookOpen } from "react-icons/fi";
import "./HomePage.css";


function HomePage() {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <div className = "homepage">
            {/* date bar */}
            <div className = "date-bar">
                <div className= "date">{today}</div>
                <div className = "icons">
                    <FiHome className = "icon"/>
                    <FiBookOpen className = "icon"/>
                </div>
            </div>

            {/*grid container */}
            <div className = "grid-container">
                <div className = "box-wrapper">
                    <div className = "box-title">My Emotion</div>
                    <div className = "box box1"> 😊 </div>
                </div>

                <div className = "box-wrapper">
                    <div className = "box-title">Quotes/Affirmation</div>
                    <div className = "box box2">"some type of quote here"</div>
                </div>

                <div className = "box-wrapper">
                    <div className = "box-title">3 Minutes Writing</div>
                    <div className = "box box3">brain dump</div>
                </div>

                <div className = "box-wrapper">
                    <div className = "box-title">Question of the Day</div>
                    <div className = "box box4">some type of question for the day</div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;