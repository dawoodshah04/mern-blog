import { Link } from "react-router";

export default function Header(){
    return(
    <header>
        <a href="" className="logo">
          Myblog
        </a>
        <nav>
          <Link href="">Login</Link>
          <Link href="">Register</Link>
        </nav>
    </header>


    );
}