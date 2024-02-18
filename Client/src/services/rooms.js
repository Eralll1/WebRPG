import axios from "axios";

function headers(token){
    return {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
        },
      }
}
class Rooms {

    async Connect(roomName,token){
        return axios.post('http://localhost:3000/api/rooms/connect', {roomName}, headers(token))
    };
    async Disconnect(token){
        return axios.post('http://localhost:3000/api/rooms/disconnect', {}, headers(token))
    }

    async Create(roomName,token){
        return axios.post('http://localhost:3000/api/rooms/create', {roomName}, headers(token) )
    };

    async DeleteRoomByOwner(token){
        return axios.post('http://localhost:3000/api/rooms/deleteRoomByOwner',{} ,headers(token))
    };

    async GetRoomByName(name){
        return axios.get('http://localhost:3000/api/rooms/getRoomByName' ,{name})
    };

    async CheckConnection(token){
        return axios.post('http://localhost:3000/api/rooms/checkConnection', {}, headers(token))
    };

    async GetRoomByOwner(token){
        return axios.post('http://localhost:3000/api/rooms/getRoomByOwner',{} ,headers(token))
    };

    async GetUsersInRoom(token,roomName){
        return axios.post('http://localhost:3000/api/rooms/getUsersInRoom',{roomName},headers(token))
    }
}

export default new Rooms