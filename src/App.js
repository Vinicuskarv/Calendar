import React, { useState, useEffect } from 'react';
import './App.css';

// Import Firebase libraries
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.fireBase_apiKey,
  authDomain: process.env.fireBase_authDomain,
  projectId: process.env.fireBase_projectId,
  storageBucket: process.env.fireBase_storageBucket,
  messagingSenderId: process.env.fireBase_messagingSenderId,
  appId: process.env.fireBase_appId,
  measurementId: process.env.fireBase_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
  "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const weekdaysName = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

function App() {
  const [today, setToday] = useState(new Date());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [activeDay, setActiveDay] = useState({
    value: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear()
  });
  const [activeWeekdayName, setActiveWeekdayName] = useState('');
  const [eventsArr, setEventsArr] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTimeFrom, setEventTimeFrom] = useState('');
  const [eventTimeTo, setEventTimeTo] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Monitor authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        getEvents(currentUser.uid);  // Fetch events for the current user
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User Info:', result.user);
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out.');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const saveEvents = async () => {
    if (user) {
      try {
        const userEventsRef = collection(db, `users/${user.uid}/events`);
        
        // Clear the existing events for the user
        const existingEventsSnapshot = await getDocs(userEventsRef);
        for (const doc of existingEventsSnapshot.docs) {
          await deleteDoc(doc.ref);
        }

        // Save the updated events
        for (const event of eventsArr) {
          await setDoc(doc(userEventsRef, `${event.day}-${event.month}-${event.year}`), event);
        }
        console.log('Events saved successfully.');
      } catch (error) {
        console.error('Error saving events:', error.message);
      }
    }
  };

  const getEvents = async (userId) => {
    try {
      const userEventsRef = collection(db, `users/${userId}/events`);
      const querySnapshot = await getDocs(userEventsRef);
      const events = querySnapshot.docs.map(doc => doc.data());
      setEventsArr(events);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };

  useEffect(() => {
    if (user) {
      saveEvents();
    }
  }, [eventsArr, user]);

  const getWeekdayName = (day, month, year) => {
    const date = new Date(year, month - 1, day);
    const dayIndex = date.getDay();
    return weekdaysName[dayIndex];
  };

  const initCalendar = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();

    const day = firstDay.getDay();
    const firstMonth = firstDay.getMonth();

    const nextDays = 7 - lastDay.getDay() - 1;
    const nextMonth = lastDay.getMonth() - 1;

    const days = [];
    for (let x = day; x > 0; x--) {
      const isEvent = eventsArr.some(event => event.day === x && event.month === month + 1 && event.year === year);
      days.push({
        type: 'prev-date',
        value: prevDays - x + 1,
        month: firstMonth,
        year: year,
        isEvent
      });
    }

    for (let i = 1; i <= lastDate; i++) {
      const isToday = i === today.getDate() && year === today.getFullYear() && month === today.getMonth();
      const isEvent = eventsArr.some(event => event.day === i && event.month === month + 1 && event.year === year);
      days.push({
        type: isToday ? 'today' : 'current',
        value: i,
        month: month + 1,
        year: year,
        isEvent
      });
    }

    for (let j = 1; j <= nextDays; j++) {
      const isEvent = eventsArr.some(event => event.day === j && event.month === month + 1 && event.year === year);
      days.push({
        type: 'next-date',
        value: j,
        month: nextMonth,
        year: year,
        isEvent
      });
    }

    return days;
  };

  const prevMonth = () => {
    setMonth(prevMonth => (prevMonth === 0 ? 11 : prevMonth - 1));
    setYear(prevYear => (month === 0 ? prevYear - 1 : prevYear));
  };

  const nextMonth = () => {
    setMonth(prevMonth => (prevMonth === 11 ? 0 : prevMonth + 1));
    setYear(prevYear => (month === 11 ? prevYear + 1 : prevYear));
  };

  const handleDayClick = (day) => {
    setActiveDay(day);
    setActiveWeekdayName(getWeekdayName(day.value, day.month, day.year));
  };

  const setTodaydate = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());

    setActiveDay({
      value: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear()
    });
  };

  const handleAddEventClick = () => {
    setShowEventForm(prev => !prev);
  };

  const handleSaveEvent = () => {
    if (!eventTitle || !eventTimeFrom || !eventTimeTo) {
      alert('Por favor preencha todos os campos');
      return;
    }
  
    const newEvent = {
      title: eventTitle,
      time: `${eventTimeFrom} - ${eventTimeTo}`
    };
  
    setEventsArr(prevEvents => {
      const eventIndex = prevEvents.findIndex(event => event.day === activeDay.value && event.month === activeDay.month && event.year === activeDay.year);
  
      if (eventIndex >= 0) {
        const updatedEvents = [...prevEvents];
        updatedEvents[eventIndex].events = updatedEvents[eventIndex].events.filter(e => e.title !== eventTitle);
        updatedEvents[eventIndex].events.push(newEvent);
        return updatedEvents;
      } else {
        return [...prevEvents, { day: activeDay.value, month: activeDay.month, year: activeDay.year, events: [newEvent] }];
      }
    });
  
    setEventTitle('');
    setEventTimeFrom('');
    setEventTimeTo('');
    setShowEventForm(false);
  };

  const handleDeleteEvent = (eventTitle) => {
    if (window.confirm('Tem certeza de que deseja excluir este evento?')) {
      setEventsArr(prevEvents => {
        const updatedEvents = prevEvents.map(event => {
          if (event.day === activeDay.value && event.month === activeDay.month && event.year === activeDay.year) {
            return {
              ...event,
              events: event.events.filter(e => e.title !== eventTitle)
            };
          }
          return event;
        }).filter(event => event.events.length > 0);
        return updatedEvents;
      });
    }
  };

  const getEventsForActiveDay = () => {
    return eventsArr.find(event => 
      event.day === activeDay.value && 
      event.month === activeDay.month && 
      event.year === activeDay.year
    );
  };

  return (
    <>
      <header>
        <h1>Calendar App</h1>
        {user ? (
          <div>
            <p>Welcome, {user.displayName}!</p>
            <button onClick={handleLogout}>Sign Out</button>
          </div>
        ) : (
          <button onClick={handleLogin}>Sign In with Google</button>
        )}
      </header>
      <div className="left">
        <div className="calendar">
          <div className="month">
            <i className="fas fa-angle-left prev" onClick={prevMonth}></i>
            <div className="date">{months[month]} {year}</div>
            <i className="fas fa-angle-right next" onClick={nextMonth}></i>
          </div>
          <div className="weekdays">
            {weekdays.map(day => <div key={day}>{day}</div>)}
          </div>
          <div className="days">
            {initCalendar().map((day, index) => (
              <div
                key={index}
                className={`day ${day.type} ${day.isEvent ? 'event' : ''} ${day.value === activeDay.value && day.month === activeDay.month && day.year === activeDay.year ? 'active' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                {day.value}
              </div>
            ))}
          </div>
          <div className="goto-today">
            <button className="today-btn" onClick={setTodaydate}>Hoje</button>
          </div>
        </div>
      </div>
      
      <div className="right">
        <button className="add-event" onClick={handleAddEventClick}>
          <i className="fas fa-plus"></i>
        </button>
        <div className="today-date">
          <div className="event-day">{activeWeekdayName}</div>
          <div className="event-date">{activeDay ? `${activeDay.value} ${months[activeDay.month - 1]} ${year}` : 'Selecione um dia'}</div>
        </div>
        <div className="events">
          {getEventsForActiveDay() && getEventsForActiveDay().events.map((event, index) => (
            <div key={index} >
              <div>{event.title}</div>
              <div>{event.time}</div>
              <button onClick={() => handleDeleteEvent(event.title)}>Delete</button>
            </div>
          ))}
        </div>
        {showEventForm && (
          <div className="add-event-wrapper">
            <div className="add-event-header">
              <div className="title">Criar Evento</div>
              <i className="fas fa-times close" onClick={() => setShowEventForm(false)}></i>
            </div>
            <div className="add-event-body">
              <div className="add-event-input">
                <input
                  type="text"
                  placeholder="Texto"
                  className="event-name"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
              </div>
              <div className="add-event-input">
                <input
                  type="text"
                  placeholder="Início do Tempo"
                  className="event-time-from"
                  value={eventTimeFrom}
                  onChange={(e) => setEventTimeFrom(e.target.value)}
                />
              </div>
              <div className="add-event-input">
                <input
                  type="text"
                  placeholder="Fim do Tempo"
                  className="event-time-to"
                  value={eventTimeTo}
                  onChange={(e) => setEventTimeTo(e.target.value)}
                />
              </div>
            </div>
            <div className="add-event-footer">
              <button className="add-event-btn" onClick={handleSaveEvent}>Add Event</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
