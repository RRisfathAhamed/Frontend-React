import React, { useState, useEffect } from "react";
import FloatContent from "../Components/Float";
import RoleSelectionComponent from "../Components/RoleSelectionComponent";
import Navigation from "../Components/Navigation";
import NavBarComponent from "../Components/NavigationBar";

const HomePage = () => {
  const [loginStatus, setLoginStatus] = useState(
    localStorage.getItem("loginSuccess") === "true"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setLoginStatus(localStorage.getItem("loginSuccess") === "true");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div>
      {/* <NavBarComponent /> */}
      <FloatContent />
      {loginStatus ? null : <RoleSelectionComponent />}
      {/* <Navigation/> */}
    </div>
  );
};

export default HomePage;
