import React, { useState } from "react";
import { Menu, Badge } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import Search from "../forms/Search";
import { FormItemContext } from "antd/lib/form/context";

const { SubMenu, Item } = Menu;

const Header = () => {
  // Url triggle nav tab re-render
  let currentRoute = window.location.pathname.substring(1);
  if (!currentRoute) {
    currentRoute = "home";
  }

  const [current, setCurrent] = useState(currentRoute);

  // Redux
  let dispatch = useDispatch();
  let { user, cart } = useSelector((state) => state);
  let history = useHistory();

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const logout = () => {
    firebase.auth().signOut();
    // @@@@@@@@@@@@@@@ LOGOUT RELATES @@@@@@@@@@@@@@@
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    // clear redux
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    dispatch({
      type: "COUPON_APPLIED",
      payload: false,
    });
    dispatch({
      type: "SET_COD",
      payload: false,
    });
    // @@@@@@@@@@@@@@@ LOGOUT RELATES @@@@@@@@@@@@@@@
    // dispatch to Redux store
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    history.push("/login");
  };

  return (
    <Menu
      style={{ display: "block" }}
      onClick={handleClick}
      selectedKeys={[current]}
      mode="horizontal"
    >
      <Item key="home" icon={<AppstoreOutlined />}>
        <Link to="/"  >Home</Link>
      </Item>

      <Item key="shop" icon={<ShoppingOutlined />}>
        <Link to="/shop">Shop</Link>
      </Item>

      <Item key="cart" icon={<ShoppingCartOutlined />}>
        <Link to="/cart">
          <Badge count={cart.length} offset={[9, 0]}>
            Cart
          </Badge>
        </Link>
      </Item>

      {!user && (
        <Item key="register" icon={<UserAddOutlined />} className="float-right">
          <Link to="/register">Register</Link>
        </Item>
      )}

      {!user && (
        <Item key="login" icon={<UserOutlined />} className="float-right">
          <Link to="/login">Login</Link>
        </Item>
      )}

      {user && (
        <SubMenu
          className="float-right"
          icon={<SettingOutlined />}
          title={user.email.split("@")[0]}
        >
          {user && user.role === "subscriber" && (
            <Item>
              <Link to="/user/history">Dashboard</Link>
            </Item>
          )}
          {user && user.role === "admin" && (
            <Item>
              <Link to="/admin/dashboard">Dashboard</Link>
            </Item>
          )}

          <Item icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Item>
        </SubMenu>
      )}

      <span className="float-right p-1">
        <Search />
      </span>
    </Menu>
  );
};

export default Header;
