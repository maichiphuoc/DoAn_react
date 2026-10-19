import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';


function Register() {
    const [inputs, setInputs] = useState({
        name:"",
        email:"",
        email_verified_at:"",
        password:"",
        phone:"",
        address:"",
        country:"",
        remember_token:"",
        level:0,
    
    })
    const [errors, setError] = useState({})
    const [file, setFile] = useState(null)
    const [avatar, setAvatar] = useState("")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function handleInput(e){
        const nameInput = e.target.name;
        const valueInput = e.target.value;

        setInputs(state =>({...state,[nameInput]:valueInput}))
    }
    function handleFile(e){
        
        const selectedFile = e.target.files;
        console.log(selectedFile);
        if(!selectedFile[0]){
            setFile(null);
            setAvatar("")
            return;
        }
        else{
          //khoi tao doi tuong doc file
          let reader = new FileReader();
          reader.onload = (e) =>{
            setAvatar(e.target.result);
            setFile(selectedFile[0])
          }
          reader.readAsDataURL(selectedFile[0]);
        }
        
    }
    function handleSubmitRegister(e){
        e.preventDefault();
        let flag = true;
        let errorSubmit = {}

        if(inputs.name ===""){
            errorSubmit.name = "Nhập tên"
            flag = false
        }
        if(inputs.email ===""){
            errorSubmit.email = "Vui long nhap email"
            flag = false
        }
        else if(!emailRegex.test(inputs.email)){
            errorSubmit.email = "Email khong dung dinh dang"
            flag = false
        }
        
        if(inputs.password === ""){
            errorSubmit.password = "Vui long nhap pass"
            flag = false
        }
        if(inputs.phone === ""){
            errorSubmit.phone = "Vui long nhap sdt"
            flag = false
        }
        if(inputs.address === ""){
            errorSubmit.address = "Vui long nhap dia chi"
            flag = false
        }
        if(!file){
          errorSubmit.avatar = "Vui long chọn file"
          flag = false
        }
        else{
          const allowedExtensions = ["png","jpg","jpeg"]
          const extension = file.name.split(".").pop().toLowerCase();
          if(!allowedExtensions.includes(extension)){
            errorSubmit.avatar = "Chỉ chấp nhận PNG,JPG,JPEG"
            flag = false
          }
          else if(!["image/png","image/jpeg","image/jpg"].includes(file.type)){
            errorSubmit.avatar = "File không hợp lệ"
            flag = false
          }
          else if(file.size > 1024 * 1024){
            errorSubmit.avatar = "File quá lớn"
            flag = false
          }

        }
        
        if(!flag){
            setError(errorSubmit)
        }
        else{
            const data = {
                name : inputs.name,
                email : inputs.email,
                password : inputs.password,
                phone : inputs.phone,
                address : inputs.address,
                level : inputs.level,
                avatar : avatar,
                country : inputs.country
                
            }
            axios.post("http://localhost/laravel8/public/api/register", data)
            .then(res =>{
                if(res.data.errors){
                    setError(res.data.errors);
                }
                else{
                    alert("Đăng kí thành công") 
                }
            })
            .catch((error)=>{
              console.log("Status:", error.response?.status);
              console.log("Backend error:", error.response?.data);
            })
            
        }

    }
    function renderError(){
      if(Object.keys(errors).length>0){
        return Object.keys(errors).map((key,index)=>{
          return (
            <div key={key}>
              <p>{key}:{errors[key]}</p>
            </div>
          )
        })
      }
    }

  return (
    
    <section id="form">
      <div className="container">
        <div className="row">
          
          <div className="col-sm-8 col-sm-offset-2">
            <div className="signup-form">
              {renderError()}
              <h2>New User Signup!</h2>
              <form encType='multipart/form-data' onSubmit={handleSubmitRegister}>
                <input type="text" name="name" placeholder="Name" value={inputs.name} onChange={handleInput} />
                <input type="email" name="email" value={inputs.email} placeholder="Email Address" onChange={handleInput} />
                <input type="password" name="password" value={inputs.password} placeholder="Password" onChange={handleInput} />
                <input type="number" name="phone" value={inputs.phone} placeholder="Phone" onChange={handleInput} />
                <input type="text" name="address" value={inputs.address} placeholder="Address" onChange={handleInput} />
                <input type="text" name="country" value={inputs.country} placeholder="Country" onChange={handleInput} />
                <input type="file" name="avatar" accept='.png,.jpg,.jpeg' onChange={handleFile} />
                <button type="submit" className="btn btn-default">Signup</button>
                <p style={{ textAlign: 'center', margin: '15px 0 0', color: '#a0a8b4', fontSize: 14 }}>
                  Đã có tài khoản?
                </p>
                <Link to="/login" className="btn-login">Login</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register