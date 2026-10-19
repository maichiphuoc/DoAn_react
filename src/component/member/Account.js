import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Update from "./Update";
function Account() {
    const navigate = useNavigate();
    const auth = JSON.parse(localStorage.getItem('auth')|| null)
    const token = localStorage.getItem('token')
    const [avatarPreview, setAvatarPreview] = useState("");

    const [inputs, setInputs] = useState({
        name :auth?.name || "",
        email : auth?.email || "",
        password : "",
        address : auth?.address || "",
        country : auth?.country || "",
        phone : auth?.phone || "",
        avatar : null,
    })
    if(!auth ||!token){
        alert("Vui lòng đăng nhập")
        navigate('/')
        return
    }
    function handleFile(e) {
        const selectedFile = e.target.files[0];
        console.log("ktra:",selectedFile)

        if (!selectedFile) {
            setInputs(state => ({
                ...state,
                avatar: null
            }));
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            console.log("4. Đọc file xong");
            setInputs(state => ({
                ...state,
                avatar: e.target.result
            }));
            console.log(e.target.result)
        };
        console.log("2 Đăng ký onload");

        reader.readAsDataURL(selectedFile);
        console.log("3 Đã bắt đầu đọc file");
    }
    function handleInput(e){
        const nameInput = e.target.name;
        const valueInput = e.target.value;

        setInputs(state =>({...state,[nameInput]:valueInput}))
    }
        

    return (
        
        <div className="account-update-form">
            <p>Thông tin tài khoản của tôi</p>
            <input name="name" value={inputs.name} placeholder="name" onChange={handleInput}/>
            <input readOnly name="email" value={inputs.email} placeholder="email" onChange={handleInput}/>
            <input name="password" type="password" value={inputs.password} placeholder="password" onChange={handleInput}/>
            <input name="address" value={inputs.address} placeholder="address" onChange={handleInput}/>
            <input type="text" name="country" value={inputs.country} placeholder="country" onChange={handleInput}/>
            <input name="phone" value={inputs.phone} placeholder="phone" onChange={handleInput}/>
            <input name="avatar" type="file" onChange={handleFile}/>
            <Update inputs={inputs} auth={auth}/>
        </div>
        
    );
}

export default Account;