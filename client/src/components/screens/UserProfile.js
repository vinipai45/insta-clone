import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

const Profile = () => {
   const [userProfile, setProfile] = useState(null)
   const { state, dispatch } = useContext(UserContext)
   const { userId } = useParams()
   const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userId) : true)

   useEffect(() => {
      fetch(`/api/userprofile/${userId}`, {
         headers: {
            "Authorization": localStorage.getItem('token')
         }
      }).then(res => res.json())
         .then(result => {
            setProfile(result)
         }).catch(err => console.error("Error", err))
         .catch(err => console.error("Error", err))
   }, [])

   const followUser = () => {
      fetch("/api/follow", {
         method: "put",
         headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
         },
         body: JSON.stringify({
            followId: userId
         })
      }).then(res => res.json())
         .then(data => {
            dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState) => {
               return {
                  ...prevState,
                  user: {
                     ...prevState.user,
                     followers: [...prevState.user.followers, data._id]
                  }
               }
            })
            setShowFollow(false)
         }).catch(err => console.error("Error", err))
   }

   const unfollowUser = () => {
      fetch("/api/unfollow", {
         method: "put",
         headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
         },
         body: JSON.stringify({
            unfollowId: userId
         })
      }).then(res => res.json())
         .then(data => {
            dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState) => {
               const newFollower = prevState.user.followers.filter(item => item !== data._id)
               return {
                  ...prevState,
                  user: {
                     ...prevState.user,
                     followers: newFollower
                  }
               }
            })
            setShowFollow(true)
         }).catch(err => console.error("Error", err))
   }

   const confirmUnfollow = (user) => {
      Swal.fire({
         title: 'Are you sure?',
         text: `You want to unfollow ${user}`,
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#000',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Yes, unfollow!'
      }).then((result) => {
         if (result.value) {
            unfollowUser()
            Swal.fire({
               position: 'top-end',
               icon: 'success',
               title: "Unfollowed!",
               showConfirmButton: false,
               timer: 1500
            })
         }
      }).catch(err => console.error("Error", err))
   }

   return (
      <>
         {state ?
            <>
               {userProfile ?
                  <div className="_container">
                     <div className="_profileDetails">
                        <div className="">
                           <img style={{ width: "140px", height: "140px", borderRadius: "50%", marginBottom: "10px", border: "2px solid #000" }}
                              src={userProfile.user.pic}
                              alt="profile here"
                           />
                        </div>
                        <div>
                           <h4>{userProfile.user.name}</h4>
                           <h6>{userProfile.user.email}</h6>
                           <div style={{ display: "flex", justifyContent: "space-evenly", width: "120%" }}>
                              <h6>{userProfile.posts.length} Posts</h6>
                              <h6>{userProfile.user.followers.length} Followers</h6>
                              <h6>{userProfile.user.following.length} Following</h6>
                           </div>
                           {showFollow ?
                              <button style={{ margin: "20px 0px" }}
                                 onClick={() => followUser()}
                                 className="btn waves-effect waves-light black">
                                 Follow
                              </button>
                              :
                              <button style={{ margin: "20px 0px" }} onClick={() => confirmUnfollow(userProfile.user.name)} className="btn waves-effect waves-light grey">
                                 Followed <i className="material-icons right">check</i>
                              </button>
                           }


                        </div>
                     </div >
                     <div className="_gallery">
                        {
                           userProfile.posts.map(item => {
                              return (
                                 <img key={item._id} className="_item" src={item.pic} alt="post here" />
                              )
                           })
                        }
                     </div>
                  </div>
                  : <div style={{ margin: "20% 50%" }} className="lds-dual-ring"></div>}
            </>
            : <h5>Cannot access user profile - Login to continue</h5>
         }
      </>
   )
}

export default Profile