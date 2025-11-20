import React, { useState, useEffect } from "react";
import { FiHome, FiBookOpen } from "react-icons/fi";
import MoodHeatmap from "./MoodHeatmap";
import "./HomePage.css";

function HomePage() {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    // Fallback emotions if backend is not available
    const fallbackEmotions = [
        { _id: 'fallback1', name: 'Happy', description: '😊 Feeling joyful and content' },
        { _id: 'fallback2', name: 'Sad', description: '😢 Feeling down or melancholic' },
        { _id: 'fallback3', name: 'Angry', description: '😠 Feeling frustrated or upset' },
        { _id: 'fallback4', name: 'Anxious', description: '😰 Feeling worried or nervous' },
        { _id: 'fallback5', name: 'Tired', description: '😴 Feeling exhausted or sleepy' },
        { _id: 'fallback6', name: 'Calm', description: '😌 Feeling peaceful and relaxed' }
    ];

    // State for API data
    const [quote, setQuote] = useState("Loading quote...");
    const [question, setQuestion] = useState("Loading question...");
    const [quickWrite, setQuickWrite] = useState("");
    const [questionAnswer, setQuestionAnswer] = useState("");
    const [selectedEmotion, setSelectedEmotion] = useState("");
    const [emotions, setEmotions] = useState(fallbackEmotions);
    const [currentEntryId, setCurrentEntryId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    //timer states
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
    const [isRunning, setIsRunning] = useState(false);

    // Fetch emotions from backend (with fallback)
    useEffect(() => {
        fetch("http://localhost:5000/emotions")
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setEmotions(data);
                    if (!selectedEmotion) {
                        setSelectedEmotion(data[0]._id);
                    }
                }
            })
            .catch(err => {
                console.error("Error fetching emotions from backend, using fallback:", err);
                // Keep fallback emotions that were set in initial state
                if (!selectedEmotion && fallbackEmotions.length > 0) {
                    setSelectedEmotion(fallbackEmotions[0]._id);
                }
            });
    }, []);

    // Fetch quote from backend
    useEffect(() => {
        fetch("http://localhost:5000/api/quotes")
            .then(res => res.json())
            .then(data => {
                if (data && data.content && data.author) {
                    setQuote(`"${data.content}" - ${data.author}`);
                } else {
                    setQuote('"Be yourself; everyone else is already taken." - Oscar Wilde');
                }
            })
            .catch(err => {
                console.error("Error fetching quote:", err);
                setQuote('"The only way to do great work is to love what you do." - Steve Jobs');
            });
    }, []);

    // Fetch question of the day from backend
    useEffect(() => {
        fetch("http://localhost:5000/api/question")
            .then(res => res.json())
            .then(data => {
                if (data && data.question) {
                    // Decode HTML entities
                    const parser = new DOMParser();
                    const decodedQuestion = parser.parseFromString(data.question, 'text/html').body.textContent;
                    setQuestion(decodedQuestion);
                } else {
                    setQuestion("What is one thing you're grateful for today?");
                }
            })
            .catch(err => {
                console.error("Error fetching question:", err);
                setQuestion("What is one thing that made you smile today?");
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

    useEffect(() => {
        if (!isRunning) return;

        if (timeLeft <= 0) {
            setIsRunning(false);
            alert("Time's up! Great job journaling!");
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [isRunning, timeLeft]);

    const startTimer = () => {
        setTimeLeft(180);
        setIsRunning(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                            className="emotion-select"
                        >
                            {emotions.map(emotion => (
                                <option key={emotion._id} value={emotion._id}>
                                    {emotion.description?.trim() || emotion.description}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className = "box-wrapper">
                    <div className = "box-title">Quotes/Affirmation</div>
                    <div className = "box box2">{quote}</div>
                </div>

                {/* 3 Minutes Writing with Timer */}
                <div className="box-wrapper">
                    <div className="box-title">3 Minutes Journaling</div>
                    <div className="box box3" style={{ flexDirection: "column", padding: "10px" }}>
                        <div className="timer-display">{formatTime(timeLeft)}</div>
                        <textarea 
                            value={quickWrite}
                            onChange={(e) => setQuickWrite(e.target.value)}
                            placeholder="Brain dump your thoughts here..."
                        />
                        <button 
                            onClick={startTimer} 
                            className="start-timer-button" 
                            disabled={isRunning}
                        >
                            {isRunning ? "Running..." : "Start 3-min Timer"}
                        </button>
                    </div>
                </div>

                <div className = "box-wrapper">
                    <div className = "box-title">Question of the Day</div>
                    <div className = "box box4" style={{ flexDirection: "column", padding: "15px" }}>
                        <p style={{ marginBottom: "10px", fontWeight: "bold", fontSize: "0.95rem" }}>{question}</p>
                        <textarea 
                            value={questionAnswer}
                            onChange={(e) => setQuestionAnswer(e.target.value)}
                            placeholder="Your answer..."
                            style={{ 
                                width: "100%", 
                                flex: 1, 
                                border: "1px solid rgba(0,0,0,0.1)", 
                                background: "rgba(255,255,255,0.5)", 
                                resize: "none", 
                                padding: "8px",
                                borderRadius: "5px",
                                fontFamily: "Inter, sans-serif"
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="mood-tracker">
                <MoodHeatmap />
            </div>

            <button
                onClick={saveMoodEntry}
                disabled={isSaving}
                className="save-button"
            >
                {isSaving ? "Saving..." : "Save Entry"}
            </button>
        </div>
    );
}

export default HomePage;