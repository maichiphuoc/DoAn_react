import React from "react";
import { Link } from "react-router-dom";

function MenuAcc() {
    return (
        <div>
            <h3>ACCOUNT</h3>

            <ul>
                <li>
                    <Link to="/account">Account</Link>
                </li>

                <li>
                    <Link to="/account/product/list">
                        My Product
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default MenuAcc;