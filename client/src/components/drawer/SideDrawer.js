import React from "react";
import { Drawer, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import defaultImg from "../../images/default.jpg";

export default function SideDrawer({ children }) {
  let dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => ({ ...state }));

  return <Drawer visible={true}>
      {JSON.stringify(cart)}
  </Drawer>;
}
