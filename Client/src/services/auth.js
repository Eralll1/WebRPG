import axios from 'axios';

class Auth {
    async register(first_name, password, user_name) {
        return axios.post('http://localhost:3000/api/users/register',{first_name, password, user_name})
    }
    async login(user_name, password) {
        return axios.post('http://localhost:3000/api/users/login',{user_name, password})
    }
    //TODO
    async get_token() {}

    async valid_token(token){
        return axios.post('http://localhost:3000/api/users/valid_token',{},{
            headers: {
              "Content-Type": "application/json",
              "authorization": `Bearer ${token}`,
            },
          })
    }
        
}

export default new Auth