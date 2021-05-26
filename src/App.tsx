import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";

// blocks
import './css/normalize.css'
import NavBar from './components/NavBar';
import EventCard from './components/EventCard';
import Gallery from './components/Gallery';
import { LoadingMessage, ErrorMessage } from './components/Messages';
import Filters from './components/Filters'

// fontawesome
import {library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

library.add(fas, fab)

function filterEvents(array: Array<any>, filter: String, date: Date) {
    switch(filter) {
        case 'before':
            return array.filter((e) => new Date(e.date) <= date)
        case 'after':
            return array.filter((e) => new Date(e.date) >= date)
        default:
            return array;
    }
}

function sortEvents(array: Array<any>) {
    return array.sort(function(a,b): any{
        return (new Date(a.date).getTime() - new Date(b.date).getTime());
    });
}

function App() {
    const [page, setPage] = useState<number>(0);
    const [filter, setFilter] = useState<String>('dont');
    const [date, setDate] = useState<Date>(new Date());
    const [checkedType, setCheckedType] = useState<boolean>(false);
    const [type, setType] = useState<String>(null)

    const { isLoading, error, data } = useQuery("all-events",
        () => fetch('http://localhost:3001/events', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        }).then((res) => res.json()) );

    let events: JSX.Element;
    if (isLoading)
        events = <LoadingMessage message={"Loading events..."}/>
    else if (error)
        events = <ErrorMessage message={"loading events"}/>

    const PER_PAGE = 4;
    const offset = page * PER_PAGE;

    const nextPage = () => {
        if (page < Math.ceil(data.length / PER_PAGE) - 1)
            setPage(page + 1)
    }

    const prevPage = () => {
        if (page > 0)
            setPage(page - 1)
    }

    const getRadioFilter = (value) => {
        setFilter(value)
    }

    const getSelectedDate = (value) => {
        setDate(value)
        date.setHours(0, 0, 0)
    }

    const getCheckedFilter = (checked) => {
        setCheckedType(checked)
    }

    const getSelectedType = (selectedOption) => {
        setType(selectedOption)
    }

    return (
        <div className="App">
            <header>
                <NavBar/>
            </header>
            <main>
                <section id="gallery">
                    <Gallery/>
                </section>
                <section id="about">
                    <h2>Who We Are</h2>
                    <h3>Forget party planning. We specialize in the art of event reinvention.</h3>
                    <p>At <span style={{color: '#a82548'}}>Eventify</span>, we do more than just event planning or event
                        management. We take a stuffy corporate meeting or conference and make it feel like the only
                        event in town. Not only do we personally handle all logistics and organization, but we also
                        seamlessly blend that with carefully thought-out event concepts that engage your clients and
                        employees. A modern art affair, a carnival-themed seminar, a Latin nightclub reception – we’ve
                        done them all. Because as a leading full-service destination management company (DMC), we don’t
                        just create programs; we create experiences.</p>
                    <p>At <span style={{color: '#a82548'}}>Eventify</span>, “Built Around You” isn’t just a tagline.
                        It’s our DNA.</p>
                    <p>We have the talent, tools, and drive that you expect to turn your event into an unforgettable
                        experience.</p>
                </section>
                <section id="events">
                    <h2>What We Do</h2>
                    <Filters getRadioFilter={getRadioFilter}
                             getSelectedDate={getSelectedDate}
                             getChecked={getCheckedFilter}
                             getSelected={getSelectedType}
                    />
                    <div className={"events-container"}>
                        {
                            events ? events :
                                sortEvents(filterEvents(data, filter, date))
                                    .slice(offset, offset + PER_PAGE)
                                    .map((e) =>
                                        <EventCard
                                            id={e.id}
                                            event={e.event}
                                            location={e.location}
                                            date={e.date}
                                            description={e.description.split('.')[0].split(',')[0] + '.'}
                                            key={e.id}
                                        />
                                    )
                        }
                    </div>
                    <div className={"event-btn-container"}>
                        <button onClick={prevPage} disabled={!page}>Back</button>
                        <button onClick={nextPage}>Next</button>
                    </div>
                </section>
                <section id="booking">
                    <h2>Book an Event</h2>
                </section>
            </main>
            <footer>
                <div className="contacts-container">
                    <div id="contacts">
                        <div className="contact-logo">
                            <img src="/images/icon.png" alt="Eventify" className="logo"/>
                            <a href="#"><p>Eventify</p></a>
                        </div>
                        <div className="contact-info">
                            <p>37, Prosp. Peremohy, Kyiv, Ukraine, 03056</p>
                            <p>8:00-20:00 M-F</p>
                            <p>T: +380 44 204 9494</p>
                            <p>M: mail@eventify.world</p>
                        </div>
                    </div>
                    <div className="map">
                        <p>Find us here:</p>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1270.2703579710123!2d30.46094!3d50.449655!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce82b9d930e5%3A0x8b1e1e0c5175e2f!2z0JrQn9CGINGW0LwuINC60L7RgNC_0YPRgSDihJYx!5e0!3m2!1sru!2sua!4v1620398191470!5m2!1sru!2sua"
                            width="400" height="300" style={{border: 0,}} allowFullScreen={false} loading="lazy">
                        </iframe>
                    </div>
                    {/*<div className="quick-links">*/}
                    {/*    <a target="_blank" rel="noreferrer" href="https://twitter.com/compose/tweet"><FontAwesomeIcon icon={['fab', 'twitter']} size="3x"/></a>*/}
                    {/*    <a target="_blank" rel="noreferrer" href="https://www.facebook.com/"><FontAwesomeIcon icon={['fab', 'facebook']} size="3x"/></a>*/}
                    {/*    <a target="_blank" rel="noreferrer" href="https://www.instagram.com/"><FontAwesomeIcon icon={['fab', 'instagram']} size="3x"/></a>*/}
                    {/*</div>*/}
                </div>
                <div className="copyright">
                    <p>Copyright © 2021 Eventify, All rights reserved.</p>
                    <p>Website by Kateryna Pryshchenko</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
