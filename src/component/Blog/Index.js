import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Index() {
    const [data, setData] = useState([]);

    useEffect(()=>{
        axios.get("http://localhost/laravel8/public/api/blog")
        .then((res)=>{
            setData(res.data.blog.data)
            console.log(res.data);
            
        })
        .catch((error)=>{
            console.log(error);
        })
    }, [])
    function renderList(){
        if(data.length>0){
            return data.map((value,index)=>{
                return (
                    <div key={value.id}>
                        <p>Title:{value.title}</p>
                        <p><img src={`http://localhost/laravel8/public/upload/Blog/image/${value.image}`} alt="{value.title}"/></p>
                        <p>Description:{value.description}</p>
                        <Link to = {`/blog/detail/${value.id}`}>
                            Read more
                        </Link>
                    </div>
                )
            })
        }
        return(
            <p>Không có nội dung hiển thị</p>
        )
    }
    


    return (
        <div >
            <h2>Lastest from our Blog</h2>
            {renderList()}
        </div>
    );
}

export default Index;
