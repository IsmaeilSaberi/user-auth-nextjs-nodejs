"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { FiRefreshCcw } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";

//FOR UPDATING MINI DATA
import { useForm } from "react-hook-form";

const Info = ({ cookie }) => {
  const [data, setData] = useState([-1]);
  const [needRefresh, setNeedRefresh] = useState(0);

  useEffect(() => {
    if (cookie && cookie.length > 0) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/user/get-part-of-user-data/info`,
          {
            headers: { auth_cookie: cookie },
          }
        )
        .then((d) => {
          setData(d.data);
          console.log(d.data);
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
      setNeedRefresh(0);
    }
  }, [cookie, needRefresh]);

  //FOR UPDATING MINI DATA
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({});

  const miniUpdater = () => {
    const formData = {
      password: watch("password"),
      rePassword: watch("repassword"),
    };
    const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/user/update-mini-user/${data._id}`;
    axios
      .post(backendUrl, formData, {
        headers: { auth_cookie: cookie },
      })
      .then((d) => {
        const message = d.data.msg
          ? d.data.msg
          : "تغییر اطلاعات با موفقیت انجام شد!";
        toast.success(message, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setNeedRefresh(1);
      })
      .catch((err) => {
        const errorMsg =
          err.response && err.response.data && err.response.data.msg
            ? err.response.data.msg
            : "خطا";
        toast.error(errorMsg, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  // LOGOUT
  const router = useRouter();
  const logouter = () => {
    Cookies.set("auth_cookie", "", { expires: 0 });
    router.push("/login");
  };

  return (
    <div className="flex flex-col gap-10 relative pt-8">
      <>
        <title>اطلاعات من</title>
        <meta name="description" content="اطلاعات من" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="http://localhost:3000/account/info" />
      </>
      <h3 className="text-lg absolute top-1 right-1 ">اطلاعات من</h3>
      <div
        onClick={() => {
          setNeedRefresh(1);
          setData([-1]);
        }}
        className="absolute top-1 left-0 flex justify-center items-center rounded cursor-pointer transition-all duration-200 text-white hover:bg-indigo-400 text-sm gap-1 w-28 h-10 bg-[#2357b1]"
      >
        <FiRefreshCcw />
        به روز رسانی
      </div>
      <div>
        {data[0] == -1 ? (
          <div className="flex justify-center items-center p-12">
            <Image
              alt="loading"
              width={120}
              height={120}
              src={"/loading.svg"}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center gap-6 flex-wrap">
              <div className="flex justify-center gap-4 items-center bg-[#e5fcde] w-full md:w-60 text-sm h-10 rounded p-1">
                <div>تاریخ ثبت نام:</div>
                <div>{data.createdAt}</div>
              </div>
              <div className="flex justify-center gap-4 items-center bg-[#e5fcde] w-full md:w-60 text-sm h-10 rounded p-1">
                <div>تاریخ به روز رسانی:</div>
                <div>{data.updatedAt}</div>
              </div>
            </div>
            <div className="flex flex-col gap-8 bg-[#e5fcde] w-full text-sm rounded p-4">
              <div className="flex justify-start items-center gap-4">
                <div>نام کاربری:</div>
                <div>{data.username.replace(/_/g, " ")}</div>
              </div>
              <div className="flex justify-start items-center gap-4">
                <div>نام نمایشی:</div>
                <div>{data.username.replace(/_/g, " ")}</div>
              </div>
              <div className="flex justify-start items-center gap-4">
                <div>آدرس ایمیل:</div>
                <div>{data.email}</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-8 bg-[#e5fcde] w-full text-sm rounded p-4">
              <div>به روز رسانی اطلاعات</div>
              <form
                onSubmit={handleSubmit(miniUpdater)}
                className="flex flex-col gap-6 m-8 w-full md:w-[30rem] bg-[#9bf5d4] rounded p-6"
              >
                <div className="flex flex-col gap-1">
                  <input
                    type="password"
                    autoComplete="off"
                    placeholder="رمز عبور جدید"
                    className="p-2 w-full outline-none border-zinc-400 border-2 rounded focus:border-[#18e52d] "
                    {...register("password", {
                      required: true,
                      maxLength: 20,
                      minLength: 8,
                    })}
                  />
                  {errors.password && errors.password.type == "required" && (
                    <div className="text-rose-500 text-sm">
                      رمز عبور وارد نشده است!
                    </div>
                  )}
                  {errors.password && errors.password.type == "maxLength" && (
                    <div className="text-rose-500 text-sm">
                      رمز عبور باید کمتر از 20 کاراکتر باشد!
                    </div>
                  )}
                  {errors.password && errors.password.type == "minLength" && (
                    <div className="text-rose-500 text-sm">
                      رمز عبور باید بیشتر از 6 کاراکتر باشد!
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="password"
                    autoComplete="off"
                    placeholder="تکرار رمز عبور جدید"
                    className="p-2 w-full outline-none border-zinc-400 border-2 rounded focus:border-[#18e52d] "
                    {...register("repassword", {
                      required: true,
                      validate: (val) => val === watch("password"),
                    })}
                  />
                  {errors.repassword &&
                    errors.repassword.type == "required" && (
                      <div className="text-rose-500 text-sm">
                        تکرار رمز عبور وارد نشده است!
                      </div>
                    )}
                  {errors.repassword &&
                    errors.repassword.type == "validate" && (
                      <div className="text-rose-500 text-sm">
                        رمز عبور وارد شده مطابقت ندارد!
                      </div>
                    )}
                </div>
                <button
                  type="submit"
                  className="bg-[#b17d23] rounded p-2 text-white w-full transitioln-all duration-200 hover:bg-indigo-700"
                >
                  به روز رسانی
                </button>
              </form>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-8 bg-[#e5fcde] w-full text-sm rounded p-4">
              <div
                onClick={logouter}
                className="flex justify-around md:justify-center items-center rounded cursor-pointer transition-all duration-200 hover:bg-indigo-300 text-sm gap-1 w-full md:w-60 h-10 bg-indigo-200"
              >
                خروج از حساب کاربری
                <BiLogOut className="w-8 h-8 text-[#bf535b]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
