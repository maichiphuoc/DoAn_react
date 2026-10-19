import React from 'react'

function MenuLeft() {
  return (
    <div className="menuLeft"> 
      <h2>CATEGORY</h2>
      <ul className="category">
        <li><a href="#">SPORTSWEAR</a><b>+</b></li>
        <li><a href="#">MENS</a><b>+</b></li>
        <li><a href="#">WOMENS</a><b>+</b></li>
        <li><a href="#">KIDS</a></li>
        <li><a href="#">FASHION</a></li>
        <li><a href="#">HOUSEHOLDS</a></li>
        <li><a href="#">INTERIORS</a></li>
        <li><a href="#">CLOTHING</a></li>
        <li><a href="#">BAGS</a></li>
        <li><a href="#">SHOES</a></li>
      </ul>

      <h2>BRANDS</h2>
      <ul className="brands">
        <li><a href="#">ACNE</a></li>
        <li><a href="#">GRÜNE ERDE</a></li>
        <li><a href="#">ALBIRO</a></li>
        <li><a href="#">RONHILL</a></li>
        <li><a href="#">ODDMOLLY</a></li>
        <li><a href="#">BOUDESTIJN</a></li>
        <li><a href="#">RÖSCH CREATIVE CULTURE</a></li>
      </ul>

      <div className="sidebar-title">PRICE RANGE</div>
      <div className="price-range">
        <div className="price-range__track">
          <div className="price-range__fill" id="priceFill" />
        </div>
        <input type="range" id="rangeMin" min={0} max={2000} defaultValue={400} step={10} />
        <input type="range" id="rangeMax" min={0} max={2000} defaultValue={1400} step={10} />
        <span className="price-tag" id="priceMin">$ 400</span>
        <span className="price-tag" id="priceMax">$ 1400</span>
      </div>
    </div>
  )
}

export default MenuLeft
