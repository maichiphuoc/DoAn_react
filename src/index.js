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
import MyProduct from './component/member/MyProduct';
import AddProduct from './component/member/AddProduct';
import EditProduct from './component/member/EditProduct';
import DeleteProduct from './component/member/DeleteProduct';
import Home from './component/Product/Home';
import ProductDetail from './component/Product/ProductDetail';
import Cart from './component/Product/Cart';
import Checkout from './component/Product/Checkout';
import Wishlist from './component/Product/Wishlist';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
        <App>
          <Routes>
              {/* <Route exact path='/' element/> */}
              <Route path='/' element = {<Home/>} />
              <Route path='/login' element={<Login/>}/>
              <Route path='/register' element ={<Register/>}/>
              <Route path='/blog/list' element ={<Blog/>}/>
              <Route path='/blog/detail/:id' element={<Detail/>}/>
              <Route path='/account'element={<Account/>}/>
              <Route path='/account/product/list' element = {<MyProduct/>}/>
              <Route path='/account/product/add' element = {<AddProduct/>} />
              <Route path='/account/product/update/:id' element={<EditProduct/>} />
              <Route path='/account/product/delete/:id' element={<DeleteProduct/>}/>
              <Route path='/product/detail/:id' element={<ProductDetail/>}/>
              <Route path='/product/cart' element={<Cart/>} />
              <Route path='/product/cart/checkout' element={<Checkout/>}/>
              <Route path='/product/wishlist' element={<Wishlist/>}/>
          </Routes>
        </App>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
