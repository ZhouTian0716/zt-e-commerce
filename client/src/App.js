import React, { useEffect, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { currentUser } from "./clientRequest/auth.js";
import { LoadingOutlined } from "@ant-design/icons";

// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import Home from "./pages/Home";
// import Product from "./pages/Product";
// import Shop from "./pages/Shop";
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";
// import Payment from "./pages/Payment";
// import Header from "./components/nav/Header";
// import SideDrawer from "./components/drawer/SideDrawer";
// import RegisterComplete from "./pages/auth/RegisterComplete";
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import History from "./pages/user/History.js";
// import UserRoute from "./components/routes/UserRoute.js";
// import Password from "./pages/user/Password.js";
// import Wishlist from "./pages/user/Wishlist.js";
// import AdminRoute from "./components/routes/AdminRoute.js";
// import AdminDashboard from "./pages/admin/AdminDashboard.js";
// import CategoryCreate from "./pages/admin/category/CategoryCreate.js";
// import CategoryUpdate from "./pages/admin/category/CategoryUpdate.js";
// import SubCategoryCreate from "./pages/admin/subCategory/SubCategoryCreate.js";
// import SubCategoryUpdate from "./pages/admin/subCategory/SubCategoryUpdate.js";
// import ProductCreate from "./pages/admin/product/ProductCreate.js";
// import ProductUpdate from "./pages/admin/product/ProductUpdate.js";
// import AllProducts from "./pages/admin/product/AllProducts.js";
// import Coupon from "./pages/admin/coupon/Coupon.js";
// import CategoryHome from "./pages/category/CategoryHome";
// import SubCategoryHome from "./pages/subCategory/SubCategoryHome";

// USING REACT LAZY
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Home = lazy(() => import("./pages/Home"));
const Product = lazy(() => import("./pages/Product"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Payment = lazy(() => import("./pages/Payment"));
const Header = lazy(() => import("./components/nav/Header"));
const SideDrawer = lazy(() => import("./components/drawer/SideDrawer"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const History = lazy(() => import("./pages/user/History.js"));
// User routes protected
const UserRoute = lazy(() => import("./components/routes/UserRoute.js"));
const Password = lazy(() => import("./pages/user/Password.js"));
const Wishlist = lazy(() => import("./pages/user/Wishlist.js"));
// Admin routes protected
const AdminRoute = lazy(() => import("./components/routes/AdminRoute.js"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.js"));
const CategoryCreate = lazy(() =>
  import("./pages/admin/category/CategoryCreate.js")
);
const CategoryUpdate = lazy(() =>
  import("./pages/admin/category/CategoryUpdate.js")
);
const SubCategoryCreate = lazy(() =>
  import("./pages/admin/subCategory/SubCategoryCreate.js")
);
const SubCategoryUpdate = lazy(() =>
  import("./pages/admin/subCategory/SubCategoryUpdate.js")
);
const ProductCreate = lazy(() =>
  import("./pages/admin/product/ProductCreate.js")
);
const ProductUpdate = lazy(() =>
  import("./pages/admin/product/ProductUpdate.js")
);
const AllProducts = lazy(() => import("./pages/admin/product/AllProducts.js"));
const Coupon = lazy(() => import("./pages/admin/coupon/Coupon.js"));
const CategoryHome = lazy(() => import("./pages/category/CategoryHome"));
const SubCategoryHome = lazy(() =>
  import("./pages/subCategory/SubCategoryHome")
);

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
    <Suspense
      fallback={
        <div className="col text-center p-5">
          __ React Redux EC
          <LoadingOutlined />
          MMERCE __
        </div>
      }
    >
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Switch>
        <Route exact path="/product/:slug" component={Product} />
        <Route exact path="/" component={Home} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/checkout" component={Checkout} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot/password" component={ForgotPassword} />
        <UserRoute exact path="/user/history" component={History} />
        <UserRoute exact path="/user/password" component={Password} />
        <UserRoute exact path="/user/wishlist" component={Wishlist} />
        <UserRoute exact path="/payment" component={Payment} />
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
        <AdminRoute exact path="/admin/coupon" component={Coupon} />
        <Route exact path="/category/:slug" component={CategoryHome} />
        <Route exact path="/sub-category/:slug" component={SubCategoryHome} />
      </Switch>
    </Suspense>
  );
}
