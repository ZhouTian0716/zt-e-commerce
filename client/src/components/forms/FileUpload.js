import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";

export default function FileUpload({
  productState,
  setProductState,
  setLoading,
}) {
  const { user } = useSelector((state) => ({ ...state }));

  const fileUploadAndResize = (e) => {
    // console.log(e.target.files);
    // resize
    let files = e.target.files; // 3
    let allUploadedFiles = productState.images;

    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            // console.log(uri);
            axios
              .post(
                `${process.env.REACT_APP_API}/upload/images`,
                { image: uri },
                {
                  headers: {
                    authtoken: user ? user.token : "",
                  },
                }
              )
              .then((res) => {
                console.log("IMAGE UPLOAD RES DATA", res);
                setLoading(false);
                allUploadedFiles.push(res.data);

                setProductState({ ...productState, images: allUploadedFiles });
              })
              .catch((err) => {
                setLoading(false);
                console.log("CLOUDINARY UPLOAD ERR", err);
              });
          },
          "base64"
        );
      }
    }
    // send back to server to upload to cloudinary
    // set url to images[] in the parent component state - ProductCreate
  };

  const imageRemove = (public_id) => {
    setLoading(true);
    // console.log("remove image", public_id);
    axios
      .post(
        `${process.env.REACT_APP_API}/remove/image`,
        { public_id },
        {
          headers: {
            authtoken: user ? user.token : "",
          },
        }
      )
      .then((res) => {
        setLoading(false);
        const { images } = productState;
        let filteredImages = images.filter((item) => {
          return item.public_id !== public_id;
        });
        setProductState({ ...productState, images: filteredImages });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="row">
        {productState.images &&
          productState.images.map((image) => (
            <Badge
              count="X"
              key={image.public_id}
              onClick={() => {imageRemove(image.public_id)}}
              style={{cursor:"pointer"}}
            >
              <Avatar
                src={image.url}
                size={100}
                shape="square"
                className="ml-3"
              />
            </Badge>
          ))}
      </div>
      <div className="row">
        <label className="btn btn-primary btn-raised mt-3">
          Choose File
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
}
