import {useState,useRef,useEffect}from 'react';
import {signInWithGoogle,signUp,login} from "../components/firebaseAuth.js"
import { useLoader } from "../components/LoaderContext";
import {useToast} from "../components/ToastContext";
import "../styles/Login.css"

const Login=()=>{
  const [isSignUp,setIsSignUp]=useState(false);
  const {showToast} =useToast();
  const {showLoader,hideLoader} =useLoader();
  const registerRef = useRef();
  const registerNameRef = useRef();
  const registerEmailRef = useRef();
  const registerPasswordRef = useRef();
  const loginRef = useRef();
  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();
  const handleSignUp=()=>{
    setIsSignUp(!isSignUp);
  }
  const [isLogin,setIsLogin] = useState(false);
  const checkIsLogin = ()=>{
    const check = localStorage.getItem("loggedInUserId");
    if(check == null){
      return
    }
    setIsLogin(true);
  }
  useEffect(()=>{
    checkIsLogin();
  },[]);
  
  const handleSignInWithGoogle = async()=>{
    try{
    showLoader("Đang đăng nhập với google");
    const final = await signInWithGoogle();
    if(final == "kimochi"){
        setTimeout(()=>{
          window.location.href = '/'
        },1500);
    }
    if(final =="FirebaseError: Firebase: Error (auth/popup-closed-by-user)."){
      showToast("Đã hủy","error");
      return
    }
      
    showToast("Login thành công","success")
    }catch(error){
      alert(error);
    }finally{
      hideLoader();
    }
  }

  const handleSubmitSignUp = async()=>{
    event.preventDefault();
    try{
      const name = registerNameRef.current.value;
      const email= registerEmailRef.current.value;
      const pass = registerPasswordRef.current.value;
      if(pass.length <6){
        showToast("Mật khẩu quá ngắn","error")
        return
      }
      const isConfirm=confirm(
  "Đăng kí với tài khoản này?\n" +
  "Email: " + email + "\n" +
  "Tên: " + name + "\n" +
  "Mật khẩu: " + pass
);

      if(!isConfirm){
        showToast("Đã hủy đăng kí");
        return
      }
      showLoader("Đang đăng kí account");
      const final = await signUp(name,email,pass);
      if(final =="Đã tồn tại account"){
        showToast("Email đã tồn tại","error")
        return
      }
      if(final =="kimochi"){
        showToast("Đăng kí thành công !","success");
        registerRef.current.reset();
        setTimeout(()=>{
          window.location.href = '/'
        },1500);
      }
    }catch(error){
      alert(error);
    }finally{
      hideLoader();
    }
  }
    const handleSubmitLogin = async()=>{
      event.preventDefault();
    try{
      showLoader("Đang đăng nhập");
      const email = loginEmailRef.current.value;
      const pass = loginPasswordRef.current.value;
      const final = await login(email,pass);
      if(final =="kimochi"){
        showToast("Login thành công!","success");
         setTimeout(()=>{
          window.location.href = '/'
        },1500);
      }else{
        alert(final);

      }
    }catch(error){
      alert(error);
    }finally{
      hideLoader();
    }
  }

  return(
    <>
    <div className="login-background"  style={!isLogin ? {display: ""}:{display:"none"}}>
      
  <div className="login-container" style={isSignUp ? {display: ""}:{display:"none"}} >
  <h1 className="form-title animated3" >Register</h1>
  <form  ref={registerRef} onSubmit={handleSubmitSignUp}>
    <div  className="messageDiv" ></div>
    <div className="input-group">
       
       <label  >Account Name
         <input type="text"  placeholder="Name" required ref={registerNameRef}>
         </input>
      <i className="fas fa-user"></i></label>
    </div>

    <div className="input-group">
        
        <label >Email
        <input type="email" placeholder="Email" required ref={registerEmailRef}></input>
          <i className="fas fa-envelope"></i>
      </label>
    </div>
    <div className="input-group">
        
        
        <label > Password
          <input type="password"  placeholder="Password" required ref={registerPasswordRef}></input>
          <i className="fas fa-lock"></i>
      </label>
    </div>
    
    <button className="sign-in" type="submit" >Sign Up</button>
  </form>

  <p className="or">
    ----------or--------
  </p>
  <div className="icons">
      <i className="fab fa-google" type="button" onClick={handleSignInWithGoogle}></i> Đăng nhập với Google
  </div>
  
  <div className="links">
    <p>Already Have Account ?</p>
    <button type="button" className="loginBtn" onClick={handleSignUp}>Login</button>
  </div>
</div>

<div className="login-container" style={!isSignUp ?{display: ""}:{display:"none"}} >
    <h1 className="form-title animated3">Login</h1>
    <form  ref={loginRef} onSubmit={handleSubmitLogin}>
      <div  className="messageDiv"></div>

      <div className="input-group">
          
          
          <label >Email
            <input type="email" placeholder="Email" required ref={loginEmailRef}></input>
            <i className="fas fa-envelope"></i>
        </label>
      </div>
      <div className="input-group">
         
        
          <label >Password
            <input type="password"   placeholder="Password" required ref={loginPasswordRef}></input>
             <i className="fas fa-lock"></i>
        </label>
      </div>
      {/* <p className="recover">
    <a href="#">Recover Password</a>
  </p> */}
     <button className="sign-in" type="submit" >Login</button>
    </form>

    <p className="or">
      ----------or--------
    </p>
    <div className="icons">
        <i className="fab fa-google" type="button" onClick={handleSignInWithGoogle}></i> Đăng nhập với Google
    </div>

    <div className="links">
      <p>Don't have account yet?</p>
      <button type="button" className="loginBtn" onClick={handleSignUp}>Sign Up</button>
    </div>
</div>
    </div>
      <div style={isLogin ? {display: ""}:{display:"none"}}><p>Đã đăng nhập rồi yamate</p></div>
    </>
      )
}
export default Login;