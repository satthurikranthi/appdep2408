import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from 'axios';


function Login() {

    let emailInputRef = useRef();
    let passwordInputRef = useRef();

    let navigate = useNavigate();
    let dispatch = useDispatch();

    axios.defaults.baseURL = "http://localhost:4567";

    useEffect(() => {
       if(localStorage.getItem("token")){
        
       //sendTokenToServer()
       axios.defaults.headers.common['authorization'] = 
       localStorage.getItem("token")

       
       };  

    }, []);

    let onLogin = async () => {
        console.log("onLogin");
       // const email = emailInputRef.current.value;
        //const password = passwordInputRef.current.value;

        let dataToSend = new FormData();
        dataToSend.append("email",emailInputRef.current.value);
        dataToSend.append("password",passwordInputRef.current.value);

        // const reqOptions = {
        //     method: "POST",
        //     body: dataToSend // Send email and password as JSON
        // };

let response = await axios.post("/login",dataToSend);
console.log(response)
if (response.status === "failure") {
    console.log(response.data.msg)
   
} else {
    localStorage.setItem("token", response.data.data.token);
    dispatch({ type: "login", data: response.data.data });
    navigate("/dashboard");
}

    };

    let sendTokenToServer = async () => {
        const token = localStorage.getItem("token");
    
        const reqOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Set content type as JSON
            },
            body: JSON.stringify({ token }) // Send token as JSON
        };
    
        try {
            const response = await fetch("http://localhost:4567/validateToken", reqOptions);
            const data = await response.json();
    
            console.log(data); // Log to check the response structure
    
            if (!data || data.status !== "success") {
                console.error("Error: Token validation failed");
                alert("Token validation failed");
                return;
            }
    
            if (data.status === "success") {
                alert(data.msg);
            } else {
                localStorage.setItem("token", data.data.token);
                dispatch({ type: "login", data: data.data });
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Failed to fetch:", error);
        }
    };
    
    let onLogin1 = async () => {
        console.log("onLogin");
       // const email = emailInputRef.current.value;
        //const password = passwordInputRef.current.value;

        let dataToSend = new FormData();
        dataToSend.append("email",emailInputRef.current.value);
        dataToSend.append("password",passwordInputRef.current.value);

        const reqOptions = {
            method: "POST",
            body: dataToSend // Send email and password as JSON
        };

        try {
            const response = await fetch("http://localhost:4567/login", reqOptions);
            const data = await response.json();
            console.log(data);

            if (data.status === "success") {
                console.log("if")
                localStorage.setItem("token", data.data.token);
                dispatch({ type: "login", data: data.data });
                navigate("/dashboard");
            } else {
                console.log("else")
                alert(data.msg);
            }
        } catch (error) {
            console.error("Failed to fetch:", error);
        }
    };

    return (
        <div className="App">
            <form>
                <div>
                    <h2>Login</h2>
                    <div>
                        <label>Email</label>
                        <input ref={emailInputRef} type="email" value="gouthamikuna@gmail.com"/>
                    </div>
                    <div>
                        <label>Password</label>
                        <input ref={passwordInputRef} type="password" value="1234" />
                    </div>
                    <div>
                        <button type="button" onClick={onLogin1}>Login</button>
                        <button type='button' onClick={onLogin}>Login(Axios)</button>
                    </div>
                </div>
            </form>
            <div>
                <Link to="/signup">Signup</Link>
            </div>
        </div>
    );
}

export default Login;