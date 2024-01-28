import axios from 'axios';


function headers(token){
    return {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
        },
      }
}



class Auth {
    async register(first_name, password, user_name) {
        return axios.post('http://localhost:3000/api/users/register',{first_name, password, user_name})
    }
    async login(user_name, password) {
        return axios.post('http://localhost:3000/api/users/login',{user_name, password})
    }

    async valid_token(token){
        return axios.post('http://localhost:3000/api/users/valid_token',{}, headers(token) )
    }
        
}

export default new Auth