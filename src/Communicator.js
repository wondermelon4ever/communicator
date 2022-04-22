import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RoomDashboard from './RoomDashboard';
import Convernece from './Conference';

const Communicator = (props) => {

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route key={1} path="/" element={ <RoomDashboard />} />
                    <Route key={2} path="/dashboard" element={ <RoomDashboard />} { ...props } />
                    <Route key={3} path="/conference" element={<Convernece/>} { ...props } />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default Communicator;
