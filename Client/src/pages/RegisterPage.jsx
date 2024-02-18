import React from 'react'
import auth from '../services/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from "react-redux"
import { login } from '../store/user';

const RegistraterPage = () => {
    const navigate = useNavigate();

    const [user_name,  set_user_name ] = useState("");
    const [password,   set_password  ] = useState("");
    const [first_name, set_first_name] = useState("");
    const dispatch = useDispatch();


    async function handleRegistration(event) {
        event.preventDefault();

        auth.register(first_name, password, user_name)
            .then(response => {   
                const token = response.data.message.user.token  // 7 days

                deleteCookie("token")
                setCookie("token", token); 

                auth.valid_token(token)
                    .then(res=>{
                        const {first_name, user_name} = res.data.message.user
                        dispatch(login({first_name, user_name, token, owned_room:""}));
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