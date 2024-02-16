"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AdminPannel = () => {
  const [newItemsData, setNewItemsData] = useState(-1);
  const [auth_cookie, setauth_cookie] = useState(Cookies.get("auth_cookie"));

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-new-items`, {
        headers: { auth_cookie: auth_cookie },
      })
      .then((d) => {
        setNewItemsData(d.data);
      })
      .catch((err) => {
        toast.error("خطا در لود اطلاعات!", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setNewItemsData(0);
      });
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-lg md:text-xl p-4">پیشخوان مدیریتی</h2>
      <div>
        {newItemsData == -1 ? (
          <div className="flex justify-center items-center p-12">
            <Image
              alt="loading"
              width={120}
              height={120}
              src={"/loading.svg"}
            />
          </div>
        ) : newItemsData == 0 ? (
          <div>خطا در لود اطلاعات!</div>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <span className="rounded-full px-2 border-[0.05rem] border-red-600">
                {newItemsData.newUsersNumber}
              </span>{" "}
              کاربر جدید
            </div>
            <div>
              <span className="rounded-full px-2 border-[0.05rem] border-red-600">
                {newItemsData.newCommentsNumber}
              </span>{" "}
              کامنت جدید
            </div>
            <div>
              <span className="rounded-full px-2 border-[0.05rem] border-red-600">
                {newItemsData.newPaymentsNumber}
              </span>{" "}
              سفارش جدید
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPannel;
