import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import cookies from '../services/cookies';

const LandingPage = () => {
    const navigate = useNavigate();

    const { is_authed } = useSelector(state => state.user)

    
    return (
        <>
            {(!is_authed) && <button onClick = {async e => {navigate(`/login`)}}>
                Login
            </button>}
            

            {(!is_authed) && <button onClick = {async e => {navigate(`/register`)}}>
                Register
            </button>}



            {is_authed && <button onClick = {async e => {
                                                        cookies.set("token",undefined);
                                                        window.location.reload();
                                                        }}>
                Unlogin
            </button>}


            {is_authed && <button onClick = {async e => {navigate(`/roomHub`)}}>
                Connect
            </button>}
            
        </>
    )

}

export default LandingPage