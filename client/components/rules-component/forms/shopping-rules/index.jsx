"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ShoppingRules = () => {
  const [data, setData] = useState("");
  const [needRefresh, setNeedRefresh] = useState(1);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-rule/shopping`)
      .then((d) => {
        setData(d.data);
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
      });
    setNeedRefresh(1);
  }, [needRefresh]);

  return (
    <main className="container mx-auto shadow-lg rounded overflow-hidden">
      <div className="md:flex">
        <div className="flex flex-col gap-4 p-2">
          <div className="uppercase tracking-wide text-sm text-[#bf535b] font-semibold">
            {data.title}
          </div>
          {data == "" ? (
            <div className="flex w-full justify-center items-center p-12">
              <Image
                alt="loading"
                width={120}
                height={120}
                src={"/loading.svg"}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="mt-2 text-justify">{data.description}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ShoppingRules;
