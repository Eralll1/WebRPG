import axios from "axios";

class Rooms {
    async Connect(name,token){
        console.log(name,token);
        return axios.post('http://localhost:3000/api/rooms/connect',{name, token})
    }
    async Create(name,token){
        return axios.post('http://localhost:3000/api/rooms/create' ,{name, token})
    }
    async DeleteRoomByOwner(token){
        return axios.post('http://localhost:3000/api/rooms/deleteRoomByOwner' ,{token})
    }
    async GetRoomByName(name){
        return axios.get('http://localhost:3000/api/rooms/getRoomByName' ,{name})
    }
}

export default new Rooms