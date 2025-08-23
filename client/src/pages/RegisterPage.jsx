import { useState } from "react";

export default function RegisterPage(){
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');

    const register = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/register',{
            method:'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify({username, password}),
        })
    

   
    }
    return(
        <>
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text" placeholder="username" 
            value={username}
            onChange={(e)=>setusername(e.target.value)}
            />
            <input type="password" placeholder="password"
            value={password}
            onChange={(e)=>setpassword(e.target.value)} />
            <button>Register</button>
        </form>
        </>
    );
}