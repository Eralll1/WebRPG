import './App.css';

import { Route, Routes} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegistraterPage from './pages/RegisterPage';
import RoomPage from './pages/Room';
import RoomHubPage from './pages/roomHub';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteCookie, getCookie, setCookie } from './services/cookies';
import auth from './services/auth';
import { login } from './store/user';
import rooms from './services/rooms';
import { socket } from './Socket';




function App() {

    const dispatch = useDispatch()

    useEffect(() => {
        (async () =>{
            const token_ = getCookie("token")
            const res = await auth.valid_token(token_)
            const {first_name, user_name, token} = res.data.message.user
            deleteCookie("token")
            setCookie("token",token)
            let owned_room = ""
            try {
                owned_room = (await rooms.GetRoomByOwner(token)).data.room.name
            } catch (error){
                console.log(error);
            }
            dispatch(login({first_name, user_name, token, owned_room}));

        })()




    }, []);

    useEffect(() => {
        
        socket.on("connect", ()=>{
            console.log("connected");
        })
        return ()=>socket.disconnect()
      }, []);



    return (
        <Routes>
            <Route path='/' Component={LandingPage} />
            <Route path='/login' Component={LoginPage} />
            <Route path='/register' Component={RegistraterPage} />
            <Route path='/room/:roomName' Component={RoomPage} />
            <Route path='/roomHub' Component={RoomHubPage} />
        </Routes>  
    )
}

export default App
