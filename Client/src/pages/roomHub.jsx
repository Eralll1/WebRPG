import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import rooms from '../services/rooms';
import { useSelector } from 'react-redux';
import auth from '../services/auth';

const RoomHubPage = () => {
    const navigate = useNavigate();
    

    const [roomName, setRoomName] = useState("");
    const token = useSelector(state => state.user.user.token);



    async function handleConnect(event){
        event.preventDefault();
        rooms.Connect(roomName,token).then(() => navigate(`/room/${roomName}`))
        
        
    };

    async function handleCreation(event){
        event.preventDefault();
        rooms.Create(roomName,token)
        navigate(`/room/${roomName}`).then(() => navigate(`/room/${roomName}`))
    }

    //REDO
    function valid(){
        auth.valid_token(token).catch(e => {navigate("/")});
    }

    useEffect(valid);

    
    return (
        
        <div className="card">
            <h3>Connect</h3>

            <form onSubmit={handleConnect}>
                <input type = "name" size = "10" onChange={(event) => setRoomName(event.target.value)}/>
                <input type = "submit"/>
            </form>

            <h3>Create Room</h3>

            <form onSubmit={handleCreation}>
                <input type = "name" size = "10" onChange={(event) => setRoomName(event.target.value)}/>
                <input type = "submit"/>
            </form>

            <button
              onClick={async event => {navigate(`/`);}}
            >To main menu</button>
        </div>
    )
}

export default RoomHubPage