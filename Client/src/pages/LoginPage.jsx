import React from 'react'
import auth from '../services/auth';
import cookies from '../services/cookies';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
    const navigate = useNavigate();

    const [user_name, set_user_name] = useState("");
    const [password, set_password] = useState("");

    async function handleLogin(event){
        event.preventDefault();

        let login_data
        try{
            login_data = await auth.login(user_name, password)
        }catch(e){
            console.log(e);
        }
        const token = login_data.data.message.user.token  
        cookies.set("token", token, {"max-age":604800,"path":"/"}); // 7 days
        navigate(`/`);
        window.location.reload();
        
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
/*

        auth_data = await auth.valid_token(token)
        const {first_name, user_name} = auth_data.data.message.user
        const owned_room = rooms.GetRoomByOwner(token).data.room?.name

        if (owned_room === undefined){
            dispatch(login({first_name, user_name, token, owned_room:""}))
        }else{
            dispatch(login({first_name, user_name, token, owned_room}));
        } */