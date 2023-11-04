import React from 'react'

const Button = () => {
  return (
    <button onClick={() => {
                
        let name = document.getElementById("name").value;
        let password = document.getElementById("password").value;

        axios.post('http://localhost:3000/api/users/register',{name: name, password: password})
            .then(response => {
                cookiess.set("token",response.data.message)
            })
            .catch(error => {
                console.log(error)
            });

    }}>
    register
    </button>
  )
}

export default Button