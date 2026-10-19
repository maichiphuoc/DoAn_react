import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Comment from './Comment';
import Rate from './Rate';

function Detail() {
    const [data, setData] = useState(null)
    const params = useParams();
    const navigate = useNavigate()
    console.log(params);
    useEffect(()=>{
        axios.get(`http://localhost/laravel8/public/api/blog/detail/${params.id}`)
        .then((res)=>{
          console.log(res.data.data)
            setData(res.data.data)
        })
        .catch((error)=>{
          console.log(error)
        })
    }, [params.id])
    function handlePre(){
      const id = Number(params.id)-1;
        if(id>=1){
          navigate(`/blog/detail/${id}`)
        }
        else{
          return;
        }
    }
    function handleNext(){
      const id = Number(params.id)+1;
        if(Number.isInteger(id) && id >=1){
          axios.get(`http://localhost/laravel8/public/api/blog/detail/${id}`)
          .then((res)=>{
            if(res.data.data){
              navigate(`/blog/detail/${id}`)

            }
          })
          .catch((error)=>{
            console.log(error)
          })
        }
    }
    function renderDetail(){
      if(data){
        return (
          <div>
            <p>TiTle:{data.title}</p>
            <p><img src={`http://localhost/laravel8/public/upload/Blog/image/${data.image}`} alt=''/></p>
            <p>Description:{data.description}</p>
            <ul className="pager pull-right" >
                <li>
                    <button type="button" onClick={handlePre}>
                        Pre
                    </button>
                </li>

                <li>
                    <button type="button" onClick={handleNext}>
                        Next
                    </button>
                </li>
            </ul>
            <p>Rate this item</p>
            <Rate blogId= {params.id}/>
            <Comment blogId = {params.id}/>
          </div>
          
        )
      }
    }
    
  return (
    <div>
      {renderDetail()}
    </div>
  )
}

export default Detail
