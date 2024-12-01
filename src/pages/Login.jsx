import {useState}from 'react';
import "../styles/Login.css";


const Login=()=>{
  const [isSignUp,setIsSignUp]=useState(false);
  
  const handleSignUp=()=>{
    setIsSignUp(!isSignUp);
  }
  return(
    <div className="login-background"  >
  <div className="login-container" style={!isSignUp ? {display: ""}:{display:"none"}} >
  <h1 className="form-title">Register</h1>
  <form method="post" action="">
    <div  className="messageDiv" ></div>
    <div className="input-group">
       <i className="fas fa-user"></i>
       <label Account Name >
         <input type="text"  placeholder="Name" required>
         </input></label>
    </div>

    <div className="input-group">
        <i className="fas fa-envelope"></i>
        <label Email>
        <input type="email" placeholder="Email" required></input>
      </label>
    </div>
    <div className="input-group">
        <i className="fas fa-lock"></i>
        
        <label Password> 
          <input type="password"  placeholder="Password" required></input>
      </label>
    </div>
    
    <button className="btn" >Sign Up</button>
  </form>

  <p className="or">
    ----------or--------
  </p>
  <div className="icons">
      <i className="fab fa-google" ></i> Đăng nhập với Google
  </div>
  
  <div className="links">
    <p>Already Have Account ?</p>
    <button type="button" onClick={handleSignUp}>Sign In</button>
  </div>
</div>

<div className="login-container" style={isSignUp ?{display: ""}:{display:"none"}} >
    <h1 className="form-title">Sign In</h1>
    <form method="post" action="">
      <div  className="messageDiv"></div>

      <div className="input-group">
          <i className="fas fa-envelope"></i>
          
          <label Email>
            <input type="email" placeholder="Email" required></input>
        </label>
      </div>
      <div className="input-group">
          <i className="fas fa-lock"></i>
        
          <label Password>
            <input type="password"   placeholder="Password" required></input>
        </label>
      </div>
      {/* <p className="recover">
    <a href="#">Recover Password</a>
  </p> */}
     <button  className="btn"  >Sign In</button>
    </form>

    <p className="or">
      ----------or--------
    </p>
    <div className="icons">
        <i className="fab fa-google" ></i> Đăng nhập với Google
    </div>

    <div className="links">
      <p>Don't have account yet?</p>
      <button type="button" onClick={handleSignUp}>Sign Up</button>
    </div>
</div>
    </div>
      )
}
export default Login;