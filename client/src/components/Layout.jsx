import { Outlet } from "react-router";
import Header from "./Header";

export default function layout(){
    return(
        <main>
            <Header/>
            <Outlet/>
        </main>
    );
}