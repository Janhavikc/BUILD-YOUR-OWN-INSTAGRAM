import React,{useEffect,useContext, createContext,useReducer} from 'react'
import NavBar from './components/Navbar'
import "./App.css"
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screen/Home'
import Signin from './components/screen/Signin'
import Signup from './components/screen/Signup'
import Profile from './components/screen/Profile'
import Userprofile from './components/screen/UserProfile'
import CreatePost from './components/screen/Createpost'
import SubscriberUserPosts from './components/screen/SubscribeUserPost'
import {reducer,initialState} from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () =>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user= JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }
    else{
      history.push('/signin')
    }
  },[])
  return(
  <Switch>
    <Route exact path="/">
      <Home/>
    </Route>
    <Route path="/signin">
      <Signin/>
    </Route>
    <Route path="/signup">
      <Signup/>
    </Route>
    <Route exact path="/profile">
      <Profile/>
    </Route>
    <Route path="/createpost">
      <CreatePost/>
    </Route>
    <Route path="/profile/:userid">
      <Userprofile/>
    </Route>
    <Route path="/myfollowingspost">
      <SubscriberUserPosts/>
    </Route>
  </Switch>
  )
}

function App() {
  const [state,dispatch]=useReducer(reducer,initialState)
  return (
   <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter> 
      <NavBar/>
      <Routing/>
      </BrowserRouter> 
    </UserContext.Provider>
   
  );
}

export default App;
