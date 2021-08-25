import axios from "axios";

export const getAll = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/sub-categories`);
};

export const getOne = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API}/sub-category/${slug}`);
};

// actions for admin
export const remove = async (slug, authtoken) => {
  return await axios.delete(`${process.env.REACT_APP_API}/sub-category/${slug}`, {
    headers: {
      authtoken,
    },
  });
};

export const update = async (slug, subCategory, authtoken) => {
  return await axios.put(`${process.env.REACT_APP_API}/sub-category/${slug}`, subCategory, {
    headers: {
      authtoken,
    },
  });
};

export const create = async (subCategory, authtoken) => {
  return await axios.post(`${process.env.REACT_APP_API}/sub-category`, subCategory, {
    headers: {
      authtoken,
    },
  });
};
