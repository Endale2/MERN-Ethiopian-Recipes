import React from 'react'

function Login() {
  return (
    <div>
      <h1>Login</h1>
      <form className="form">
       <label>Username : </label>
       <input type="text" id="username" />
       <label>Password : </label>
       <input type="password" id="password" />
      </form>
    </div>
  )
}

export default Login
