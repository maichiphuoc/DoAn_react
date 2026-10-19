import axios from "axios";
import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { Rating } from "react-simple-star-rating";

function getRates(blogId){
    return axios.get(`http://localhost/laravel8/public/api/blog/rate/${blogId}`)
    .then((res)=>{
        console.log("get rate: ",res.data)
        console.log("get rate trong:",res.data.data)
        if(Array.isArray(res.data.data)){
            return res.data.data
        }
        if(Array.isArray(res.data)){
            return res.data
        }
        if(res.data.data && typeof res.data.data === "object"){
            return Object.values(res.data.data);
        }
        return []
    })
}

function Rate(props) {
    const {blogId} = props;
    const navigate = useNavigate()
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [listRate, setListRate] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(!blogId){
            return
        }
        let cancelled = false
        getRates(blogId)
        .then((data)=>{
            if(!cancelled){
                setListRate(data)
                console.log("Dữ liệu nhận từ getRates:", data);
                console.log("Có phải Array không:", Array.isArray(data));
            }
        })
        .catch((error)=>{
            console.log(error)
        })
        return () => {
            cancelled = true
        }
    }, [blogId])
    useEffect(()=>{
        if(listRate.length>0){
            const totalRate = listRate.reduce((sum,item)=>{
                return sum + Number(item.rate);
            }, 0)
            const average = totalRate/listRate.length;

            console.log("Tổng số sao:", totalRate);
            console.log("Điểm trung bình:", average);

            setAverageRating(average)
        }
        else{
            console.log("Không có dữ liệu Rate");
            setAverageRating(0)
        }
    },[listRate])
    function handleRating(rate){
        
        const token = localStorage.getItem('token')
        const authLogin = localStorage.getItem('auth')

        let infoAuth = null;
        if(authLogin && authLogin !== "undefined"){
            try{
                infoAuth = JSON.parse(authLogin)
            }catch{
                console.log("Auth không hợp lệ")
            }
        }
        if(!token || !infoAuth || !infoAuth.id){
            alert("VUi lòng đăng nhập")
            navigate('/')
            return
        }
        console.log("Số sao đã chọn:", rate);
        if(loading)
            return
        if (rate < 1 || rate > 5) return;
        setLoading(true)
        let config = {
            headers :{
                'Authorization':'Bearer ' + token,
                'Accept':'application/json'
            }
        }
        
        const formData = new FormData();
        formData.append('user_id', infoAuth.id);
        formData.append('blog_id', blogId);
        formData.append('rate', rate);
            //post rate
        axios.post(`http://localhost/laravel8/public/api/blog/rate/${blogId}`,formData,config)
        .then((res)=>{
            // Kiểm tra lỗi từ Laravel
            if (res.data?.errors) {
                console.log("Chi tiết lỗi Laravel:", res.data.errors);
                throw new Error(JSON.stringify(res.data.errors));
            }

            if (
                res.data?.response === "error" ||
                res.data?.success === "error"
            ) {
                throw new Error("Backend báo lỗi đánh giá");
            }
            setRating(rate)                
            //sau khi post thành công ,get lại rate
            return getRates(blogId)
            .then((data)=>{
                console.log(data)
                setListRate(data)
            })
            .catch((error)=>{
                console.log("Lỗi khi cập nhật rate" + error)
            })
        })
        .catch((error)=>{
            console.log("Lỗi post :" + error.response?.data || error )
        })
        .finally(()=>{
            setLoading(false)
        })
    };

  return (
    <div>
        <Rating
            onClick={handleRating}
            initialValue={averageRating}
            allowFraction
            size={35}
            transition
            readonly={loading}
            fillColor="gold"
            emptyColor="gray"
        />
        
        <p>Đánh giá trung bình: {averageRating.toFixed(1)}/5</p>
    </div>
  );
}

export default Rate
