import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { data, useNavigate } from 'react-router-dom';

function getComments(blogId){
    return axios.get(`http://localhost/laravel8/public/api/blog/detail/${blogId}`)
    .then((res)=>{
        console.log("Toàn bộ response:", res.data);
        console.log("dsach comment:", res.data.data)
        if(Array.isArray(res.data.data.comment)){
            return res.data.data.comment
        }
        else{
            return [];
        }
    },)
}

function Comment(props) {
    const {blogId} = props;
    const navigate = useNavigate();
    const [comment,setComment] = useState(
        {
            id_blog:"",
            id_user:"",
            name_user:"",
            id_comment:0,
            comment:"",
            image_user:"",
        }
    )
    const [listComment, setListComment] = useState([])
    const [error, setError] = useState({})
    const [loading, setLoading] = useState(false);
    // GET comment khi vào trang BlogDetail
    useEffect(()=>{
        if(!blogId){
            return
        }
        let cancelled = false
        getComments(blogId)
        .then((data)=>{
            if(!cancelled){
                setListComment(data)
            }
        })
        .catch((error)=>{
            console.log(error)
        });
        return () =>{
            cancelled = true
        }
    },[blogId])
    
    
    function handleInput(e){
        const nameInput = e.target.name;
        const valueInput = e.target.value;

        setComment(state =>({...state,[nameInput]:valueInput}))
    }
    function handleSubmit(e){
        e.preventDefault();
        const errorSubmit = {}
        let flag = true

        const token = localStorage.getItem('token')
        const authLogin = localStorage.getItem('auth')

        let infoAuth = null;
        if(authLogin && authLogin !== "undefined"){
            try{
                infoAuth = JSON.parse(authLogin)
            }catch{
                console.log("Auth Không hợp lệ")
            }
        }

        if(!token || !infoAuth || !infoAuth.id){
            alert("Vui lòng đăng nhập")
            navigate('/')
            return
        }
        if(comment.comment.trim() ===""){
            errorSubmit.comment = "Vui lòng nhập comment"
            flag = false;
        }
        if(!flag){
            setError(errorSubmit)
            return
        }
        //Xóa lỗi cũ
        setError({});
        console.log("ID comment gửi lên:", comment.id_comment);
        // Config token
        let config = {
            headers:{
                    'Authorization':'Bearer '+ token,
                    'Accept':'application/json'
                }
            }
        if(comment){
                //Dữ liệu gửi API
                const formData = new FormData();
                    formData.append('id_blog', blogId)
                    formData.append('id_user',infoAuth.id)
                    formData.append('name_user',infoAuth.name)
                    formData.append('id_comment',comment.id_comment)
                    formData.append('comment',comment.comment.trim())
                    formData.append('image_user',infoAuth.avatar ?? "")
                //Post comment
                axios.post(`http://localhost/laravel8/public/api/blog/comment/${blogId}`,formData,config)
                .then((res)=>{
                    console.log("post comment:" + res.data)
                    if(res.data?.response === "error" || res.data?.success === "error"){
                        setError({
                            submit:"Gửi bình luận lỗi"
                        });
                        return
                    }
                    //Xóa nội dung input
                    setComment(state => ({...state, 
                        comment:"",
                        id_comment:0
                    }))

                    //GET lại dsach comment
                    getComments(blogId)
                    .then((data)=>{
                        setListComment(data)
                    })
                    .catch((error)=>{
                        console.log("Lỗi cập nhật comment: " + error)
                        setError({
                            submit:"Đã gửi nhưng chưa tải lại dsach"
                        })
                    })
                })
                .catch((error)=>{
                    console.log("Lỗi post :" + error.response?.data || error )
                    setError({
                        submit:"Gửi bình luận thất bại"
                    })
                })
                .finally(()=>{
                    setLoading(false)
                })
            }

        
        
    }
    function renderError(){
        if(Object.keys(error).length>0){
            return Object.keys(error).map((key,index)=>{
                return(
                    <li key={key}>
                        {key}:{error[key]}
                    </li>
                )
            })
        }
    }
function handleReply(id) {
    setComment(state => ({
        ...state,
        id_comment: id,
        
    }));
    console.log("Đang Reply comment ID:", id);

    document.getElementById("commentInput")?.focus();
}
    const parentComments = listComment.filter((value) =>{
        return Number(value.id_comment) === 0;
    })

  
return (
    <div>
        <h2>Danh sách bình luận</h2>

        {parentComments.length > 0 ? (
            parentComments.map((value, index) => {

                // Tìm các bình luận con của bình luận cha hiện tại
                const childComments = listComment.filter((item) => {
                    return Number(item.id_comment) === Number(value.id);
                });

                const date = new Date(value.created_at);

                return (
                    <div key={value.id ?? index}>

                        {/* BÌNH LUẬN CHA */}
                        <div className="comment-item">

                            {/* Avatar */}
                            <div className="comment-avatar">
                                <img
                                    src={
                                        value.image_user
                                            ? `http://localhost/laravel8/public/upload/user/avatar/${value.image_user}`
                                            : "/images/blog/man-one.jpg"
                                    }
                                    alt={value.name_user}
                                />
                            </div>

                            {/* Thông tin bình luận cha */}
                            <div className="comment-content">
                                <div className="comment-info">

                                    <span className="comment-tag">
                                        <i className="fa fa-user"></i>
                                        {value.name_user}
                                    </span>

                                    <span className="comment-tag">
                                        <i className="fa fa-clock-o"></i>
                                        {date.toLocaleTimeString("en-US", {
                                            hour: "numeric",
                                            minute: "2-digit"
                                        })}
                                    </span>

                                    <span className="comment-tag">
                                        <i className="fa fa-calendar"></i>
                                        {date.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric"
                                        }).toUpperCase()}
                                    </span>

                                </div>

                                <p className="comment-text">
                                    {value.comment}
                                </p>

                                <button
                                    type="button"
                                    className="comment-reply"
                                    onClick={() => handleReply(value.id)}
                                >
                                    <i className="fa fa-reply"></i>
                                    REPLY
                                </button>
                            </div>
                        </div>

                        {/* BÌNH LUẬN CON */}
                        {childComments.map((child, childIndex) => {

                            const childDate = new Date(child.created_at);

                            return (
                                <div
                                    key={child.id ?? childIndex}
                                    className="comment-item"
                                    style={{ marginLeft: "50px" }}
                                >

                                    {/* Avatar bình luận con */}
                                    <div className="comment-avatar">
                                        <img
                                            src={
                                                child.image_user
                                                    ? `http://localhost/laravel8/public/upload/user/avatar/${child.image_user}`
                                                    : "/images/blog/man-one.jpg"
                                            }
                                            alt={child.name_user}
                                        />
                                    </div>

                                    {/* Thông tin bình luận con */}
                                    <div className="comment-content">

                                        <div className="comment-info">
                                            <span className="comment-tag">
                                                <i className="fa fa-user"></i>
                                                {child.name_user}
                                            </span>

                                            <span className="comment-tag">
                                                <i className="fa fa-clock-o"></i>
                                                {childDate.toLocaleTimeString("en-US", {
                                                    hour: "numeric",
                                                    minute: "2-digit"
                                                })}
                                            </span>

                                            <span className="comment-tag">
                                                <i className="fa fa-calendar"></i>
                                                {childDate.toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                }).toUpperCase()}
                                            </span>
                                        </div>

                                        <p className="comment-text">
                                            {child.comment}
                                        </p>

                                        <button
                                            type="button"
                                            className="comment-reply"
                                            onClick={() => handleReply(value.id)}
                                        >
                                            <i className="fa fa-reply"></i>
                                            REPLY
                                        </button>

                                    </div>
                                </div>
                            );
                        })}

                    </div>
                );
            })
        ) : (
            <p>Chưa có bình luận nào</p>
        )}

        {/* FORM BÌNH LUẬN */}
        <form onSubmit={handleSubmit}>
            <h2>Viết Bình luận</h2>

            <input
                id="commentInput"
                type="text"
                name="comment"
                value={comment.comment}
                onChange={handleInput}
                placeholder="Nhập bình luận..."
            />

            {/* Hiển thị đang Reply */}
            {comment.id_comment !== 0 && (
                <p>Đang trả lời bình luận của: {comment.id_comment}</p>
            )}

            {/* Nút hủy Reply */}
            {Number(comment.id_comment) !== 0 && (
                <button
                    type="button"
                    onClick={() => {
                        setComment(state => ({
                            ...state,
                            id_comment: 0
                        }));
                    }}
                >
                    Hủy Reply
                </button>
            )}

            {renderError()}

            <button type="submit" disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi"}
            </button>
        </form>
    </div>
    );

}

export default Comment
