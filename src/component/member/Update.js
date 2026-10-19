import axios from 'axios';
import React from 'react'

function Update(props) {
    const {inputs, auth} = props
    
    function handleUpdate(){
        // const auth = localStorage.getItem('auth')
        const token = localStorage.getItem('token')

        const config = {
            headers : {
                Authorization: `Bearer ${token}`
            }
        }
        

        const formData = new FormData();
            formData.append("name", inputs.name)
            formData.append("email", inputs.email)
            formData.append("password",inputs.password)
            formData.append("address",inputs.address)
            formData.append("country", inputs.country)
            formData.append("phone",inputs.phone)
        if(inputs.avatar){
            formData.append("avatar",inputs.avatar)
        }
        console.log("File trong FormData:", formData.get("avatar"));
        axios.post(`http://localhost/laravel8/public/api/user/update/${auth.id}`,formData,config)
        .then((res)=>{
            console.log(res.data)
            if(res.data.response ==="error"){
                alert("cập nhật lỗi")
                return;
            }
            alert("cập nhật thành công")
        })
        .catch((error)=>{
            console.log(error)
        })
    }
  return (
    <div>
      <button type='submit' onClick={handleUpdate}>Update</button>
    </div>
  )
}

export default Update
