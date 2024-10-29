// App.js
import './App.css';
import Post from "./post";
import Header from "./Header";
import {Route, Routes} from "react-router-dom";
import Layout from './Layout';
import IndexPage from './Pages/IndexPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './Pages/CreatePost';
function App() {
  return (
    <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route path = "/test"/>
      <Route index element={<IndexPage />} />
      <Route path={"/login"} element={<LoginPage/>}/>
      <Route path={"/register"} element={<RegisterPage/>}/>
      <Route path={"/create"} element={<CreatePost/>}/>
      </Route>
    </Routes>
    </UserContextProvider>
    
  );
}

export default App;
