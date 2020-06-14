import React, { useEffect, createContext, useReducer, useContext } from 'react';
import NavBar from './components/NavBar'
import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/screens/Home'
import Signup from './components/screens/Signup'
import Profile from './components/screens/Profile'
import SignIn from './components/screens/SignIn'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import Reset from './components/screens/Reset'
import NewPassword from './components/screens/NewPassword'
import ConfirmSignIn from './components/screens/ConfirmSignIn'
import { reducer, initialState } from './reducers/userReducer'
import FollowedUserPost from './components/screens/FollowedUserPosts';

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({ type: "USER", payload: user })
    }
    else {
      if (!(history.location.pathname.startsWith('/api/reset') || history.location.pathname.startsWith('/api/confirm')))
        history.push('/api/signin')

    }
  }, [])

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/api/signup">
        <Signup />
      </Route>
      <Route exact path="/api/signin">
        <SignIn />
      </Route>
      <Route exact path="/api/profile">
        <Profile />
      </Route>
      <Route exact path="/api/createpost">
        <CreatePost />
      </Route>
      <Route exact path="/api/userprofile/:userId">
        <UserProfile />
      </Route>
      <Route exact path="/api/myfollowposts">
        <FollowedUserPost />
      </Route>
      <Route exact path="/api/reset">
        <Reset />
      </Route>
      <Route exact path="/api/reset/:token">
        <NewPassword />
      </Route>
      <Route exact path="/api/confirm/:token">
        <ConfirmSignIn />
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>


  );
}

export default App;
