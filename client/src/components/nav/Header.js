import React, { useState } from 'react'
import { Menu } from 'antd';
import { AppstoreOutlined, SettingOutlined, UserOutlined, UserAddOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import firebase from 'firebase';
import { useDispatch } from 'react-redux'

const { SubMenu, Item } = Menu;

const Header = () => {
    // Url triggle nav tab re-render
    let currentRoute = window.location.pathname.substring(1);
    if (!currentRoute){
        currentRoute = "home"
    } 
    
    const [current, setCurrent] = useState(currentRoute);


    // Redux 
    let dispatch = useDispatch();
    let history = useHistory();

    const handleClick = (e) => {
        setCurrent(e.key)
    }

    const logout = () => {
        firebase.auth().signOut();
        // dispatch to Redux store
        dispatch({
            type:'LOGOUT',
            payload: null,
        })
        history.push('/login');
    }

    return (
        <Menu style={{display: 'block'}} onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Item key="home" icon={<AppstoreOutlined />}>
                <Link to="/">Home</Link>
            </Item>

            <SubMenu icon={<SettingOutlined />} title="Username">
                <Item key="setting:1">Option 1</Item>
                <Item key="setting:2">Option 2</Item>
                <Item icon={<LogoutOutlined/>} onClick={logout}>Logout</Item>
            </SubMenu>

            <Item key="login" icon={<UserOutlined />} className="float-right">
                <Link to="/login">Login</Link>
            </Item>  

            <Item className="float-right" key="register" icon={<UserAddOutlined />} >
                <Link to="/register">Register</Link> 
            </Item>   

        </Menu>
    )
}

export default Header
