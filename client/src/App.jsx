import "./App.css";
import Header from "./components/Header.jsx";
import Post from "./components/Post.jsx";
import {Route, Routes} from "react-router"

function App() {
  return (
    
    <Routes>
      <Route index element={    
    <main>
      <Header/>
      <Post/>
      <Post/>
      <Post/>
      
    </main>
    }/>
      <Route path="/login" element={
        <div>Login Page</div>
      }/>
    </Routes>
  );
}

export default App;
