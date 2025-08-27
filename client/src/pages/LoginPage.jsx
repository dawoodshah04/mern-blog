import { useContext, useState } from "react";
import { Navigate } from "react-router";
import {UserContext} from "../contexts/UserContext.jsx";
import { API_BASE_URL } from "../config.js";

export default function LoginPage() {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);

  const login = async (e) => {
    e.preventDefault();
  const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials:'include'
    });

    if(response.ok){
        response.json().then(userInfo=>{
            setUserInfo(userInfo);
            setRedirect(true);
        })
        setRedirect(true);
    }else{
        alert('wrong credentials');
    }

    const data = await response.json();
    console.log(data); 
  };

  
    if(redirect){
        return <Navigate to={'/'}/>
    }


  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setusername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setpassword(ev.target.value)}
      />
      <button>Login</button>
    </form>
  );
}
