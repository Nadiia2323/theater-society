
import { ChangeEvent, useContext, useState } from "react";
import { getToken } from "../utils/login";
import { AuthContext } from "../context/AuhContext";


import "./Posts.css"

export default function Posts() {
  const [caption, setCaption] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | string>("");
    const { user } = useContext(AuthContext)
    console.log('user iside posts :>> ', user);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "caption") {
      setCaption(e.target.value);
    } else if (e.target.name === "fileInput") {
      
      const file = e.target.files && e.target.files[0];
      setSelectedFile(file || ""); // Set the selected file
    }
  };

    const createPost = async () => {
      const token = getToken()
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${token}`
    );

    const formdata = new FormData();
    formdata.append("caption", caption);
    formdata.append("posts", selectedFile);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/myApi/users/posts",
        requestOptions
      );
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.log("error", error);
    }
    };
 
    

  return (
    <div>
      <button onClick={createPost}>Create new post</button>
      <div>
        <label>
          <input
            name="caption"
            type="text"
            placeholder="caption"
            onChange={handleOnChange}
          />
        </label>
        <img src={selectedFile instanceof File ? URL.createObjectURL(selectedFile) : ""} alt="Selected" />
        <label>
          <input
            name="fileInput"
            type="file"
            onChange={handleOnChange}
          />
              </label>
             
          </div >
          <div className="post-container">
          {user && user.posts && user.posts.length > 0 && user.posts.map((post, index: number) => (
               
  <div key={index} className="post">
    <h3 className="caption">{post.caption}</h3>
    <img className="image" src={post.imageUrl} alt="" />
    <p>{post.updatedAt}</p>
                  
                  </div>
))}
</div>
    </div>
  );
}
