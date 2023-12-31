import React from 'react'
import auth from '../services/auth';
import cookies from '../services/cookies';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from "react-redux"
import { login } from '../store/user';


const LoginPage = () => {
    const navigate = useNavigate();

    const [user_name, set_user_name] = useState("");
    const [password, set_password] = useState("");


    async function handleLogin(event){
        event.preventDefault();
        auth.login(user_name, password)
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
            <h3>Login</h3>

            <form onSubmit={handleLogin}>
                <input type = "name"     size = "10" onChange={(event) => set_user_name (event.target.value)}/>
                <input type = "password" size = "10" onChange={(event) => set_password  (event.target.value)}/>
                <input type = "submit"/>
            </form>
        </div>
    )
}

export default LoginPage