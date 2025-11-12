import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LogInPage.css";

import paper from "../Images/LogIn_Paper.png";

function LogInPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username:"",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [isRegister, setIsRegister] = useState(false);

    //handling input change
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const submit = async () => {
        const endpoint = isRegister ? "/auth/register" : "/auth/login";
        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if(response.ok){
                setMessage(isRegister ? "Registered successfully!" : "Login successful!");
                console.log("User data:", data.user);
                // Navigate to HomePage after successful login/register
                setTimeout(() => {
                    navigate("/home");
                }, 1000); // Wait 1 second to show success message
            }else{
                setMessage(data.message || "It failed :( Try again!");
            }
        }catch(err){
            setMessage("Error, check connection!");
            console.error(err);
        }

    };

    return (
        <div className="logIn">
            <h1>{isRegister ? "start your journal!" : "this journal belongs to:"}</h1>
            <p 
                    className="toggleLink"
                    onClick={() =>{
                        setIsRegister(!isRegister);
                        setMessage("");
                    }}
                    > 
            
            { isRegister ? "already have a journal? login!" : "don't have a journal yet? register!"}
            </p>

            {message && <p className="statusMessage">{message}</p>}
            <div className="paperContainer">
                <img
                    src={paper}
                    alt="ripped texture paper"
                    className="paperInfo"
                />
                <div className="paperText">
                    <input 
                        type="text"
                        name="username"
                        placeholder="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <input 
                        type="password"
                        name="password"
                        placeholder="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <div className="logInButton" onClick ={submit}>
                        <p>{isRegister ? "register" : "login"}</p>
                    </div>


                    {message && <p className="statusMessage">{message}</p>}
                </div>
            </div>
        </div>

    );
}

export default LogInPage;

