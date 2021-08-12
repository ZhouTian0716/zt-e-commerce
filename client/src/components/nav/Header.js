import React, { useState } from 'react'
import { Menu } from 'antd';
import { AppstoreOutlined, SettingOutlined, UserOutlined, UserAddOutlined } from '@ant-design/icons';


const { SubMenu, Item } = Menu;

const Header = () => {
    const [current, setCurrent] = useState('home');

    const handleClick = (e) => {
        setCurrent(e.key)
    }

    return (
        <Menu style={{display: 'block'}} onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Item key="home" icon={<AppstoreOutlined />}>
                Home
            </Item>

            <SubMenu icon={<SettingOutlined />} title="Username">
                <Item key="setting:1">Option 1</Item>
                <Item key="setting:2">Option 2</Item>
            </SubMenu>

            <Item className="float-right" key="register" icon={<UserAddOutlined />} >
                Register
            </Item>

            <Item key="login" icon={<UserOutlined />} className="float-right">
                Login
            </Item>     
        </Menu>
    )
}

export default Header
