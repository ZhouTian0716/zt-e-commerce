import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Header from "./components/nav/Header";
import RegisterComplete from "./pages/auth/RegisterComplete";
import ForgotPassword from "./pages/auth/ForgotPassword";
import History from "./pages/user/History.js";
// User routes protected
import UserRoute from "./components/routes/UserRoute.js";
import Password from "./pages/user/Password.js";
import Wishlist from "./pages/user/Wishlist.js";
// Admin routes protected
import AdminRoute from "./components/routes/AdminRoute.js";
import AdminDashboard from "./pages/admin/AdminDashboard.js";
import CategoryCreate from "./pages/admin/category/CategoryCreate.js";
import CategoryUpdate from "./pages/admin/category/CategoryUpdate.js";
import SubCategoryCreate from "./pages/admin/subCategory/SubCategoryCreate.js";
import SubCategoryUpdate from "./pages/admin/subCategory/SubCategoryUpdate.js";
import ProductCreate from "./pages/admin/product/ProductCreate.js";
import ProductUpdate from "./pages/admin/product/ProductUpdate.js";
import AllProducts from "./pages/admin/product/AllProducts.js";

import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { currentUser } from "./clientRequest/auth.js";

export default function App() {
  const dispatch = useDispatch();

  // to check firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        // Request to own server and dispatch the state
        currentUser(idTokenResult.token)
          .then((res) => {
            //Dispatch to redux store
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((error) => console.log(error));
      }
    });
    // clean up
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Header />
      <ToastContainer />
      <Switch>
        <Route exact path="/product/:slug" component={Product} />
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot/password" component={ForgotPassword} />
        <UserRoute exact path="/user/history" component={History} />
        <UserRoute exact path="/user/password" component={Password} />
        <UserRoute exact path="/user/wishlist" component={Wishlist} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute exact path="/admin/category" component={CategoryCreate} />
        <AdminRoute
          exact
          path="/admin/category/:slug"
          component={CategoryUpdate}
        />
        <AdminRoute
          exact
          path="/admin/sub-category"
          component={SubCategoryCreate}
        />
        <AdminRoute
          exact
          path="/admin/sub-category/:slug"
          component={SubCategoryUpdate}
        />
        <AdminRoute exact path="/admin/product" component={ProductCreate} />
        <AdminRoute
          exact
          path="/admin/product/:slug"
          component={ProductUpdate}
        />
        <AdminRoute exact path="/admin/products" component={AllProducts} />
      </Switch>
    </>
  );
}
