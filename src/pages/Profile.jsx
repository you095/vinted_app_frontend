import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { currentUser, api } = useAuth();
  const [dummyData, setDummyData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDummyData = async () => {
      try {
        const response = await api.get("/dummy");
        console.log("Dummy API Response:", response.data);
        setDummyData(response.data);
      } catch (err) {
        console.error("Error fetching dummy data:", err);
        setError(err.message);
      }
    };

    fetchDummyData();
  }, [api]);

  return (
    <div className="profile container">
      <div className="profile-header">
        <div className="profile-info">
          <img
            src={currentUser.photoURL || "/default-avatar.png"}
            alt="Profile"
            className="profile-avatar"
          />
          <div className="profile-details">
            <h1>{currentUser.displayName || "User"}</h1>
            <p>{currentUser.email}</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Dummy Data</h2>
          {error ? (
            <div className="error-message">Error: {error}</div>
          ) : dummyData ? (
            <pre className="dummy-data">
              {JSON.stringify(dummyData, null, 2)}
            </pre>
          ) : (
            <p>Loading dummy data...</p>
          )}
        </div>

        <div className="profile-section">
          <h2>My Items</h2>
          <div className="items-grid">{/* Add user's items here */}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
