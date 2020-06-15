import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App'

const Profile = () => {
   const [myPics, setPics] = useState([])
   const { state, dispatch } = useContext(UserContext)
   const [image, setImage] = useState("")

   useEffect(() => {
      fetch("/api/myposts", {
         headers: {
            "Authorization": localStorage.getItem('token')
         }
      }).then(res => res.json())
         .then(result => {
            setPics(result.myposts)
         }).catch(err => console.error("Error", err))
         .catch(err => console.error("Error", err))
   }, [])

   useEffect(() => {
      if (image) {
         const data = new FormData()
         data.append("file", image)
         data.append("upload_preset", "instagram-clone")
         data.append("cloud_name", "vinipai45")
         fetch("https://api.cloudinary.com/v1_1/vinipai45/image/upload", {
            method: "post",
            body: data
         })
            .then(res => res.json())
            .then(data => {


               fetch('/api/updatepic', {
                  method: "put",
                  headers: {
                     "Content-Type": "application/json",
                     "Authorization": localStorage.getItem("token")
                  },
                  body: JSON.stringify({
                     pic: data.url
                  })
               }).then(res => res.json())
                  .then(result => {
                     console.log(result)
                     localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                     dispatch({ type: "UPDATEPIC", payload: result.pic })
                     //window.location.reload()
                  })
            })
            .catch(err => {
               console.error("Error", err)
            })
      }
   }, [image])

   const updatePhoto = (file) => {
      setImage(file)
   }


   return (
      <>
         {state ?
            <div className="_container">
               <div className="_profileDetails">
                  <div>
                     <img style={{
                        width: "140px", height: "140px", borderRadius: "50%", marginBottom: "10px", border: "2px solid #000"
                     }}
                        src={state ? state.pic : <div class="lds-ripple"><div></div><div></div></div>}
                        alt="profile here"
                     />
                     <div className="file-field input-field">
                        <div style={{ margin: "0px 0px 13px -14px" }} className="btn waves-effect waves-light black">
                           <span>Upload Avatar</span><i className="material-icons right">person</i>
                           <input type="file"
                              onChange={(e) => updatePhoto(e.target.files[0])}
                           />
                        </div>
                     </div>
                  </div>
                  <div>
                     <h4>{state ? state.name : "loading"}</h4>
                     <div style={{ display: "flex", justifyContent: "space-evenly", width: "120%" }}>
                        <h6>{myPics.length} Posts</h6>
                        <h6>{state ? state.followers.length : <div class="lds-ripple"><div></div><div></div></div>} Followers</h6>
                        <h6>{state ? state.following.length : <div class="lds-ripple"><div></div><div></div></div>} Following</h6>
                     </div>
                  </div>
               </div >
               <div className="_gallery">
                  {
                     myPics.map(item => {
                        return (
                           <img key={item._id} className="_item" src={item.pic} alt="post here" />
                        )
                     })
                  }
               </div>
            </div>
            : <h5>Session Ended - Login to continue</h5>}
      </>
   )
}

export default Profile