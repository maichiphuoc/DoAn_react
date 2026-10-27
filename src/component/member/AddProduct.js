
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddProduct() {
  const navigate = useNavigate()

  const [inputs, setInputs] = useState({
    category: "",
    brand: "",
    name: "",
    price: "",
    status: "1",
    sale: "0",
    detail: "",
    company: ""
  })

  const [files, setFiles] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  //Chuyển dữ liệu API thành mảng
  function toArray(value){
    if(Array.isArray(value)){
      return value
    }
    if(Array.isArray(value?.data)){
      return value.data
    }
    if(value && typeof value === "object"){
      return Object.values(value)
    }
    return []
  }

  //lấy category và brand từ api
  useEffect(()=>{
    let cancelled = false
    axios.get('http://localhost/laravel8/public/api/category-brand')
    .then((res)=>{
      if(cancelled){
        return
      }
      console.log(" check category Brand:", res.data)
      const data = res.data.data ?? res.data
      setCategories(toArray(data.category))
      setBrands(toArray(data.brand))
    })
    .catch((error)=>{
      console.log(error)
    })
    return () => {
      cancelled = true
    }

  },[])

  function handleInput(e){
    const nameInput = e.target.name;
    const valueInput = e.target.value;

    setInputs(state =>({...state,[nameInput]:valueInput,
      ...(nameInput === "status" && valueInput ==="1" ? {sale :"0"} : {})
    }))
  }
  function handleFile(e){
    const selectedFiles = Array.from(e.target.files);
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp"
    ]
    let error = ""
    if(selectedFiles.length >3){
      error = "Chỉ được chọn tối đa 3 ảnh"
    }
    else if(selectedFiles.some(file =>
      !allowedTypes.includes(file.type)
    )){
      error = "Chỉ được chọn file hình ảnh JPG, PNG, GIF, WEBP"
    }
    else if(
      selectedFiles.some(file =>
        file.size >= 1024 * 1024
      )
    ){
      error = "Mỗi hình ảnh phải nhỏ hơn 1MB"
    }
    if(error){
      setFiles([])
      setErrors(state =>({...state,image : error}))
      e.target.value = ""
      return
    }
    setFiles(e.target.files)
    setErrors(state =>({...state,image : ""}))
  }

  function validateForm() {
    const errorSubmit = {}
    if(inputs.name ===""){
      errorSubmit.name = "Vui lòng nhập tên sản phẩm"
    }
    if(inputs.price ===""|| !Number.isInteger(Number(inputs.price))||Number(inputs.price)<=0){
      errorSubmit.price = "Giá phải là số nguyên và lớn hơn 0"
    }
    if(inputs.category ===""){
      errorSubmit.category = "Vui lòng chọn category"
    }
    if(inputs.brand ===""){
      errorSubmit.brand = "Vui lòng chọn brand"
    }
    if(inputs.status ==="0"){
      const sale = Number(inputs.sale)

      if(inputs.sale ===""||!Number.isInteger(sale)||sale <0 || sale > 100){
        errorSubmit.sale = "Sale phải từ 0-100"
      }
    }
    if(files.length === 0){
      errorSubmit.image = "Vui lòng chọn hình ảnh"
    }
    if (inputs.company.trim() === "") {
      errorSubmit.company = "Vui lòng nhập Company"
    }

    if (inputs.detail.trim() === "") {
      errorSubmit.detail = "Vui lòng nhập Detail"
    }
    return errorSubmit
  }

  //Gửi dữ liệu qua API
  function handleSubmit(e){
    e.preventDefault()
    const errorSubmit = validateForm()
    setErrors(errorSubmit)
    if(Object.keys(errorSubmit).length>0){
      return
    }
    const token = localStorage.getItem("token")

    if (!token) {
      alert("Vui lòng đăng nhập")
      navigate("/login")
      return
    }
    let config = {
      headers: {
        'Authorization':'Bearer '+ token,
        'Content-Type':'multipart/form-data',
        'Accept':'application/json'
      }
    }
    const formData = new FormData()

    formData.append("category", inputs.category)
    formData.append("brand", inputs.brand)
    formData.append("name", inputs.name.trim())
    formData.append("price", inputs.price)
    formData.append("status", inputs.status)
    formData.append(
      "sale",
      inputs.status === "0" ? inputs.sale : "0"
    )
    formData.append("detail", inputs.detail.trim())
    formData.append("company", inputs.company.trim())
    Object.keys(files).map((item,index)=>{
      formData.append("file[]", files[item])
    })

    //Kiểm tra debug formData
    for(let [key, value] of formData.entries()){
      console.log(key, value)
    }
    setLoading(true)
    axios.post('http://localhost/laravel8/public/api/user/product/add',formData,config)
    .then((res)=>{
      if(res.data?.response ==="error"|| res.data?.success === false){
        alert("Thêm thất bại")
        return
      }
      console.log(res.data)
      console.log(res.data.response)
      alert("Thêm thành công")
      navigate('/account/product/list')
    })
    .catch((error)=>{
      console.log("Lỗi Add Product:", error.response?.data)
    })
    .finally(()=>{
      setLoading(false)
    })
  }

  return (
    <div className="add-product">
      <h2>Create product!</h2>

      <form onSubmit={handleSubmit} >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={inputs.name}
          onChange={handleInput}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={inputs.price}
          onChange={handleInput}
        />
        {errors.price && <p className="error">{errors.price}</p>}

        <select
          name="category"
          value={inputs.category}
          onChange={handleInput}
        >
          <option value="">Please choose category</option>

          {categories.map(item => (
            <option key={item.id} value={item.id}>
              {item.category || item.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="error">{errors.category}</p>
        )}

        <select
          name="brand"
          value={inputs.brand}
          onChange={handleInput}
        >
          <option value="">Please choose brand</option>

          {brands.map(item => (
            <option key={item.id} value={item.id}>
              {item.brand || item.name}
            </option>
          ))}
        </select>
        {errors.brand && <p className="error">{errors.brand}</p>}

        <select
          name="status"
          value={inputs.status}
          onChange={handleInput}
        >
          <option value="1">New</option>
          <option value="0">Sale</option>
        </select>

        {inputs.status === "0" && (
          <div className="add-product-sale">
            <input
              type="number"
              name="sale"
              value={inputs.sale}
              min="0"
              max="100"
              onChange={handleInput}
            />
            <span>%</span>
          </div>
        )}
        {errors.sale && <p className="error">{errors.sale}</p>}

        <input
          type="text"
          name="company"
          placeholder="Company profile"
          value={inputs.company}
          onChange={handleInput}
        />
        {errors.company && (
          <p className="error">{errors.company}</p>
        )}

        <input
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          onChange={handleFile}
        />
        <small>Tối đa 3 ảnh, mỗi ảnh nhỏ hơn 1MB</small>
        {errors.image && <p className="error">{errors.image}</p>}
        {errors.file && <p className="error">{errors.file}</p>}

        <textarea
          name="detail"
          placeholder="Detail"
          value={inputs.detail}
          onChange={handleInput}
        ></textarea>
        {errors.detail && (
          <p className="error">{errors.detail}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Signup"}
        </button>
      </form>
    </div>
  )
}

export default AddProduct
