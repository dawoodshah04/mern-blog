import { Link } from "react-router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";

export default function Header(){

    const {userInfo, setuserInfo} = useContext(UserContext);

    useEffect(() => {
      if (!userInfo?.username) {
        fetch('/api/profile', { credentials: 'include' })
          .then(response => response.json())
          .then(userInfo => setuserInfo(userInfo));
      }
    }, [userInfo, setuserInfo]);

    const logout = () => {
      fetch('/api/logout',{
        credentials:'include',
        method:'POST'
      }); 
      setuserInfo(null);
    }
    
  const username = userInfo?.username;

    return(
    <header>
        <Link to="/" className="logo">
          Myblog
        </Link>
        <nav>
          {username && (
          <>
            <span>Hello {username}</span>
            <Link to={"/create"}>Create new Post</Link>
            <Link onClick={logout}>Logout</Link>
            
          </>)}
          {!username && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
    </header>


    );
}