import './App.css';

import { BrowserRouter as Route, Routes} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegistraterPage from './pages/RegisterPage';
import RoomPage from './pages/Room';
import RoomHubPage from './pages/roomHub';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import cookies from './services/cookies';
import auth from './services/auth';
import { login } from './store/user';


function App() {

    const dispatch = useDispatch()

    useEffect(() => {
        const _ = async () =>{
            const token = cookies.get("token")
            const res = await auth.valid_token(token)
            const {first_name, user_name} = res.data.message.user
            dispatch(login({first_name, user_name}));
        }
        _()
    }, []);

    return (
        <Routes>
            <Route path='/' Component={LandingPage} />
            <Route path='/login' Component={LoginPage} />
            <Route path='/register' Component={RegistraterPage} />
            <Route path='/room:id' Component={RoomPage} />
            <Route path='/roomHub' Component={RoomHubPage} />
        </Routes>  
    )
}

export default App
