import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TopNavigation from './TopNavigation';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const storeObj = useSelector((store) => store.loginReducer);

    const deleteProfile = async () => {
        console.log("delete profile")
        try {
            const reqOptions = {
                method: "DELETE",
            };

            const url = `http://localhost:4567/deleteProfile?email=${encodeURIComponent(
                storeObj?.loginDetails?.email
            )}`;

            const response = await fetch(url, reqOptions);
            const result = await response.json();

            alert(result.msg);

            if (result.status === "success") {
                navigate("/");
            }
        } catch (error) {
            console.error("Error deleting profile:", error);
            alert("Failed to delete the profile.");
        }
    };

    return (
        <div>
            <TopNavigation />
            <h2>Dashboard</h2>
            <h3>
                {storeObj?.loginDetails?.firstName} {storeObj?.loginDetails?.lastName}
            </h3>

            <button onClick={deleteProfile}>Delete Profile</button>
            <br />
            <button
                onClick={() => {
                    dispatch({ type: "applyLeave", data: 1 });
                }}
            >
                Apply Leave
            </button>
            <button
                onClick={() => {
                    dispatch({ type: "cancelLeave", data: 1 });
                }}
            >
                Cancel Leave
            </button>
            <button
                onClick={() => {
                    dispatch({ type: "Add Task", data: 1 });
                }}
            >
                Add Task
            </button>
            <button
                onClick={() => {
                    dispatch({ type: "submit Task", data: 1 });
                }}
            >
                Submit Task
            </button>
            <button
                onClick={() => {
                    dispatch({ type: "Hire Employee", data: 1 });
                }}
            >
                Hire Employee
            </button>
            <button
                onClick={() => {
                    dispatch({ type: "Fire Employee", data: 6 });
                }}
            >
                Fire Employee
            </button>

            {storeObj?.loginDetails?.profilepic && (
                <img
                    src={`http://localhost:4567/${storeObj.loginDetails.profilepic}`}
                    alt="Profile"
                />
            )}
        </div>
    );
}

export default Dashboard;