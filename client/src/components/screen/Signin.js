import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'
const Signin = () =>{
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const [email,setEmail] = useState("")
    const [password,setPassword] =useState("")
    const PostData = ()=>{
        
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })   
        }).then(res=>res.json())
        .then(data=>{
           if(data.error){
            M.toast({html: data.error,classes:"#b71c1c red darken-4"})
           }
           else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html: "Invalid Email",classes:"#b71c1c red darken-4"})
            return
            }
           else{

                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"Signin successfully",classes:"#1b5e20 green darken-4"})   
                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className="mycard">
            <div className="card auth-card .input-field">
                <h2>Instagram</h2>
                <input 
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}      
                    />
                <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}      
                />
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={()=>PostData()}>Login</button>
                <h5><Link to ="/signup">Don't have an account?</Link></h5>
            </div>
        </div>
    )
}

export default Signin