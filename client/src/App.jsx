import "./App.css";
import Header from "./components/Header.jsx";
import Post from "./components/Post.jsx";
import Layout from "./components/Layout.jsx"
import {Route, Routes} from "react-router"
import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  return (
    
    <Routes>
     <Route path="/" element={<Layout/>} >
       <Route index element={<IndexPage/>}/>
       <Route path="/login" element={<LoginPage/>}/>
       <Route path="/register" element={<RegisterPage/>}/>
       
    </Route>
    </Routes>
  );
}

export default App;
