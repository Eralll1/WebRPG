import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import rooms from '../services/rooms';
import { useDispatch, useSelector } from 'react-redux';
import auth from '../services/auth';
import { create_room, remove_room } from '../store/user';

const RoomHubPage = () => {
    const navigate = useNavigate();
    

    const [roomName, setRoomName] = useState("");
    const { token, owned_room } = useSelector(state => state.user);
    const dispatch = useDispatch();



    async function handleConnect(event){
        event.preventDefault();
        rooms.CheckConnection(token)
            .then(res => navigate(`/room/${roomName}`))
            .catch(e => {
                console.log(e);
                rooms.Connect(roomName,token)
                    .then(res => navigate(`/room/${roomName}`))
                    .catch(e => console.log(e))
                })
    };

    async function handleCreation(event){
        event.preventDefault();
        rooms.Create(roomName,token)
            .then(() => {   
                            dispatch(create_room({owned_room:roomName}))
                            navigate(`/room/${roomName}`)
                        })
            .catch(e => console.log(e))
    }

    useEffect(()=>{(async()=>{
        try {
            const room_name = (await rooms.CheckConnection(token)).data.room.name
            navigate(`/room/${room_name}`)
        } catch (error) {console.log(error);}
    })()},[])

    //REDO
    /*
    function valid(){
        auth.valid_token(token).catch(e => {navigate("/")});
    }

    useEffect(valid);
    */

    
    return (
        
        <div className="card">
            <h3>Connect</h3>

            <form onSubmit={handleConnect}>
                <input type = "name" size = "10" onChange={(event) => setRoomName(event.target.value)}/>
                <input type = "submit"/>
            </form>

            {owned_room == "" && <>
                <h3>Create Room</h3>
                <form onSubmit={handleCreation}>
                    <input type = "name" size = "10" onChange={(event) => setRoomName(event.target.value)}/>
                    <input type = "submit"/>
                </form>
            </>}



            {owned_room != "" && <>
                <h3>Your room name: "{owned_room}"</h3>
                <button
                onClick={async event =>   {
                                                rooms.DeleteRoomByOwner(token)
                                                dispatch(remove_room({}))
                                            }}
                >Delete my room</button>
                <button
                onClick={async event =>   {
                    rooms.CheckConnection(token)
                    .then(res => navigate(`/room/${owned_room}`))
                    .catch(e => {
                        console.log(e);
                        rooms.Connect(owned_room,token)
                            .then(res => navigate(`/room/${owned_room}`))
                            .catch(e => console.log(e))
                        })
                                            }}
                >Connect to it</button>
            </>}

            <button
              onClick={async event => {navigate(`/`);}}
            >To main menu</button>


            
        </div>
    )
}

export default RoomHubPage