import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import Blog from './component/Blog/Index'
import Detail from './component/Blog/Detail';
import Login from './component/member/Login';
import Register from './component/member/Register'
import Account from './component/member/Account';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
        <App>
          <Routes>
              {/* <Route exact path='/' element/> */}
              <Route path='/login' element={<Login/>}/>
              <Route path='/register' element ={<Register/>}/>
              <Route path='/blog/list' element ={<Blog/>}/>
              <Route path='/blog/detail/:id' element={<Detail/>}/>
              <Route path='/account'element={<Account/>}/>
          </Routes>
        </App>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
