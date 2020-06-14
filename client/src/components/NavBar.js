import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../App'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const NavBar = () => {
   const { state, dispatch } = useContext(UserContext)
   const history = useHistory()
   const [search, setSearch] = useState("")
   const searchModal = useRef(null)
   const [userDetails, setUserDetails] = useState([])

   useEffect(() => {
      M.Modal.init(searchModal.current)
   }, [])

   const renderList = () => {
      if (state) {
         return [
            <li key="1"><i className="material-icons modal-trigger" data-target="modal1" style={{ cursor: "pointer", color: "black" }}>search</i></li>,
            <li key="2"><Link to="/api/myfollowposts">My Following</Link></li>,
            <li key="3"><Link to="/api/profile">Profile</Link></li>,
            <li key="4"><Link to="/api/createpost">Create Post</Link></li>,
            <li key="5">
               <button onClick={() => {
                  localStorage.clear()
                  dispatch({ type: "CLEAR" })
                  history.push('/api/signin')
               }}
                  style={{ marginLeft: "15px" }}
                  className="btn waves-effect waves-light black">
                  LOGOUT <span id="logoutIcon" className="material-icons right ">directions_run</span>
               </button>
            </li>
         ]
      } else {
         return [
            <li key="6"><Link to="/api/signin">Login</Link></li>,
            <li key="7"><Link to="/api/signup">SignUp</Link></li>
         ]
      }
   }

   const fetchUsers = (query) => {
      setSearch(query)
      fetch('/api/search-users', {
         method: "post",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            query
         })
      }).then(res => res.json())
         .then(result => {
            setUserDetails(result.user)
         }).catch(err => console.error("Error", err))
         .catch(err => console.error("Error", err))

   }

   return (
      <div>
         <div className="navbar-fixed">
            <nav>
               <div className="nav-wrapper white ">
                  <Link to={state ? "/" : "/api/signin"} className="brand-logo _logo left">Instagram</Link>
                  <a href="#" className="sidenav-trigger right" data-target="mobile-links"><i className="material-icons">menu</i></a>
                  <ul className="right hide-on-med-and-down">
                     {renderList()}
                  </ul>
               </div>
            </nav>
         </div>
         <ul id="mobile-links" className="sidenav">
            <li><div className="user-view">
               <div className="background">
                  <img src="https://res.cloudinary.com/vinipai45/image/upload/v1591981137/cover_emcssj.jpg" />
               </div>
               <a href="#user"><img className="circle" src={state ? state.pic : "https://res.cloudinary.com/vinipai45/image/upload/v1591981247/default-avatar_oefekd.png"} /></a>
               <a href="#name"><span className="white-text name">{state ? state.name : <span className="white-text name _logo">Instagram</span>}</span></a>
               <a href="#email"><span className="white-text email">{state ? state.email : ""}</span></a>
            </div></li>
            {renderList()}
         </ul>

         {/* MODAL ON SEARCH */}
         <div ref={searchModal} id="modal1" class="modal">
            <div class="modal-content">
               <div className="input-field _myInput">
                  <input id="user" type="text" className="validate" autoComplete="off"
                     value={search}
                     onChange={(e) => fetchUsers(e.target.value)}
                  />
                  <label htmlFor="user">Search User</label>
               </div>

               {/* COLLECTION IN MODAL */}
               <ul class="collection">
                  {userDetails.map(item => {
                     return (
                        <li class="collection-item avatar">
                           <Link to={item._id !== state._id ? "/api/userprofile/" + item._id : "/api/profile"} onClick={() => {
                              M.Modal.getInstance(searchModal.current).close()
                              setSearch("")
                           }}>
                              <img src={item.pic} alt="" class="circle" />
                              <span class="title">{item.name}</span>
                              <p>{item.email}</p>
                           </Link>
                        </li>
                     )

                  })}
               </ul>
            </div>
         </div>

      </div>
   );
}


export default NavBar






