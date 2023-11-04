import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomPage = () => {
    const navigate = useNavigate();

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