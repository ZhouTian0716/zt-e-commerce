import axios from "axios";

export const userCart = async (cart, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/user/cart`,
    { cart },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getUserCart = async (authtoken) => {
  return await axios.get(`${process.env.REACT_APP_API}/user/cart`, {
    headers: {
      authtoken,
    },
  });
};

export const clearUserCart = async (authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/user/cart`, {
    headers: {
      authtoken,
    },
  });

export const saveUserAddress = async (authtoken, address) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/user/address`,
    { address },
    {
      headers: {
        authtoken,
      },
    }
  );
};


// Use Coupon
export const applyCoupon = async (authtoken, coupon) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/user/cart/coupon`,
    { coupon },
    {
      headers: {
        authtoken,
      },
    }
  );
};

// Create Order
export const addOrder = async (stripeResponse, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/user/order`,
    { stripeResponse },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getUserOrders = async (authtoken) => {
  return await axios.get(`${process.env.REACT_APP_API}/user/order`, {
    headers: {
      authtoken,
    },
  });
};


// WISHLIST addToWishlist
export const addToWishlist = async (productId, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/user/wishlist`,
    { productId },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getUserWishlist = async (authtoken) => {
  return await axios.get(`${process.env.REACT_APP_API}/user/wishlist`, {
    headers: {
      authtoken,
    },
  });
};

export const removeFromWishlist = async (productId, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/user/wishlist/${productId}`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};