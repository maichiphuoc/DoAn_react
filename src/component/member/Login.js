import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';


function Login() {
    const [inputs, setInputs] = useState({
      email:"",
      password:""
    })
    const [error,setError] = useState({})
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const navigate = useNavigate();
      
    function handleInput(e){
      const nameInput = e.target.name;
      const valueInput = e.target.value;

      setInputs(state =>({...state,[nameInput]:valueInput}))
    }
    function handleSubmit(e){
      e.preventDefault();
        const errorSubmit = {}
        let flag = true;
        if(inputs.email ===""){
          errorSubmit.email = "Vui lòng nhập email"
          flag = false
        }
        else if(!emailRegex.test(inputs.email)){
          errorSubmit.email = "Email không đúng định dạng"
          flag = false
        }
        if(inputs.password ===""){
          errorSubmit.password = "Vui lòng nhập pass";
          flag = false
        }
        if(!flag){
          setError(errorSubmit)
        }
        else{
          const data = {
          email:inputs.email,
          password : inputs.password,
          level:0
        }
        axios.post("http://localhost/laravel8/public/api/login",data)
        .then((res)=>{
          if(res.data.response === 'error'){
            setError({
                login: res.data.errors.errors
            });
            alert('Đăng nhập thất bại')
          }
          else{
            console.log("Response:", res.data);
            console.log(res.data.token)
            localStorage.setItem('token',res.data.token)
            var authLogin = JSON.stringify(res.data.Auth)
            localStorage.setItem('auth',authLogin)
            alert('Đăng nhập thành công')
            // navigate("/")
            window.location.href = "/";
          }
        })
        .catch((error)=>{
          console.log(error)
        })
        
      }
    }
    function renderError(){
      if(Object.keys(error).length >0){
        return Object.keys(error).map((key,index)=>{
          return (
            <div key={index}>
              {key}:{error[key]}
            </div>
          )
        })
      }
    }


  return (
    
    <section id="form">
      <div className="container">
        <div className="row">
          <div className="col-sm-4 col-sm-offset-4">
            <div className="login-form">{/* login form */}
              {renderError()}
              <h2>Login to your account</h2>
              <form action="#" onSubmit={handleSubmit}>
                <input type="email" name='email' value={inputs.email} placeholder="Email Address" onChange={handleInput}/>
                <input type="password" name='password' value={inputs.password} placeholder="password" onChange={handleInput}/>
                <span>
                  <input type="checkbox" className="checkbox" />
                  Keep me signed in
                </span>
                <button type="submit" className="btn btn-default">Login</button>
                    <p className="switch-text">Chưa có tài khoản?</p>
                <Link to="/register" className="btn-secondary">Signup</Link>
              </form>
            </div>{/* /login form */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login