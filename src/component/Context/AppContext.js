import { createContext, useEffect, useState } from "react";


export const AppContext = createContext();

export const AppProvider = ({ children }) =>{
    const [cart, setCart] = useState(0)
    const [cartWishlist, setCartWishlist] = useState(0)
    //lấy api ra cập nhật giỏ hàng
    useEffect(()=>{
        function updatedCart(){
            const savedCart = JSON.parse(localStorage.getItem('cart')||"{}")
            let total = 0
            if(savedCart && typeof savedCart === "object" && !Array.isArray(savedCart)){
                total = Object.values(savedCart).reduce(
                    (sum, item) => sum + Number(item || 0),
                    0
                )
            }
            setCart(total)
        }
        updatedCart();

        // Lắng nghe sự kiện cập nhật giỏ hàng
        window.addEventListener("cartUpdated", updatedCart);

        return () => {
            window.removeEventListener("cartUpdated", updatedCart);
            };
        
    },[]);
    //lấy api cập nhật wishlist
    useEffect(()=>{
        function updatedWishlist(){
            const savedWishlist = JSON.parse(localStorage.getItem('wishList'))
            let total = 0
            if(savedWishlist && typeof savedWishlist === "object" && !Array.isArray(savedWishlist)){
                total = Object.values(savedWishlist).reduce(
                    (sum, item) => sum + Number(item ||0),
                    0
                )
            }
            setCartWishlist(total);
        }
        updatedWishlist();
        // Lắng nghe sự kiện cập nhật giỏ hàng
        window.addEventListener("wishListUpdated", updatedWishlist);

        return () => {
            window.removeEventListener("wishListUpdated", updatedWishlist);
            };
    },[])
    
    return <AppContext.Provider value={{cart, cartWishlist}}>
        {children}
    </AppContext.Provider>
}