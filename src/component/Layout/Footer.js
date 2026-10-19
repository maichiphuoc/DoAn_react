import React from 'react'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <div className="footer-logo">
            <span>E</span>-SHOPPER
          </div>
          <p>
            Lorem ipsum dolor sit amet,<br />
            consectetur adipisicing elit,sed<br />
            do eiusmod tempor
          </p>
        </div>

        <div className="footer-blog">
          {/* Blog 1 */}
          <div className="blog-item">
            <h4>Circle of Hands</h4>
            <span>24 DEC 2014</span>
          </div>
          <div className="blog-item">
            <h4>Circle of Hands</h4>
            <span>24 DEC 2014</span>
          </div>
          <div className="blog-item">
            <h4>Circle of Hands</h4>
            <span>24 DEC 2014</span>
          </div>
          <div className="blog-item">
            <h4>Circle of Hands</h4>
            <span>24 DEC 2014</span>
          </div>
        </div>

        <div className="footer-address">
          <div className="map">
            <p>
              505 S Atlantic Ave Virginia Beach,<br />
              VA(Virginia)
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
