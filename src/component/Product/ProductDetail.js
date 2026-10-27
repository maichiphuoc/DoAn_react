import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Carousel from "react-multi-carousel";
import { createPortal } from "react-dom";


function ProductDetail() {
    const param = useParams();
    const navigate = useNavigate()

    const [data, setData] = useState(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [quantity, setQuantity] = useState("1");

    // Ảnh đang được chọn
    const [selectedImage, setSelectedImage] = useState(0);

    // Trạng thái Modal
    const [showZoom, setShowZoom] = useState(false);

    //lấy ttin sản phẩm theo id url
    useEffect(()=>{
        let cancelled = false

        if(!param.id){
            return
        }

        const token = localStorage.getItem('token')
        const infoAuth = JSON.parse(localStorage.getItem('auth'))
        if(!token ||!infoAuth){
            alert("Không tìm thấy sản phẩm")
            return
        }
        const config = {
            headers : {
                Authorization: `Bearer ${token}`
            }
        }
        setData(null)
        setLoadingProduct(true)
        setQuantity("1");

        axios.get(`http://localhost/laravel8/public/api/product/detail/${param.id}`,config)
        .then((res)=>{
            if(cancelled){
                return
            }
            console.log(res.data)

            const product = res.data.data
            //log ra xem có phải thành mảng không
            console.log("dsach sản phẩm:",product)

            //tìm sản phẩm có id trùng với param.id
            if (product && String(product.id) === String(param.id)) {
                setData(product)
            } else {
                alert("Không tìm thấy sản phẩm")
            }
            //kiểm tra xem ttin sản phẩm đúng không
            console.log("sản phẩm cần sửa theo id trùng param.id",product)
        })
        .catch((error)=>{
            if(cancelled){
                return
            }
            console.log("lỗi lấy spham:",error)
        })
        .finally(()=>{
        if(!cancelled){
            setLoadingProduct(false)
            }
        })
        return () => {
            cancelled = true
        }
    },[param.id, navigate])
    // Lấy tối đa 3 ảnh sản phẩm
    function getImages(product) {
        if (!product) return [];

        try {
            let images = product.image || [];

            if (typeof images === "string") {
                images = JSON.parse(images);
            }

            if (!Array.isArray(images) || images.length === 0) {
                return [];
            }

            return images
                .filter(fileName => typeof fileName === "string" && fileName)
                .slice(0, 3)
                .map((fileName) => {
                    return `http://localhost/laravel8/public/upload/product/${product.id_user}/${encodeURIComponent(fileName)}`;
                });

        } catch (error) {
            console.log("Lỗi xử lý ảnh:", error);
            return [];
        }
    }

    const images = getImages(data);

    // Ảnh lớn hiện tại
    const currentImage = images[selectedImage] || null;
    // Đóng Modal khi nhấn Escape
    useEffect(() => {
        if (!showZoom) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                setShowZoom(false);
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [showZoom]);

    // Cấu hình carousel
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: Math.max(1, Math.min(3, images.length)),
            slidesToSlide: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 600 },
            items: 2,
            slidesToSlide: 1
        },
        mobile: {
            breakpoint: { max: 600, min: 0 },
            items: 1,
            slidesToSlide: 1
        }
    };

    // Chọn ảnh nhỏ
    function handleSelectImage(index) {
        setSelectedImage(index);
    }

    // Mở Modal
    function handleZoom() {
        if (images.length > 0) {
            setShowZoom(true);
        }
    }

    // Đóng Modal
    function handleCloseZoom() {
        setShowZoom(false);
    }

    // Chuyển ảnh trong Modal
    function handleChangeImage(direction) {
        setSelectedImage((previous) => {
            return (
                previous + direction + images.length
            ) % images.length;
        });
    }
    // Nhãn SALE hoặc NEW
    function getProductBadge(product) {
        if (Number(product.sale) > 0) {
            return `SALE ${product.sale}%`;
        }

        if (Number(product.status) === 1) {
            return "NEW";
        }

        return null;
    }
    function handleQuantity(e) {
        setQuantity(e.target.value);
    }

    function handleQuantityBlur() {
        const value = Number(quantity);

        if (!Number.isFinite(value)) {
            setQuantity("1");
            return;
        }

        const validQuantity = Math.min(
            99,
            Math.max(1, Math.trunc(value))
        );

        setQuantity(String(validQuantity));
    }
    function handleAddToCart(){
        if(!data)
            return
        const qty = Math.max(1, Number(quantity) || 1);

        let cart

        try{
            cart = JSON.parse(localStorage.getItem('cart')||'{}');
            if(!cart || typeof cart !== "object" || Array.isArray(cart)){
                cart = {};
            }
        }
        catch(error){
            cart = {}
        }
        //Lấy id sản phẩm hiện tại, chuyển id sản phẩm thành key
        const productId = String(data.id)

        //lấy số lượng hiện tại
        const currentQuantity = Number(cart[productId] || 0)

        //Nếu có thì cộng thêm vào
        cart[productId] = currentQuantity + qty;

        //Lưu lại vào local
        localStorage.setItem("cart", JSON.stringify(cart));
        // Báo cho AppContext cập nhật số lượng trên Head
        window.dispatchEvent(new Event("cartUpdated"));
        console.log("Giỏ hàng", cart)

        alert("Đã thêm sản phẩm vào giỏ")
    }
    function renderDetail(){
        if (loadingProduct) {
        return <p>Đang tải thông tin sản phẩm...</p>
        }

        if (!data) {
            return <p>Không tìm thấy sản phẩm</p>
        }
        const badge = getProductBadge(data);
        if(data){
            
            return(
                <div className="pd-container">
                <div className="pd-layout">

                    {/* =================================
                        BÊN TRÁI: GALLERY
                    ================================= */}
                    <div className="pd-gallery">

                        {/* ẢNH LỚN */}
                        <div className="pd-main-image">
                            {currentImage ? (
                                <>
                                    <img
                                        src={currentImage}
                                        alt={data.name}
                                        onClick={handleZoom}
                                    />

                                    <button
                                        type="button"
                                        className="pd-zoom-button"
                                        onClick={handleZoom}
                                    >
                                        ZOOM
                                    </button>
                                </>
                            ) : (
                                <div className="pd-no-image">
                                    Chưa có ảnh sản phẩm
                                </div>
                            )}
                        </div>

                        {/* 3 ẢNH NHỎ */}
                        {images.length > 0 && (
                            <div className="pd-thumbnail-section">

                                {/* NÚT TRÁI */}
                                {images.length > 1 && (
                                    <button
                                        type="button"
                                        className="pd-thumb-arrow pd-thumb-prev"
                                        onClick={() => handleChangeImage(-1)}
                                        aria-label="Ảnh trước"
                                    >
                                        &#10094;
                                    </button>
                                )}

                                {/* CAROUSEL */}
                                <Carousel
                                    responsive={responsive}
                                    arrows={false}
                                    infinite={false}
                                    autoPlay={false}
                                    showDots={false}
                                    swipeable={true}
                                    draggable={true}
                                    containerClass="pd-carousel"
                                    itemClass="pd-carousel-item"
                                >
                                    {images.map((image, index) => (
                                        <button
                                            type="button"
                                            key={index}
                                            className={
                                                selectedImage === index
                                                    ? "pd-thumbnail active"
                                                    : "pd-thumbnail"
                                            }
                                            onClick={() =>
                                                handleSelectImage(index)
                                            }
                                        >
                                            <img
                                                src={image}
                                                alt={`${data.name} ${index + 1}`}
                                            />
                                        </button>
                                    ))}
                                </Carousel>

                                {/* NÚT PHẢI */}
                                {images.length > 1 && (
                                    <button
                                        type="button"
                                        className="pd-thumb-arrow pd-thumb-next"
                                        onClick={() => handleChangeImage(1)}
                                        aria-label="Ảnh tiếp theo"
                                    >
                                        &#10095;
                                    </button>
                                )}

                            </div>
                        )}
                    </div>

                    {/* =================================
                        BÊN PHẢI: PRODUCT INFORMATION
                    ================================= */}
                    <div className="pd-info">

                        {/* NHÃN SALE / NEW */}
                        {badge && (
                            <span className="pd-badge">
                                {badge}
                            </span>
                        )}

                        <div className="pd-info-content">

                            {/* TÊN SẢN PHẨM */}
                            <h2 className="pd-name">
                                {data.name}
                            </h2>

                            {/* WEB ID */}
                            <p className="pd-web-id">
                                Web ID: {data.web_id || data.id}
                            </p>


                            {/* GIÁ - QUANTITY - ADD TO CART */}
                            <div className="pd-buy-section">

                                {/* GIÁ */}
                                <span className="pd-price">
                                    US ${Number(data.price).toLocaleString("en-US")}
                                </span>

                                {/* SỐ LƯỢNG */}
                                <div className="pd-quantity">
                                    <label htmlFor="product-quantity">
                                        Quantity:
                                    </label>

                                    <input
                                        id="product-quantity"
                                        type="number"
                                        min="1"
                                        max="99"
                                        value={quantity}
                                        onChange={handleQuantity}
                                        onBlur={handleQuantityBlur}
                                    />
                                </div>

                                {/* NÚT GIỎ HÀNG - CHỈ GIAO DIỆN */}
                                <button
                                    type="button"
                                    className="pd-add-cart"
                                    onClick={handleAddToCart}
                                >
                                    🛒 Add to cart
                                </button>

                            </div>

                            {/* THÔNG TIN KHÁC */}
                            <div className="pd-product-specs">

                                <p>
                                    <strong>Availability:</strong>{" "}
                                    {data.quantity == null
                                        ? "Chưa cập nhật"
                                        : Number(data.quantity) > 0
                                            ? "In Stock"
                                            : "Out of Stock"}
                                </p>

                                <p>
                                    <strong>Condition:</strong>{" "}
                                    {data.condition ?? "Chưa cập nhật"}
                                </p>

                                <p>
                                    <strong>Brand:</strong>{" "}
                                    {data.brand?.name ??
                                        data.brand ??
                                        `Mã ${data.id_brand}`}
                                </p>

                                <p>
                                    <strong>Category:</strong>{" "}
                                    {data.category?.name ??
                                        data.category ??
                                        `Mã ${data.id_category}`}
                                </p>

                                <p>
                                    <strong>Sale:</strong>{" "}
                                    {data.sale ?? 0}%
                                </p>

                                <p>
                                    <strong>Seller ID:</strong>{" "}
                                    {data.id_user}
                                </p>

                                <p>
                                    <strong>Company Profile ID:</strong>{" "}
                                    {data.company_profile ?? "Chưa cập nhật"}
                                </p>

                            </div>

                            {/* MÔ TẢ */}
                            <div className="pd-description">
                                <h3>Product Description</h3>

                                <p>
                                    {data.detail || "Chưa có mô tả sản phẩm"}
                                </p>
                            </div>

                        </div>
                    </div>

                </div>

                {/* =================================
                    MODAL THUẦN REACT + CSS
                    KHÔNG DÙNG BOOTSTRAP
                ================================= */}
                {showZoom && createPortal(
                    <div className="pd-zoom-overlay">

                        {/* LỚP NỀN TỐI */}
                        <button
                            type="button"
                            className="pd-zoom-backdrop"
                            onClick={handleCloseZoom}
                            aria-label="Đóng xem ảnh"
                        />

                        {/* KHUNG MODAL */}
                        <div
                            className="pd-zoom-content"
                            role="dialog"
                            aria-modal="true"
                            aria-label={`Ảnh sản phẩm ${data.name}`}
                        >

                            {/* HEADER */}
                            <div className="pd-zoom-header">
                                <h3>{data.name}</h3>

                                <button
                                    type="button"
                                    className="pd-zoom-close"
                                    onClick={handleCloseZoom}
                                    aria-label="Đóng"
                                    autoFocus
                                >
                                    &times;
                                </button>
                            </div>

                            {/* ẢNH FULL */}
                            <div className="pd-modal-gallery">

                                {images.length > 1 && (
                                    <button
                                        type="button"
                                        className="pd-modal-prev"
                                        onClick={() =>
                                            handleChangeImage(-1)
                                        }
                                        aria-label="Ảnh trước"
                                    >
                                        &#10094;
                                    </button>
                                )}

                                {currentImage && (
                                    <img
                                        src={currentImage}
                                        alt={data.name}
                                        className="pd-full-image"
                                    />
                                )}

                                {images.length > 1 && (
                                    <button
                                        type="button"
                                        className="pd-modal-next"
                                        onClick={() =>
                                            handleChangeImage(1)
                                        }
                                        aria-label="Ảnh tiếp theo"
                                    >
                                        &#10095;
                                    </button>
                                )}

                            </div>

                            {/* SỐ THỨ TỰ ẢNH */}
                            <p className="pd-modal-counter">
                                Ảnh {selectedImage + 1} / {images.length}
                            </p>
                        </div>

                    </div>,
                    document.body
                )}

            </div>
            )
        }
    }
  return (
    <div  className="product-detail-page">
      {renderDetail()}
    </div>
  )
}

export default ProductDetail
