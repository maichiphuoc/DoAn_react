import { createContext, useEffect, useState } from "react";


export const AppContext = createContext();

export const AppProvider = ({ children }) =>{
    const [cart, setCart] = useState(0)
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
    
    return <AppContext.Provider value={cart}>
        {children}
    </AppContext.Provider>
}