import { configureStore } from '@reduxjs/toolkit';
//reducer xử lí các action liên quan đến giỏ hàng
import cartReducer from './cartSlice';
const store = configureStore({
    //Khi mà component muốn lấy dùng thì dùng useSelector((state) => state.cart.cartCount)
    reducer : {
        cart : cartReducer
    }
})

export default store