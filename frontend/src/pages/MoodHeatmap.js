import React, { useState, useMemo } from 'react';
import './MoodHeatmap.css'; // Import the CSS file

const MoodHeatmap = () => {
    const [moods, setMoods] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [hoveredCell, setHoveredCell] = useState(null);

    const moodColors = {
        0: '#d1d5db',
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
       const year = new Date().getFullYear();
       const startDate = new Date(year, 0, 1); // Jan 1
       
       let currentDate = new Date(Date.UTC(year, 0, 1)); // Start at Jan 1st, 00:00:00 UTC
       const endDate = new Date(Date.UTC(year, 11, 31));

       while (currentDate <= endDate) {
        //trying out UTC methods to read the date components to match the UTC initialization
          const dayDate = new Date(currentDate); 
          const utcDay = dayDate.getUTCDay();
          days.push({
              date: dayDate.toISOString().split('T')[0],
              mood: moods[dayDate.toISOString().split('T')[0]] || 0,
            //UTC day to Mon=0, Sun=6: (0=Sun -> 6), (1=Mon -> 0), etc.
              weekday: (utcDay === 0 ? 6 : utcDay - 1), 
              month: dayDate.getUTCMonth(), 
          });
          currentDate.setUTCDate(currentDate.getUTCDate() + 1);
         }

         return days;
      };

    const days = useMemo(() => getDaysData(), [moods]);

    const weeks = useMemo(() => {
        const weeksArray = [];
        let week = [];

        if (days.length > 0) {
            const firstDay = days[0];
            // firstDay.weekday is the number of nulls needed before jan 1st
            for (let i = 0; i < firstDay.weekday; i++) {
                week.push(null);
            }
        }

        days.forEach((day) => {
            week.push(day);

            // if the week is full -push it to the array and start a new week
            if (week.length === 7) {
                weeksArray.push(week);
                week = [];
            }
        });

       if (week.length > 0) {
            //padding with null cells until 7
            while (week.length < 7) {
                week.push(null); 
            }
            weeksArray.push(week);
        }

       return weeksArray;
    }, [days]);

    const monthWeekSpans = useMemo(() => {
        const spans = [];
        let currentMonth = -1;
        let startWeekIndex = 0;

        weeks.forEach((week, weekIndex) => {
            const day = week.find(d => d !== null);
            const currentWeekMonth = day ? day.month : currentMonth; 
            
            if (currentWeekMonth !== currentMonth && day) { 
                if (currentMonth !== -1) {
                    spans.push({ 
                        month: currentMonth, 
                        span: weekIndex - startWeekIndex 
                    });
                }
                currentMonth = currentWeekMonth;
                startWeekIndex = weekIndex;
            }

            if (weekIndex === weeks.length - 1 && currentMonth !== -1) {
                spans.push({ 
                    month: currentMonth, 
                    span: weekIndex - startWeekIndex + 1 
                });
            }
        });

        const finalSpans = [];
        let spanIndex = 0;
        for (let i = 0; i < 12; i++) { 
            if (spanIndex < spans.length && spans[spanIndex].month === i) {
                finalSpans.push(spans[spanIndex]);
                spanIndex++;
            } else {
                finalSpans.push({ month: i, span: 0 });
            }
        }
        
        return finalSpans;
    }, [weeks]);

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

    const getMonthName = (monthIndex) => {
        const date = new Date(new Date().getFullYear(), monthIndex, 1);
        return date.toLocaleDateString('en-US', { month: 'short' });
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
                        {/* Month labels */}
                        <div style={{ display: 'flex', gap: '4px', marginLeft: '48px', marginBottom: '4px' }}>
                            {monthWeekSpans.map((monthData) => {
                                const baseWidth = (18 * monthData.span) + (4 * (monthData.span - 1));
    
                                //extra margin to tell gaps apart.
                                const extraMargin = monthData.month !== 0 && monthData.span > 0 ? 8 : 0;
    
                                const totalWidth = baseWidth + extraMargin;

                                return monthData.span > 0 ? (
                                <div 
                                   key={monthData.month} 
                                      style={{ 
                                        width: `${totalWidth}px`, 
                                        textAlign: 'left',
                                        fontSize: '0.75rem', 
                                        color: '#6b7280', 
                                        flexShrink: 0
                                      }}
                                >
                                {getMonthName(monthData.month)}
                              </div>
                           ) : null;
                        })}
                        </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                            {/* Day labels */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginRight: '8px' }}>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                    <div key={day} className="mood-day-label">
                                        {day}
                                    </div>
                                ))}
                            </div>

                        {/* Weeks */}
                            <div style={{ display: 'flex', gap: '4px',flexWrap: 'nowrap', overflowX: 'auto' }}>
                                {weeks.map((week, weekIndex) => {
                                    const dayData = week.find(d => d !== null);
                                    let isMonthStart = false;
                                    
                                    if (dayData && dayData.month !== 0 && weekIndex > 0) {
                                        const prevDayData = weeks[weekIndex - 1].find(d => d !== null);

                                        if (prevDayData) {
                                            isMonthStart = prevDayData.month !== dayData.month;
                                        } 
                                    }
                                    
                                    const weekStyle = {
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        gap: '4px', 
                                        flexShrink: 0,
                                        marginLeft: isMonthStart ? '8px' : '0px'
                                    };

                                  return (
                                    <div key={weekIndex} style={weekStyle}>
                                        {week.map((day, dayIndex) => {
                                            if (!day) return <div key={dayIndex} style={{ width: '18px', height: '18px' }} />;
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
                                );
                        })}
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