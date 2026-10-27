import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

function MyProduct() {
    const [data, setData] = useState([])
    const navigate = useNavigate()
    const auth = localStorage.getItem('auth')
    const infoAuth = JSON.parse(auth)
    const param = useParams()
    console.log(auth)
    console.log(infoAuth)
    console.log("checkkkk",param)

    useEffect(()=>{
        const token = localStorage.getItem('token')
        const auth = localStorage.getItem('auth')
        
        if(!token || !auth){
        navigate('/')
        alert("VUi lòng đăng nhập")
        return;
        }
        const config = {
            headers : {
                Authorization : `Bearer ` + token
            }
        }
        axios.get(`http://localhost/laravel8/public/api/user/my-product`,config)
        .then((res)=>{
            console.log("1",res.data)
            console.log("2",res.data.data)
            if(res.data.data && typeof res.data.data ==="object"){
                console.log(res.data.data)
                console.log(Object.values(res.data.data))
                setData(Object.values(res.data.data))
            }
            else{
                alert("Lấy dữ liệu lỗi")
                return
            }
            // setData(res.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    },[])
    
    
  return (
    <div className="my-product">
            <div className="my-product-table-wrapper">
                <table className="my-product-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((value) => {
                            const images = JSON.parse(value.image)
                            const imageUrl = images && infoAuth?.id
                                ? `http://localhost/laravel8/public/upload/product/${infoAuth.id}/${images[0]}`
                                : ""
                            console.log(images[0])

                            return (
                                <tr key={value.id}>
                                    <td>{value.id}</td>

                                    <td>
                                        <span className="product-name">
                                            {value.name}
                                        </span>
                                    </td>

                                    <td>
                                        {imageUrl ? (
                                            <img
                                                className="product-image"
                                                src={imageUrl}
                                                alt={value.name}
                                            />
                                        ) : (
                                            <span className="no-image">
                                                No image
                                            </span>
                                        )}
                                    </td>

                                    <td className="product-price">
                                        {value.price}
                                    </td>

                                    <td>
                                        <div className="product-actions">
                                            <Link
                                                to={`/account/product/update/${value.id}`}
                                                className="product-add-btn"
                                            >
                                                ✎
                                            </Link>

                                            <Link
                                                to={`/account/product/delete/${value.id}`}
                                                className="product-add-btn"
                                            >
                                                x
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}

                        
                    </tbody>
                </table>
            </div>

            <div className="my-product-footer">
                <Link
                    to="/account/product/add"
                    className="product-add-btn"
                >
                    Add New
                </Link>
            </div>
        </div>
  )
}

export default MyProduct
