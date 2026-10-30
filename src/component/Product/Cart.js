
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateCartCount } from '../../Redux/cartSlice';

function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    //Đọc giỏ hàng tử local
    function getLocalCart(){
        try{
            const savedCart = JSON.parse(localStorage.getItem('cart')||'{}')
            console.log("Giỏ hàng trong localStorage:", savedCart);
            if (!savedCart ||typeof savedCart !== 'object' ||Array.isArray(savedCart)) {
                    return [];
                }

            return Object.entries(savedCart)
                .filter(([productId, quantity]) =>
                    productId !== '' &&
                    Number.isFinite(Number(quantity)) &&
                    Number(quantity) > 0
                )
                .map(([productId, quantity]) => ({
                    product_id: productId,
                    quantity: Number(quantity)
                }));
                    
        }
        catch(error){
            console.log("lỗi giỏ hàng", error)
            return []
        }
    }
    //Lấy ttin sản phẩm từ api 
    useEffect(()=>{
        let cancelled = false
        setLoading(true);
        const token = localStorage.getItem('token')
        const cart = getLocalCart();

        if(!token){
            alert('Vui lòng đăng nhập');
            navigate('/')
            return() =>{
                cancelled = true;
            }
        }
        if(cart.length ===0){
            setProducts([]);
            setLoading(false)

            return () =>{
                cancelled = true;
            }
        }
        const config = {
            headers :{
                Authorization :`Bearer ${token}`
            }
        };
        const cartData = {};

        cart.forEach((item) => {
            cartData[item.product_id] = Number(item.quantity);
        });

        console.log("Dữ liệu gửi lên API:", cartData);

        axios.post(
            'http://localhost/laravel8/public/api/product/cart',
            cartData,
            config
        )
        .then((res)=>{
            if(cancelled){
                return
            }
            //lấy danh sách sản phẩm API trả về
            const apiProducts = res.data.data;
            console.log("Toàn bộ dữ liệu API:", res.data);
            console.log("Danh sách sản phẩm API:", apiProducts);    

            if(!Array.isArray(apiProducts)){
                console.log("Api không trả về danh sách mảng")
                setProducts([]);
                return;
            }
            //ghép số lượng trong local với ttin api
            const cartProducts = apiProducts.map((product) => ({
                ...product,
                quantity: Number(product.qty ?? product.quantity ?? 1)
            }));
                
            setProducts(cartProducts)
            console.log("Sản phẩm sau khi ghép:", cartProducts);
        })
        .catch((error)=>{
            console.log('Lỗi lấy giỏ hàng:', error);

            if (!cancelled) {
                setProducts([]);
            }
        })
        .finally(()=>{
            if(!cancelled){
                setLoading(false);
            }
        })
        return () =>{
            cancelled = true
        }
    },[navigate])

    //Lưu giỏ hàng mới vào local
    function savedCart(updatedProducts){
        const cartData = {};

        updatedProducts.forEach(product => {
            cartData[String(product.id)] = Number(product.quantity);
        });
        localStorage.setItem('cart', JSON.stringify(cartData))
        console.log("giỏ hàng mới sau khi lưu vào local :",cartData)
        // Báo cho AppContext cập nhật số lượng
        window.dispatchEvent(new Event("cartUpdated"));

        //Dispatch redux cập nhật số lượng
        const total = Object.values(cartData).reduce(
            (sum, quantity) => sum + Number(quantity ||0),
            0
        )
        //Gọi action creator và gửi action đến store
        dispatch(updateCartCount(total))
        //check
        console.log("Check redux: ",updateCartCount(total))
    }
    function handleQuantity(productId, change) {
        const updatedProducts = products.map(product => {
            if (String(product.id) !== String(productId)) {
                return product;
            }

            const newQuantity = Math.min(
                99,
                Math.max(1, product.quantity + change)
            );

            return {
                ...product,
                quantity: newQuantity
            };
        });

        setProducts(updatedProducts);
        console.log("Giỏ hàng sau khi thêm bớt: ",updatedProducts)
        savedCart(updatedProducts);
    }
    //Xóa sản phẩm khỏi giỏ
    function handleRemove(productId){
        const updatedProducts = products.filter(
            product => String(product.id) !== String(productId)
        );
        setProducts(updatedProducts)
        console.log("THông tin sản phẩm còn lại sau khi xóa: ",setProducts)
        savedCart(updatedProducts)
        console.log("Giỏ hàng còn lại sau khi xóa :",savedCart)
    }
    //Tổng số lương sản phẩm
    const totalQuantity = products.reduce(
        (sum, product) => sum + product.quantity,
        0
    )
    //Tổng tiền
    const totalPrice = products.reduce(
        (sum, product) => sum + Number(product.price || 0) * product.quantity,
        0
    )
    //Xử lí hình ảnh
    function getImage(product){
        try{
            let images = product.image || [];
            if(typeof images ==="string"){
                try {
                    images = JSON.parse(images);
                } catch {
                    images = [images];
                }
            }
            if(!Array.isArray(images)|| images.length ===0){
                return "";
            }
            const image = images[0]

            if(typeof image !== "string"|| !image){
                return "";
            }
            return `http://localhost/laravel8/public/upload/product/${product.id_user}/${encodeURIComponent(image)}`;
        }
        catch(error){
            console.log('Lỗi xử lý ảnh:', error);
            return '';
        }
    }
    // Định dạng giá tiền
    function formatPrice(price) {
        return Number(price || 0).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    }

    // Checkout: bổ sung xử lý thanh toán sau
    function handleCheckout() {
        if (products.length === 0) {
            alert('Giỏ hàng đang trống!');
            return;
        }

        navigate('product/cart/checkout');
    }

    if (loading) {
        return <p>Đang tải giỏ hàng...</p>;
    }

    return (
         <div className="cart-page">

            {/* Breadcrumb */}
            <div className="cart-breadcrumb">
                <a href="/">Home</a>
                <span>Shopping Cart</span>
            </div>

            {/* Bảng giỏ hàng */}
            <div className="cart-container">
                <table className="cart-table">
                    <thead>
                        <tr>
                            <th colSpan="2">Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="cart-empty">
                                    Giỏ hàng của bạn đang trống.
                                </td>
                            </tr>
                        ) : (
                            products.map(product => (
                                <tr key={product.id}>
                                    {/* Ảnh sản phẩm */}
                                    <td className="cart-image">
                                        {getImage(product) ? (
                                            <img
                                                src={getImage(product)}
                                                alt={product.name}
                                            />
                                        ) : (
                                            <span>Không có ảnh</span>
                                        )}
                                    </td>

                                    {/* Tên và ID */}
                                    <td className="cart-product">
                                        <h3>{product.name}</h3>
                                        <p>
                                            Web ID: {
                                                product.web_id || product.id
                                            }
                                        </p>
                                    </td>

                                    {/* Giá đơn vị */}
                                    <td className="cart-price">
                                        {formatPrice(product.price)}
                                    </td>

                                    {/* Tăng giảm số lượng */}
                                    <td className="cart-quantity">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleQuantity(product.id, 1)
                                            }
                                            aria-label="Tăng số lượng"
                                        >
                                            +
                                        </button>

                                        <input
                                            type="number"
                                            min="1"
                                            max="99"
                                            value={product.quantity}
                                            onChange={e => {
                                                const value = Number(
                                                    e.target.value
                                                );

                                                if (
                                                    Number.isInteger(value) &&
                                                    value >= 1 &&
                                                    value <= 99
                                                ) {
                                                    setProducts(previous =>
                                                        previous.map(item =>
                                                            String(item.id) ===
                                                            String(product.id)
                                                                ? {
                                                                    ...item,
                                                                    quantity: value
                                                                }
                                                                : item
                                                        )
                                                    );

                                                    const cart = getLocalCart();
                                                    const updatedCart = cart.map(
                                                        item =>
                                                            String(item.product_id) ===
                                                            String(product.id)
                                                                ? {
                                                                    ...item,
                                                                    quantity: value
                                                                }
                                                                : item
                                                    );

                                                    localStorage.setItem(
                                                        'cart',
                                                        JSON.stringify(updatedCart)
                                                    );
                                                }
                                            }}
                                            onBlur={e => {
                                                const value = Number(
                                                    e.target.value
                                                );

                                                const validQuantity = Math.min(
                                                    99,
                                                    Math.max(
                                                        1,
                                                        Math.trunc(value) || 1
                                                    )
                                                );

                                                const updatedProducts =
                                                    products.map(item =>
                                                        String(item.id) ===
                                                        String(product.id)
                                                            ? {
                                                                ...item,
                                                                quantity: validQuantity
                                                            }
                                                            : item
                                                    );

                                                setProducts(updatedProducts);
                                                savedCart(updatedProducts);
                                            }}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleQuantity(product.id, -1)
                                            }
                                            aria-label="Giảm số lượng"
                                        >
                                            -
                                        </button>
                                    </td>

                                    {/* Thành tiền từng sản phẩm */}
                                    <td className="cart-total">
                                        {formatPrice(
                                            Number(product.price || 0) *
                                            product.quantity
                                        )}
                                    </td>

                                    {/* Xóa sản phẩm */}
                                    <td className="cart-remove">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemove(product.id)
                                            }
                                            aria-label="Xóa sản phẩm"
                                        >
                                            &times;
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Tổng kết */}
            <div className="cart-summary">
                <div className="summary-row">
                    <span>Quantity</span>
                    <span>{totalQuantity}</span>
                </div>

                <div className="summary-row summary-total">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                </div>

                <button
                    type="button"
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={products.length === 0}
                >
                    Checkout
                </button>
            </div>

        </div>
    );
}

export default Cart;
