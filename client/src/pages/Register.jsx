import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';



function Register() {

const [username, setUsername] =useState("")
const [password, setPassword] =useState("")

const onSubmit = async(e)=>{
    e.preventDefault;
    try{
     await axios.post("http://localhost:5000/auth/register", {username, password})
    }
    catch(e){
   toast.error(error)
    }
}


  return (
    <div>
      <h1>Register</h1>
      <form className="form">
       <label>Username : </label>
       <input type="text" id="username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
       <label>Password : </label>
       <input type="password" value={password} id="password" onChange={(e)=>setPassword(e.target.value)} />
       <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register
