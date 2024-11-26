import React from "react";

const FooterComponent = () => {
  return (
    <div className="bg-gray-800 text-white py-4">
      <footer className="flex justify-center items-center">
        <img
          src={require("../img/gov-lk.png")}
          alt="Government Logo"
        //   className="mr-2 w-10 h-10" // Adjust the size of the image
        />
        <span className="flex items-center text-sm">
          | All Rights Reserved &copy; {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
};

export default FooterComponent;