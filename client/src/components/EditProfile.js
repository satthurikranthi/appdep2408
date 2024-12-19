import React, { useRef, useState ,useEffect} from 'react';
import { Link } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import { useSelector } from 'react-redux';

function EditProfile() {
    const firstNameInputRef = useRef();
    const lastNameInputRef = useRef();
    const ageInputRef = useRef();
    const emailInputRef = useRef(); 
    const passwordInputRef = useRef(); 
    const mobileNoInputRef = useRef();
    const profilepicInputRef = useRef();
    const [profilePicPath, setProfilePicPath] = useState("./images/dummy.jpg");

    let storeObj  = useSelector((store)=>{
      return store.loginReducer;
    });

    useEffect(()=>{
      firstNameInputRef.current.value = storeObj.loginDetails.firstName;
      lastNameInputRef.current.value = storeObj.loginDetails.lastName;
      ageInputRef.current.value = storeObj.loginDetails.age;
      emailInputRef.current.value = storeObj.loginDetails.email;
      mobileNoInputRef.current.value = storeObj.loginDetails.mobileNo;
      setProfilePicPath(`/${storeObj.loginDetails.profilePic}`);

    },[]);

    // Submit using FormData
    const onSubmitUsingFormData = async () => {
        const dataToSend = new FormData();
        dataToSend.append("firstName", firstNameInputRef.current.value);
        dataToSend.append("lastName", lastNameInputRef.current.value);
        dataToSend.append("age", ageInputRef.current.value);
        dataToSend.append("email", emailInputRef.current.value);
        dataToSend.append("password", passwordInputRef.current.value);
        dataToSend.append("mobileNo", mobileNoInputRef.current.value);
        for(let i=0;i<=profilepicInputRef.current.files.length;i++){
            dataToSend.append("profilepic", profilepicInputRef.current.files[i]);

        }
    
        const reqOptions = {
            method: "PUT",
            body: dataToSend,
        };

        const JSONData = await fetch("/updateprofile", reqOptions);
        const JSOData = await JSONData.json();
        console.log(JSOData);
        alert(JSOData.msg);
    };

    return (
        <div className="App">
          <TopNavigation></TopNavigation>
        <form>
            <h2>EditProfile</h2>
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
                <input ref={emailInputRef} readOnly name="email" />
            </div>
            <div>
                <label>Password</label>
                <input ref={passwordInputRef} name="password" />
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
                
               <br></br> 
                <button type="button" onClick={() => {
                  onSubmitUsingFormData();
                  }}>
                   Update profile
                </button>
            </div>
        </form>
         <div>
         <Link to="/">Login</Link>
     </div>
    </div>
    );
}

export default EditProfile;