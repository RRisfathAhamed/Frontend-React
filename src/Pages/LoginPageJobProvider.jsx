import React from "react";
import LoginComponent from "../Components/LoginJobSeeker";
import LoginJobProvider from "../Components/LoginJobProvider";
import NavBarComponent from "../Components/NavigationBar";

const LoginPageJobProvider = () => {
  return (
    <div>
        {/* <NavBarComponent/> */}
      <LoginJobProvider />
    </div>
  );
};

export default LoginPageJobProvider;
