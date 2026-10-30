import { createSlice } from "@reduxjs/toolkit";

function getCartCount(){
    try{
        const cart = JSON.parse(localStorage.getItem('cart')||'{}')
        if(!cart || typeof cart !== "object" || Array.isArray(cart)){
            return 0;
        }
        return Object.values(cart).reduce(
            (total ,quantity) => total + Number(quantity ||0),
            0
        );
    }
    catch(error){
        return 0;
    }
}
// initialState được dùng khi mà redux store khởi tạo
// không chạy lạy mỗi lần dispatch()
const initialState = {
    cartCount : getCartCount()
};
const cartSlice = createSlice({
    //hiển thị ở dispatch type : name + '/' + tênReducer
    name : 'cart',
    //Gán State ban đầu cho slice
    //Redux store sử dụng state này khi khởi tạo
    initialState,

    //reducers: Khai báo những hàm có nhiệm vụ thay đổi State.
    reducers: {
        //cập nhật tổng số lượng sp
        //updateCartCount là tên Reducer
        updateCartCount: (state, action) =>{
            state.cartCount = Number(action.payload) || 0;
        },

        //Đưa số lượng sản phẩm về 0
        resetCartCount : (state) =>{
            state.cartCount = 0;
        }
    }
})

//Tự động tạo action và export ra cho các component dùng
export const { updateCartCount , resetCartCount } = cartSlice.actions;

//Xuất reducer
export default cartSlice.reducer;