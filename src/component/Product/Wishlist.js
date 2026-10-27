import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
function Wishlist() {
    const [data,setData] = useState([])
    const [wishList, setWishList] = useState(() => {
    return JSON.parse(localStorage.getItem("wishList") || "{}");
});
    console.log("kiểu dữ liệu", wishList)
    //lấy danh sách sản phẩm rồi lọc theo wishlist
    useEffect(()=>{
        let cancelled = false
        axios.get(
            "http://localhost/laravel8/public/api/product/wishlist"
        )
        .then((res)=>{
            if(cancelled)
                return;
            console.log("check api", res.data.data)
            const products = res.data.data
            if(!Array.isArray(products)){
                setData([])
                return
            }
            const dataWishList = products.filter((item)=>{
                return wishList[item.id] !== undefined;
            })
            console.log("sau khi lọc",dataWishList)
            setData(dataWishList)
        })
        .catch((error)=>{
            if(cancelled)
                return
            console.log("Lỗi lấy wishlist,", error)
        })
        return () =>{
            cancelled = true
        }
    },[wishList])
    //thêm sản phẩm vào wishlist
    function handleAddToWishList(product){
        const cart = JSON.parse(localStorage.getItem('cart')||"{}")
        if(cart[product.id]){
            cart[product.id] += 1
        }
        else{
            cart[product.id] = 1
        }
        localStorage.setItem('cart',JSON.stringify(cart))
        window.dispatchEvent(new Event("wishListUpdated"));
        console.log("Cart:", cart);
    }
    //Xóa sản phẩm khỏi wishlist
    function handleDeleteWishlist(id){
        const newWishList = {...wishList}

        //xóa id sản phẩm khỏi wishlist
        delete newWishList[id];

        localStorage.setItem('wishList',JSON.stringify(newWishList))
        window.dispatchEvent(new Event("wishListUpdated"));

        setWishList(newWishList)

        //Xóa sản phẩm khỏi giao diện
        setData((currentData)=>
            currentData.filter(
                (product) => Number(product.id) !== Number(id)
            )
        );
    }
    // Lấy ảnh đầu tiên
    function getImage(product) {
        try {
            const listImage = Array.isArray(product.image)
                ? product.image
                : JSON.parse(product.image || "[]");

            if (
                !Array.isArray(listImage) ||
                listImage.length === 0
            ) {
                return null;
            }

            return `http://localhost/laravel8/public/upload/product/${product.id_user}/${encodeURIComponent(listImage[0])}`;
        } catch (error) {
            console.log("Lỗi ảnh:", error);
            return null;
        }
    }
  
 
    return (
        <section className="feature-products">
            <div className="feature-heading">
                <h2>MY WISHLIST</h2>
            </div>

            {data.length === 0 ? (
                <p className="feature-message">
                    Chưa có sản phẩm yêu thích.
                </p>
            ) : (
                <div className="feature-grid">
                    {data.map((product) => (
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
                                        ${Number(
                                            product.sale > 0
                                                ? product.price *
                                                (1 - Number(product.sale) / 100)
                                                : product.price
                                        ).toLocaleString("en-US")}
                                    </h3>

                                    <p>{product.name}</p>

                                    <button
                                        className="feature-cart-btn"
                                        type="button"
                                        onClick={() => handleAddToWishList(product)}
                                    >
                                        <i className="fa fa-heart"></i>
                                        {" "}Add to wishlist
                                    </button>
                                </div>
                            </div>

                            {/* Thanh chức năng dưới cùng */}
                            <div className="feature-bottom">
                                <button
                                    type="button"
                                    className="feature-wishlist"
                                    onClick={() =>
                                        handleDeleteWishlist(product.id)
                                    }
                                >
                                    <i className="fa fa-trash"></i>
                                    {" "}Remove from wishlist
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
                    ))}
                </div>
            )}
        </section>
    );

}
export default Wishlist;