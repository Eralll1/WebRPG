import React from 'react'
import auth from '../services/auth';
import cookies from '../services/cookies';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from "react-redux"

const RegistraterPage = () => {
    const navigate = useNavigate();

    const [user_name,  set_user_name ] = useState("");
    const [password,   set_password  ] = useState("");
    const [first_name, set_first_name] = useState("");


    async function handleRegistration(event) {
        event.preventDefault();

        auth.register(first_name, password, user_name)
            .then(response => {   
                const token = response.data.message.user.token  // 7 days
                cookies.set("token", token, {"max-age":604800});
                auth.valid_token(token)
                    .then(res=>{
                        const {first_name, user_name} = res.data.message.user
                        dispatch(login({first_name, user_name, token}));
                        navigate(`/`);
                })
            }).catch(error => {
                console.log(error)
            });
    }

    return (
        <div className="card">

            <h3>Register</h3>

            <form onSubmit={handleRegistration}>
                Public Name
                <input type = "name"     size = "10" onChange={(event) => set_first_name(event.target.value)}/>
                Login Name
                <input type = "name"     size = "10" onChange={(event) => set_password  (event.target.value)}/>
                Password
                <input type = "password" size = "10" onChange={(event) => set_user_name (event.target.value)}/>

                <input type = "submit"/>
            </form>

        </div>
    )

}

export default RegistraterPage