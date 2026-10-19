import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function Head() {
    const cart_count = 0; 
    const user = null;

    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
      setToken(localStorage.getItem('token'))
    }, [])

    const handleLogout = (e) =>{
      localStorage.removeItem('token')
      setToken(null);
      navigate('/')
    }
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          
          <a href="/">
            <span className="logo-text">E-Shopper</span>
          </a>
        </div>
        <div className="menu">
          <a href="#">
            <span className="icon">★</span>
            Wishlist
          </a>
          <a href="/checkout">
            <span className="icon">✥</span>
            Checkout
          </a>
          <a href="/cart">
            <span className="icon">🛒</span>
            Cart
            {/* Hiển thị biến đúng cách */}
            (<span id="cart-count">{cart_count}</span>)
          </a>
          {token ? (
            <>
              <Link to ="/account">
                <span className="icon">♟</span>
                Account
              </Link>
              <button
                  type="button"
                  className="logout-btn"
                  onClick={handleLogout}
              >
                  <span className="icon">🔒</span>
                  Logout
              </button>
            </>
            ) : (
              <>
                <Link to ="/account">
                    <span className="icon">♟</span>
                    Account
                  </Link>
                <Link to ="/login">
                  <span className="icon">🔒</span>
                  Login
                </Link>
              </>
            )
          }
        </div>
      </div>
      <nav className="navbar">
        <div className="navbar-container">
          <ul className="nav-menu">
            <li><Link to="/" className="active">Home</Link></li>
            <li className="dropdown">
              <a href="#">Shop <span className="caret">▾</span></a>
              <ul className="dropdown-menu">
                <li><a href="#">Sản phẩm</a></li>
                <li><a href="#">Danh mục</a></li>
              </ul>
            </li>
            <li className="dropdown">
              <Link to="/blog/list">Blog <span className="caret">▾</span></Link>
              <ul className="dropdown-menu">
                <Link to="/blog/list">Blog list</Link>
                <li><a href="#">Blog single</a></li>
              </ul>
            </li>
            <li><a href="#">404</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
          <form className="search-form" method="GET" action="/search">
            <div className="search-box">
              <input id="search" name="name" type="text" placeholder="Search" />
              <button type="submit">
                <span className="icon">🔍</span>
              </button>
            </div>
          </form>
        </div>
      </nav>
      <section className="features">
        <h2 className="section-title">Features Items</h2>
        <form id="searchForm" className="filter-bar" method="GET" action="/search-advance">
          <input id="searchName" type="text" className="filter-input" name="name" placeholder="Name" />
          <select id="searchPrice" className="filter-select" name="price">
            <option value="">Choose price</option>
            <option value="0-100">0 - 100</option>
            <option value="100-500">100 - 500</option>
            <option value="500-1000">500 - 1000</option>
            <option value="1000-2000">1000 - 2000</option>
          </select>
          <select id="searchCategory" className="filter-select" name="category">
            <option value="">Category</option>
            
            {/* {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))} */}
          </select>
          <select id="searchBrand" className="filter-select" name="brand">
            <option value="">Brand</option>
            {/* {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name_brand}
              </option>
            ))} */}
          </select>
          <select className="filter-select" name="sale_status" id="sale_status">
            <option value="">status</option>
            <option value={0}>new</option>
            <option value={1}>Sale</option>
          </select>
          <button type="submit" className="filter-btn">Search</button>
        </form>
      </section>
    </header>
  )
}

export default Head
