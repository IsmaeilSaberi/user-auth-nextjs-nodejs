"use client";
import axios from "axios";
import { AppContext } from "../app-context";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";

const ContextProvider = ({ children }) => {
  const [auth_cookie, setauth_cookie] = useState(Cookies.get("auth_cookie"));
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/get-displayname`, {
        headers: { auth_cookie: auth_cookie },
      })
      .then((d) => {
        setDisplayName(d.data.displayName.username);
      })
      .catch((err) => {
        setDisplayName("");
      });
  }, [Cookies.get("auth_cookie"), auth_cookie]);

  return (
    <AppContext.Provider value={{ displayName, setDisplayName }}>
      {children}
      <ToastContainer
        bodyClassName={() => "font-[shabnam] text-sm flex items-center"}
        position="top-right"
        autoClose={3000}
        theme="colored"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AppContext.Provider>
  );
};

export default ContextProvider;
