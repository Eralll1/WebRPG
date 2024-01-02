import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import rooms from '../services/rooms';
import { useSelector } from 'react-redux';

const RoomPage = () => {
    const navigate = useNavigate();
    const [room_id, set_room_id] = useState("")
    const token = useSelector(state => state.user.user.token);

    useEffect(() => {
        const _ = async () =>{
            let url = window.location.href.split()
            set_room_id(url[url.length - 1])
            rooms.CheckConnection(token)
                .then(res => {
                    const connection = res.room_id
                    if (connection !== room_id){
                        throw new Error("")
                }})
                .catch(res => {
                    navigate("/roomHub")
                })
        }
        _()
    }, []);


    return (
        <>
            <button
              onClick={async event => {
                navigate(`/`);
              }}
            >To main menu</button>
        </>
    )

}

export default RoomPage