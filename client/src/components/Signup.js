import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Signup() {
    const firstNameInputRef = useRef();
    const lastNameInputRef = useRef();
    const ageInputRef = useRef();
    const emailInputRef = useRef(); 
    const passwordInputRef = useRef(); 
    const mobileNoInputRef = useRef();
    const profilepicInputRef = useRef();
    const [profilePicPath, setProfilePicPath] = useState("./images/dummy.jpg");

    // Cleanup URL object when the component is unmounted
    

    // Submit using FormData
    const onSubmitUsingFormData = async () => {
        const dataToSend = new FormData();
        dataToSend.append("firstName", firstNameInputRef.current.value);
        dataToSend.append("lastName", lastNameInputRef.current.value);
        dataToSend.append("age", ageInputRef.current.value);
        dataToSend.append("email", emailInputRef.current.value);
        dataToSend.append("password", passwordInputRef.current.value);
        dataToSend.append("mobileNo", mobileNoInputRef.current.value);

       
            for (let i = 0; i < profilepicInputRef.current.files.length; i++) {
                dataToSend.append("profilepic", profilepicInputRef.current.files[i]);
            }
        

        try {
            const reqOptions = {
                method: "POST",
                body: dataToSend,
            };

            const response = await fetch("/signup", reqOptions);
            const data = await response.json();
            console.log(data);
            alert(data.msg);
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="App">
            <form>
                <h2>Signup</h2>
                <div>
                    <label>First Name</label>
                    <input ref={firstNameInputRef} name="firstName" />
                </div>
                <div>
                    <label>Last Name</label>
                    <input ref={lastNameInputRef} name="lastName" />
                </div>
                <div>
                    <label>Age</label>
                    <input ref={ageInputRef} name="age" />
                </div>
                <div>
                    <label>Email</label>
                    <input ref={emailInputRef} name="email" />
                </div>
                <div>
                    <label>Password</label>
                    <input ref={passwordInputRef} name="password" type="password" />
                </div>
                <div>
                    <label>Mobile No</label>
                    <input ref={mobileNoInputRef} name="mobileNo" />
                </div>
                <div>
                    <label>Profile Pic</label>
                    <input
                        ref={profilepicInputRef}
                        type="file"
                   
                        onChange={(event) => {
                            const selectedPicPath = URL.createObjectURL(event.target.files[0]);
                            setProfilePicPath(selectedPicPath);
                        }}
                    />
                </div>
                <div>
                    <img className="profilepicpreview" src={profilePicPath} alt="Profile Preview" />
                </div>
                <div>
                    <button type="button" onClick={onSubmitUsingFormData}>Submit</button>
                </div>
            </form>
            <div>
                <Link to="/">Login</Link>
            </div>
        </div>
    );
}

export default Signup;
