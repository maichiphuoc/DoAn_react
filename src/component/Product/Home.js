import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Home() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(()=>{
        let cancelled = false
        setLoading(true)
        axios.get("http://localhost/laravel8/public/api/product")
        .then((res)=>{
            console.log("check dlieu data:",res.data)
            if(res.data.response ==="success"){
                if(Array.isArray(res.data.data)){
                    setProducts(res.data.data)
                }
                else{
                    setProducts([])
                }
            }
        })
        .catch((error)=>{
            if(cancelled){
                return
            }
            console.log("Error:", error)
        })
        .finally(()=>{
            if(!cancelled){
                setLoading(false)
            }
        })
        return () => {
            cancelled = true
        }
    },[])
    function getImage(product){
        try{
            const images = JSON.parse(product.image||[])
            if(!Array.isArray(images) || images.length <0){
                return null
            }
            const fileName = images[0]
            const imageUrl = `http://localhost/laravel8/public/upload/product/${product.id_user}/${encodeURIComponent(fileName)}`

            console.log("Đường dẫn ảnh:", imageUrl)

            return imageUrl
        }
        catch(error){
            console.log("Lỗi ảnh:", error)
            return null
        }
    }
    function handleWishlist(product){
        console.log(product)
        const wishList = JSON.parse(localStorage.getItem('wishList') || '{}')
        
        if(wishList[product.id]){
            //sản phẩm đã có trong wishlist
            return
        }
        
        wishList[product.id] = 1
        
        localStorage.setItem('wishList',JSON.stringify(wishList));
        window.dispatchEvent(new Event("wishListUpdated"));
        console.log(wishList)
    }
  return (
    <section className="feature-products">
            <div className="feature-heading">
                <h2>FEATURES ITEMS</h2>
            </div>

            {loading && (
                <p className="feature-message">Đang tải sản phẩm...</p>
            )}

            {error && (
                <p className="feature-error">{error}</p>
            )}

            {!loading && !error && (
                <div className="feature-grid">
                    {products.length === 0 ? (
                        <p>Không có sản phẩm nào</p>
                    ) : (
                        products.map((product) => (
                            <div
                                className="feature-card"
                                key={product.id}
                            >
                                <div className="feature-card-main">

                                    {/* Nhãn NEW / SALE */}
                                    {Number(product.sale) > 0 ? (
                                        <div className="feature-ribbon sale">
                                            SALE
                                        </div>
                                    ) : Number(product.status) === 1 ? (
                                        <div className="feature-ribbon new">
                                            NEW
                                        </div>
                                    ) : null}

                                    {/* Hình ảnh */}
                                    <div className="feature-image">
                                        {getImage(product) ? (
                                            <img
                                                src={getImage(product)}
                                                alt={product.name}
                                            />
                                        ) : (
                                            <span>Chưa có ảnh</span>
                                        )}
                                    </div>

                                    {/* Thông tin sản phẩm */}
                                    <div className="feature-info">
                                        <h3>
                                            ${Number(product.price).toLocaleString("en-US")}
                                        </h3>

                                        <p>{product.name}</p>

                                        <button
                                            className="feature-cart-btn"
                                            type="button"
                                            disabled
                                        >
                                            <i className="fa fa-shopping-cart"></i>
                                            {" "}Add to cart
                                        </button>
                                    </div>
                                </div>

                                {/* Thanh chức năng dưới cùng */}
                                <div className="feature-bottom">
                                    <button 
                                        to={`/product/wishlist/`}
                                        type="button"
                                        className="feature-wishlist"
                                        onClick={()=> handleWishlist(product)}
                                    >
                                        <i className="fa fa-plus-square"></i>
                                        {" "}Add to wishlist
                                    </button>

                                    <Link
                                        to={`/product/detail/${product.id}`}
                                        className="feature-more"
                                    >
                                        <i className="fa fa-plus-square"></i>
                                        {" "}More
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </section>
  )
}

export default Home
