import React, { useState, useMemo } from 'react';
import './MoodHeatmap.css'; // Import the CSS file

const MoodHeatmap = () => {
    const [moods, setMoods] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [hoveredCell, setHoveredCell] = useState(null);

    const moodColors = {
        0: '#ebedf0',
        1: '#e57373',
        2: '#E7BBC8',
        3: '#ECEADC',
        4: '#99B788',
        5: '#155C0B',
    };

    const moodLabels = {
        1: '😢 Terrible',
        2: '😕 Bad',
        3: '😐 Okay',
        4: '🙂 Good',
        5: '😄 Amazing'
    };

    const getDaysData = () => {
        const days = [];
        const today = new Date();

        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            days.push({
                date: dateStr,
                mood: moods[dateStr] || 0
            });
        }

        return days;
    };

    const days = useMemo(() => getDaysData(), [moods]);

    const weeks = useMemo(() => {
        const weeksArray = [];
        let week = [];

        const firstDay = new Date(days[0].date).getDay();
        for (let i = 0; i < firstDay; i++) {
            week.push(null);
        }

        days.forEach(day => {
            week.push(day);
            if (week.length === 7) {
                weeksArray.push(week);
                week = [];
            }
        });

        if (week.length > 0) {
            while (week.length < 7) {
                week.push(null);
            }
            weeksArray.push(week);
        }

        return weeksArray;
    }, [days]);

    const handleDayClick = (date) => {
        setSelectedDate(selectedDate === date ? null : date);
    };

    const handleMoodSelect = (moodLevel) => {
        if (selectedDate) {
            setMoods(prev => ({
                ...prev,
                [selectedDate]: moodLevel
            }));
            setSelectedDate(null);
        }
    };
    return (
        <div className="mood-container">
            <div className="mood-max-width">

                <div className="mood-header">
                    <h1 className="mood-title">Mood Tracker</h1>
                    <p className="mood-subtitle">Click any day to log your mood</p>
                </div>

                <div className="mood-heatmap-card">
                    <div style={{ display: 'inline-block' }}>

                        <div style={{ display: 'flex', gap: '4px' }}>
                            {/* Day labels */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginRight: '8px' }}>
                                <div style={{ height: '12px' }}></div>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                                    <div key={day} className="mood-day-label">
                                        {idx % 2 === 0 ? day : ''}
                                    </div>
                                ))}
                            </div>

                            {/* Weeks */}
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {weeks.map((week, weekIndex) => (
                                    <div key={weekIndex} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div className="mood-month-label">
                                            {week[0] && new Date(week[0].date).getDate() === 1
                                                ? new Date(week[0].date).toLocaleDateString('en-US', { month: 'short' })
                                                : ''}
                                        </div>

                                        {week.map((day, dayIndex) => {
                                            if (!day) {
                                                return <div key={dayIndex} style={{ width: '12px', height: '12px' }} />;
                                            }

                                            const isSelected = selectedDate === day.date;

                                            return (
                                                <div
                                                    key={dayIndex}
                                                    className={`mood-day-cell ${isSelected ? 'selected' : ''}`}
                                                    style={{ backgroundColor: moodColors[day.mood] }}
                                                    onClick={() => handleDayClick(day.date)}
                                                    onMouseEnter={() => setHoveredCell(day.date)}
                                                    onMouseLeave={() => setHoveredCell(null)}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mood-legend">
                            <span>Less</span>
                            {[0, 1, 2, 3, 4, 5].map(level => (
                                <div
                                    key={level}
                                    className="mood-legend-box"
                                    style={{ backgroundColor: moodColors[level] }}
                                />
                            ))}
                            <span>More</span>
                        </div>
                    </div>
                </div>

                {selectedDate && (
                    <div className="mood-selector">
                        <h3 className="mood-selector-title">
                            {new Date(selectedDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </h3>
                        <div className="mood-grid">
                            {[5, 4, 3, 2, 1].map(level => (
                                <button
                                    key={level}
                                    onClick={() => handleMoodSelect(level)}
                                    className="mood-button"
                                >
                                    <div
                                        className="mood-color-box"
                                        style={{ backgroundColor: moodColors[level] }}
                                    />
                                    <span className="mood-label">{moodLabels[level]}</span>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setSelectedDate(null)}
                            className="mood-cancel-button"
                        >
                            Cancel
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default MoodHeatmap;