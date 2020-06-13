import React, { useContext, useEffect } from 'react';
import { UserContext } from '../App'
import { Link, useHistory } from 'react-router-dom'

const NavBar = () => {
   const { state, dispatch } = useContext(UserContext)
   const history = useHistory()
   const renderList = () => {
      if (state) {
         return [

            <li><Link to="/api/profile">Profile</Link></li>,
            <li><Link to="/api/myfollowposts">My Following</Link></li>,
            <li><Link to="/api/createpost">Create Post</Link></li>,
            <li>
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
            <li><Link to="/api/signin">Login</Link></li>,
            <li><Link to="/api/signup">SignUp</Link></li>
         ]
      }
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
      </div>
   );
}


export default NavBar






