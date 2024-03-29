"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Box from "./Box";
import Image from "next/image";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const AllSliders = ({ setSliderDetailCtrl, setRandNumForSliderClick }) => {
  const [auth_cookie, setauth_cookie] = useState(Cookies.get("auth_cookie"));

  const [sliders, setSliders] = useState([-1]);
  const [btnNumbers, setBtnNumbers] = useState([-1]);
  const [filteredBtns, setFilteredBtns] = useState([-1]);
  const [pageNumber, setPageNumber] = useState(1);
  const [allSlidersNumbers, setAllSlidersNumbers] = useState(0);
  const paginate = 10;

  const goToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/sliders?pn=${pageNumber}&&pgn=${paginate}`,
        {
          headers: { auth_cookie: auth_cookie },
        }
      )
      .then((d) => {
        setSliders(d.data.GoalSliders);
        setBtnNumbers([
          ...Array(Math.ceil(d.data.AllSlidersNumber / paginate)).keys(),
        ]);
        setAllSlidersNumbers(d.data.AllSlidersNumber);
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
        console.log("خطا!");
      });
  }, [pageNumber]);

  useEffect(() => {
    if (btnNumbers[0] != -1 && btnNumbers.length > 0) {
      const arr = [];
      btnNumbers.map((n) => {
        if (
          n == 0 ||
          (n < pageNumber + 1 && n > pageNumber - 3) ||
          n == btnNumbers.length - 1
        ) {
          arr.push(n);
        }
      });
      setFilteredBtns(arr);
    } else if (btnNumbers.length == 0) {
      setFilteredBtns([]);
    }
  }, [btnNumbers]);

  return (
    <div className=" flex flex-col gap-8">
      <div className="flex justify-end items-center">
        <div className="w-32 h-10 rounded bg-[#2357b1] flex justify-center items-center text-white">
          {allSlidersNumbers} اسلایدر
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {sliders[0] == -1 ? (
          <div className="flex justify-center items-center p-12">
            <Image
              alt="loading"
              width={120}
              height={120}
              src={"/loading.svg"}
            />
          </div>
        ) : sliders.length < 1 ? (
          <div className="flex justify-center items-center w-full p-8">
            اسلایدری موجود نیست!
          </div>
        ) : (
          sliders.map((slider, i) => (
            <Box
              key={i}
              setRandNumForSliderClick={setRandNumForSliderClick}
              setSliderDetailCtrl={setSliderDetailCtrl}
              data={slider}
            />
          ))
        )}
      </div>
      <div className="flex justify-center items-center gap-2">
        {filteredBtns[0] == -1 ? (
          <div className="flex justify-center items-center p-12">
            <Image alt="loading" width={40} height={40} src={"/loading.svg"} />
          </div>
        ) : (
          filteredBtns.map((n, i) => (
            <button
              className={
                n + 1 == pageNumber
                  ? "rounded-full w-8 h-8 bg-[#b17d23] text-white flex justify-center items-center transition-all duration-300 hover:bg-[#b17d23]"
                  : "rounded-full w-8 h-8 bg-[#2357b1] text-white flex justify-center items-center transition-all duration-300 hover:bg-[#b17d23]"
              }
              onClick={() => {
                n + 1 == pageNumber ? console.log("") : setSliders([-1]);
                setPageNumber(n + 1);
                goToTop();
              }}
              key={i}
            >
              {n + 1}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default AllSliders;
