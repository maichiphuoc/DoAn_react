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
const initialState = {
    cartCount : getCartCount()
};
const cartSlice = createSlice({
    //hiển thị ở dispatch type : name + '/' + tênReducer
    name : 'cart',
    //giá trị ban đầu khi redux store được khởi tạo, dùng để hiển thị trước khi mà cập nhật số lượng sản phẩm
    initialState,

    reducers: {
        //cập nhật tổng số lượng sp
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