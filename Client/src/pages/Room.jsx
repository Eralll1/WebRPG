import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import rooms from '../services/rooms';
import { useSelector } from 'react-redux';
import { socket } from '../Socket'

const RoomPage = () => {
    const navigate = useNavigate();
    const token = useSelector(state => state.user.token);
    const user_name = useSelector(state => state.user.user_name)
    const [room_name_, set_room_name_] = useState("")
    const [is_loading, set_is_loading] = useState(true)
    const [users,set_users] = useState([])


    useEffect(() => {
        (async () =>{
            let url = window.location.href.split("/")
            let room_name;


            try {
                room_name = (await rooms.CheckConnection(token)).data.room.name
            } catch (error) {
                navigate(`/roomHub`);
            }
            

            if (room_name != url[url.length - 1]){
                navigate(`/roomHub`);
            }
            set_room_name_(room_name)
            set_users((await rooms.GetUsersInRoom(token,room_name)).data)

            console.log("emitted!");
            socket.emit("rooms_connection", user_name)

            set_is_loading(false)
        })()
    }, []);
    

    return (
        is_loading ?"loading": <>
            {room_name_}
            <button
              onClick={async event => {
                navigate(`/`);
              }}
            >To main menu</button>
            <button
                onClick={async event=>{
                    rooms.Disconnect(token)
                    navigate(`/`)
                }}
            >Leave</button>
            {users.map((value)=>value.user_name + ", ")}
        </>
    )



}

export default RoomPage