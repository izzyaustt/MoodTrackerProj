import React, { useState, useEffect } from "react";
import { FiHome, FiBookOpen } from "react-icons/fi";
import "./HomePage.css";


function HomePage() {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    // State for API data
    const [quote, setQuote] = useState("Loading quote...");
    const [question, setQuestion] = useState("Loading question...");
    const [quickWrite, setQuickWrite] = useState("");
    const [questionAnswer, setQuestionAnswer] = useState("");
    const [selectedEmotion, setSelectedEmotion] = useState("");
    const [emotions, setEmotions] = useState([]);
    const [currentEntryId, setCurrentEntryId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch emotions from backend
    useEffect(() => {
        fetch("http://localhost:5000/emotions")
            .then(res => res.json())
            .then(data => {
                setEmotions(data);
                if (data.length > 0 && !selectedEmotion) {
                    setSelectedEmotion(data[0]._id);
                }
            })
            .catch(err => {
                console.error("Error fetching emotions:", err);
            });
    }, []);

    // Fetch quote from backend
    useEffect(() => {
        fetch("http://localhost:5000/api/quotes")
            .then(res => res.json())
            .then(data => {
                setQuote(`"${data.content}" - ${data.author}`);
            })
            .catch(err => {
                console.error("Error fetching quote:", err);
                setQuote("Could not load quote");
            });
    }, []);

    // Fetch question of the day from backend
    useEffect(() => {
        fetch("http://localhost:5000/api/question")
            .then(res => res.json())
            .then(data => {
                // Decode HTML entities
                const parser = new DOMParser();
                const decodedQuestion = parser.parseFromString(data.question, 'text/html').body.textContent;
                setQuestion(decodedQuestion);
            })
            .catch(err => {
                console.error("Error fetching question:", err);
                setQuestion("Could not load question");
            });
    }, []);

    // Fetch today's mood entry if it exists
    useEffect(() => {
        fetch("http://localhost:5000/mood", {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                // Find today's entry
                const todayEntry = data.find(entry => {
                    const entryDate = new Date(entry.createdAt).toDateString();
                    return entryDate === new Date().toDateString();
                });
                
                if (todayEntry) {
                    setQuickWrite(todayEntry.quick_write || "");
                    setQuestionAnswer(todayEntry.question_answer || "");
                    setSelectedEmotion(todayEntry.emotion._id || todayEntry.emotion);
                    setCurrentEntryId(todayEntry._id);
                }
            })
            .catch(err => {
                console.error("Error fetching mood entries:", err);
            });
    }, []);

    // Save mood entry
    const saveMoodEntry = async () => {
        setIsSaving(true);
        try {
            const method = currentEntryId ? "PUT" : "POST";
            const url = currentEntryId 
                ? `http://localhost:5000/mood/${currentEntryId}`
                : "http://localhost:5000/mood";

            const response = await fetch(url, {
                method: method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emotion: selectedEmotion,
                    quick_write: quickWrite,
                    question_answer: questionAnswer,
                    duration: 0,
                    startTime: new Date(),
                    endTime: new Date()
                })
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentEntryId(data._id);
                alert("Entry saved successfully!");
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to save entry");
            }
        } catch (err) {
            console.error("Error saving entry:", err);
            alert("Error saving entry. Make sure you're logged in!");
        } finally {
            setIsSaving(false);
        }
    };

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
                    <div className = "box box1">
                        <select 
                            value={selectedEmotion} 
                            onChange={(e) => setSelectedEmotion(e.target.value)}
                            style={{ fontSize: "1.5rem", border: "none", background: "transparent", padding: "10px" }}
                        >
                            {emotions.map(emotion => (
                                <option key={emotion._id} value={emotion._id}>
                                    {emotion.description}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className = "box-wrapper">
                    <div className = "box-title">Quotes/Affirmation</div>
                    <div className = "box box2">{quote}</div>
                </div>

                <div className = "box-wrapper">
                    <div className = "box-title">3 Minutes Writing</div>
                    <div className = "box box3">
                        <textarea 
                            value={quickWrite}
                            onChange={(e) => setQuickWrite(e.target.value)}
                            placeholder="Brain dump your thoughts here..."
                            style={{ width: "100%", height: "100%", border: "none", background: "transparent", resize: "none" }}
                        />
                    </div>
                </div>

                <div className = "box-wrapper">
                    <div className = "box-title">Question of the Day</div>
                    <div className = "box box4">
                        <p style={{ marginBottom: "10px", fontWeight: "bold" }}>{question}</p>
                        <textarea 
                            value={questionAnswer}
                            onChange={(e) => setQuestionAnswer(e.target.value)}
                            placeholder="Your answer..."
                            style={{ width: "100%", height: "60%", border: "none", background: "rgba(255,255,255,0.3)", resize: "none", padding: "5px" }}
                        />
                    </div>
                </div>
            </div>

            <button 
                onClick={saveMoodEntry} 
                disabled={isSaving}
                style={{ 
                    marginTop: "20px", 
                    padding: "10px 30px", 
                    fontSize: "1rem",
                    cursor: "pointer",
                    background: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px"
                }}
            >
                {isSaving ? "Saving..." : "Save Entry"}
            </button>
        </div>
    );
}

export default HomePage;