import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function DeleteProduct() {
    const param = useParams()
    const navigate = useNavigate()
    console.log(param)

    const token = localStorage.getItem('token')

    const [loading, setLoading] = useState(false)

    
    function handleSubmit(e){
        e.preventDefault()
        if(!param.id){
            alert("chưa lấy được thông tin sản phẩm")
        }
        if (!token) {
            alert("Vui lòng đăng nhập")
            navigate('/login')
            return
        }

        const config = {
            headers : {
                'Authorization':'Bearer '+ token,
                'Accept':'application/json'
            }
        }
        axios.get(`http://localhost/laravel8/public/api/user/product/delete/${param.id}`,config)
        .then((res)=>{
            if(res.data.response === "success"){
                console.log("response", res.data)
                alert("Xóa sản phẩm thành công")
                navigate('/account/product/list')
            }
        })
        .catch((error)=>{
            console.log("lỗi update:",error)
        })
        .finally(()=>{
            setLoading(false)
        })
    }
  return (
    <div className="delete-product-page">
        <div className="delete-product-card">

            <div className="delete-product-icon">
                🗑️
            </div>

            <h2 className="delete-product-title">
                Xác nhận xóa sản phẩm
            </h2>

            <p className="delete-product-description">
                Bạn có chắc chắn muốn xóa sản phẩm này
                khỏi danh sách của mình?
            </p>

            <div className="delete-product-info">
                <span>Mã sản phẩm</span>
                <strong>#{param.id}</strong>
            </div>

            <div className="delete-product-warning">
                <span>⚠️</span>
                <p>
                    Hành động này không thể hoàn tác.
                    Sản phẩm sẽ bị xóa khỏi hệ thống.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="delete-product-form"
            >
                <button
                    type="button"
                    className="delete-product-cancel"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                >
                    Quay lại
                </button>

                <button
                    type="submit"
                    className="delete-product-confirm"
                    disabled={loading}
                >
                    {loading ? "Đang xóa..." : "Xác nhận xóa"}
                </button>
            </form>

        </div>
    </div>
  )
}

export default DeleteProduct
