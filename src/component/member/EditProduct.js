import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditProduct() {
  const param = useParams()
  const navigate = useNavigate()
  const infoAuth = JSON.parse(localStorage.getItem('auth')|| null)
  const token = localStorage.getItem('token')
  console.log(param)     
  console.log("id sản phẩm:",param.id)
  

  const [inputs, setInputs] = useState({
    category: "",
    brand: "",
    name: "",
    price: "",
    status: "0",
    sale: "0",
    detail: "",
    company: ""
  })

  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const [category, setCategories] = useState([])
  const [brand, setBrands] = useState([])

  const [oldImages, setOldImages] = useState([])
  const [avatarCheckBox, setAvatarCheckBox] = useState([])

  // Dữ liệu sản phẩm cần chỉnh sửa
  const [data, setData] = useState(null)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [loadError, setLoadError] = useState("")

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

  //lấy ttin sản phẩm theo id url
  useEffect(()=>{
    let cancelled = false

    if(!param.id){
      setLoadError("Không tìm thấy id sản phẩm")
      setLoadingProduct(false)
      return
    }
    if(!token || !infoAuth){
      navigate('/')
      return
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
        }
      }

    setLoadingProduct(true)
    setLoadError("")
    setData(null)

    axios.get('http://localhost/laravel8/public/api/user/my-product',config)
    .then((res)=>{
      if(cancelled){
        return
      }
      console.log("api my product:", res.data)

      const products = toArray(res.data.data)
      //log ra xem có phải thành mảng không
      console.log("dsach sản phẩm:",products)

      //tìm sản phẩm có id trùng với param.id
      const product = products.find(
        item => String(item.id) === String(param.id)
      )
      //kiểm tra xem ttin sản phẩm đúng không
      console.log("sản phẩm cần sửa theo id trung param.id:",product)
      
      if(product){
        setData(product)
      }
      else{
        setLoadError("Không tìm thấy spham")
      }

    })
    .catch((error)=>{
      if(cancelled){
        return
      }
      console.log("lỗi lấy spham:",error)
    })
    .finally(()=>{
      if(!cancelled){
        setLoadingProduct(false)
      }
    })
    return () => {
      cancelled = true
    }
  },[param.id, navigate])
  //Đổ dữ liệu cũ vào form
  useEffect(()=>{
    if(data){
      setInputs(state => ({...state,
            name: data.name ?? "",
            price: data.price ?? "",
            category: data.id_category ?? "",
            brand: data.id_brand ?? "",
            status: String(data.status ?? "1"),
            sale: String(data.sale ?? "0"),
            company: data.company ?? "",
            detail: data.detail ?? ""
          }))
      setAvatarCheckBox([])
      setFiles([])
      setErrors({})
      //Xử lí dsach ảnh cũ
      if(Array.isArray(data.image)){
        setOldImages(data.image)
      }
      else if(data && typeof data.image ==="string"){
        try{
          const images = JSON.parse(data.image)
          console.log("Mảng ảnh cũ:", images)
          if(Array.isArray(images)){
            setOldImages(images)
          }
          else{
            setOldImages([])
          }
        }catch{
          setOldImages([])
        }
      }
      else{
        setOldImages([])
      }

    }
  },[data])
  useEffect(() => {
        console.log("INPUTS:", inputs)
    }, [inputs])

    useEffect(() => {
        console.log("OLD IMAGES:", oldImages)
    }, [oldImages])

    // Lấy category và Brand từ API
    useEffect(() => {
        let cancelled = false

        axios.get(
            'http://localhost/laravel8/public/api/category-brand'
        )
        .then((res) => {
            if (cancelled) return

            console.log("Category Brand:", res.data)

            const data = res.data.data ?? res.data

            setCategories(toArray(data.category))
            setBrands(toArray(data.brand))
        })
        .catch((error) => {
            console.log(error)
        })

        return () => {
            cancelled = true
        }

    }, [])
  
  function handleInput(e){
    const nameInput = e.target.name;
    const valueInput = e.target.value;

    setInputs(state =>({...state,[nameInput]:valueInput}))
  }
  function handleCheckBox(e){
    const image = e.target.value;
    const checked =e.target.checked;
    if(checked){
      //thêm tên ảnh vào avatarCheckBox(cuối dsach) && {[image,..old]}(đầu dsach)
      setAvatarCheckBox(old => [...old,image])
    }
    else{
      //Xóa image khỏi mảng
      setAvatarCheckBox(old =>old.filter(item => item !== image))

    }
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
    // setFiles(e.target.files)
    setFiles(e.target.files)
    setErrors(state =>({...state,image : ""}))
  }
  function validateForm() {
    const errorSubmit = {}
    const totalImages = oldImages.length - avatarCheckBox.length + files.length
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
    if(totalImages > 3){
      errorSubmit.image = "Không quá 3 ảnh"
    }
    else if(totalImages < 1) {
      errorSubmit.image = "Sản phẩm phải có ít nhất 1 ảnh"
    }
    if (inputs.company.trim() === "") {
      errorSubmit.company = "Vui lòng nhập Company"
    }

    if (inputs.detail.trim() === "") {
      errorSubmit.detail = "Vui lòng nhập Detail"
    }
    return errorSubmit
  }
  function handleSubmit(e){
    e.preventDefault();

    if (!data || !param.id) {
      setErrors({
        submit: "Chưa lấy được thông tin sản phẩm"
      })
      return
    }
    const errorSubmit = validateForm()
    setErrors(errorSubmit)
    if(Object.keys(errorSubmit).length>0){
      return
    }
    const token = localStorage.getItem('token')
    
  

    const config = {
      headers : {
        'Authorization':'Bearer '+ token,
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
    //Gửi các ảnh mới
    Object.keys(files).map((item, index) => {
            formData.append("file[]", files[item])
            return item
        })
    //Gửi dsach ảnh được chọn
    Object.keys(avatarCheckBox).map((item, index) => {
            formData.append(
                "avatarCheckBox[]",
                avatarCheckBox[item]
            )
            return item
        })

    for (const [key, value] of formData.entries()) {
      console.log(key, value)
    }
    setLoading(true)
    axios.post(`http://localhost/laravel8/public/api/user/product/update/${param.id}`,formData,config)
    .then((res)=>{
      console.log("response", res.data)
      if(res.data.response ==="success"){
        alert("Sửa sản phẩm thành công")
        navigate('/account/product/list')
      }
      else if (res.data?.errors) {
        console.log(
            "CHI TIẾT LỖI FILE:",
            res.data.errors.file?.[0]
        )

        setErrors(state => ({
            ...state,
            file: res.data.errors.file?.[0] || "",
            submit: res.data.message || ""
        }))
      }
      else {
          console.log("Phản hồi khác:", res.data)
      }
    })
    .catch((error)=>{
      console.log("lỗi update:",error)
      console.log("ERROR DATA:", error.response?.data)
      console.log("ERROR MESSAGE:", error.message)
    })
    .finally(()=>{
      setLoading(false)
    })
  }
  if (loadingProduct) {
        return <p>Đang tải thông tin sản phẩm...</p>
    }

    if (loadError) {
        return <p className="error">{loadError}</p>
    }

    if (!data) {
        return <p>Không có dữ liệu sản phẩm</p>
    }
  
  return (
      <div className="edit-product">
          <form
              className="edit-product-form"
              onSubmit={handleSubmit}
          >
              {/* Name */}
              <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={inputs.name}
                  onChange={handleInput}
              />
              {errors.name && (
                  <p className="edit-error">{errors.name}</p>
              )}

              {/* Price */}
              <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={inputs.price}
                  onChange={handleInput}
              />
              {errors.price && (
                  <p className="edit-error">{errors.price}</p>
              )}

              {/* Category */}
              <select
                  name="category"
                  value={inputs.category}
                  onChange={handleInput}
              >
                  <option value="">Please choose category</option>

                  {category.map(item => (
                      <option
                          key={item.id}
                          value={item.id}
                      >
                          {item.category || item.name}
                      </option>
                  ))}
              </select>
              {errors.category && (
                  <p className="edit-error">{errors.category}</p>
              )}

              {/* Brand */}
              <select
                  name="brand"
                  value={inputs.brand}
                  onChange={handleInput}
              >
                  <option value="">Please choose brand</option>

                  {brand.map(item => (
                      <option
                          key={item.id}
                          value={item.id}
                      >
                          {item.brand || item.name}
                      </option>
                  ))}
              </select>
              {errors.brand && (
                  <p className="edit-error">{errors.brand}</p>
              )}

              {/* Status */}
              <select
                  name="status"
                  value={inputs.status}
                  onChange={handleInput}
              >
                  <option value="" disabled>
                      Please choose status
                  </option>
                  <option value="1">New</option>
                  <option value="0">Sale</option>
              </select>

              {/* Sale */}
              <input
                  type="number"
                  name="sale"
                  placeholder="Sale (%)"
                  value={inputs.sale}
                  min="0"
                  max="100"
                  disabled={inputs.status !== "0"}
                  onChange={handleInput}
              />
              {errors.sale && (
                  <p className="edit-error">{errors.sale}</p>
              )}

              {/* Company */}
              <input
                  type="text"
                  name="company"
                  placeholder="Company profile"
                  value={inputs.company}
                  onChange={handleInput}
              />
              {errors.company && (
                  <p className="edit-error">{errors.company}</p>
              )}

              {/* Chọn ảnh mới */}
              <input
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  multiple
                  onChange={handleFile}
              />
              {errors.image && (
                  <p className="edit-error">{errors.image}</p>
              )}

              {/* Danh sách ảnh cũ */}
              <div className="edit-old-images">
                  {oldImages.map((image, index) => (
                      <div
                          className="edit-image-item"
                          key={`${image}-${index}`}
                      >
                          <img
                              src={`http://localhost/laravel8/public/upload/product/${data.id_user || infoAuth?.id}/${image}`}
                              alt={`Ảnh sản phẩm ${index + 1}`}
                              className="edit-image-preview"
                          />

                          <label
                              className="edit-image-checkbox"
                              title="Chọn để xóa ảnh"
                          >
                              <input
                                  type="checkbox"
                                  value={image}
                                  checked={avatarCheckBox.includes(image)}
                                  onChange={handleCheckBox}
                                  aria-label={`Chọn xóa ảnh ${index + 1}`}
                              />
                          </label>
                      </div>
                  ))}
              </div>

              {/* Detail */}
              <textarea
                  name="detail"
                  placeholder="Detail"
                  value={inputs.detail}
                  onChange={handleInput}
              ></textarea>
              {errors.detail && (
                  <p className="edit-error">{errors.detail}</p>
              )}

              {errors.submit && (
                  <p className="edit-error">{errors.submit}</p>
              )}

              {/* Buttons */}
              <div className="edit-product-actions">
                  <button
                      type="submit"
                      className="edit-update-btn"
                      disabled={loading}
                  >
                      {loading ? "Updating..." : "Update"}
                  </button>

                  <button
                      type="button"
                      className="edit-cancel-btn"
                      onClick={() => navigate(-1)}
                  >
                      Cancel
                  </button>
              </div>
          </form>
      </div>
  )
}

export default EditProduct
