"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import Cookies from "js-cookie";

const CommentDetails = ({ commentId }) => {
  const [auth_cookie, setauth_cookie] = useState(Cookies.get("auth_cookie"));

  // the part for prevent for submitting with enter key
  const formKeyNotSuber = (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
    }
  };

  /// go to top or scroll up smoothly function
  const goToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  const viewedRef = useRef();
  const publishedRef = useRef();
  const emailRef = useRef();
  const displaynameRef = useRef();
  const messageRef = useRef();

  // this part used for getting one payment details for using in default values
  const [fullData, setFullData] = useState([-1]);
  const [needToRefresh, setNeedToRefresh] = useState(1);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-comment/${commentId}`,
        {
          headers: { auth_cookie: auth_cookie },
        }
      )
      .then((d) => {
        setFullData(d.data);
        goToTop();
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
  }, [commentId, needToRefresh]);

  // here we update a comment details
  const updater = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
    }
    e.preventDefault();
    const formData = {
      email: emailRef.current.value,
      viewed: viewedRef.current.value,
      published: publishedRef.current.value,
      displayname: displaynameRef.current.value,
      message: messageRef.current.value,
    };

    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-comment/${commentId}`;
    axios
      .post(url, formData, {
        headers: { auth_cookie: auth_cookie },
      })
      .then((d) => {
        toast.success("دیدگاه با موفقیت آپدیت شد.", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        let message = "خطایی در آپدیت و ذخیره دیدگاه رخ داد.";
        if (err.response.data.msg) {
          message = err.response.data.msg;
        }
        toast.error(message, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  // this part is used to publish a comment
  const publisher = () => {
    const sendingData = {
      goalId: fullData._id,
      parentId: fullData.parentId,
      email: fullData.email,
    };
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/publish-comment`;
    axios
      .post(url, sendingData, {
        headers: { auth_cookie: auth_cookie },
      })
      .then((d) => {
        toast.success("انتشار دیدگاه و ارسال ایمیل با موفقیت انجام شد.", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setNeedToRefresh(needToRefresh * -1);
        setFullData([-1]);
      })
      .catch((err) =>
        toast.error("موفقیت آمیز نبود!", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      );
  };

  // this part is used to delete a comment
  const remover = () => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/remove-comment/${commentId}`;
    axios
      .post(
        url,
        { item: 1 },
        {
          headers: { auth_cookie: auth_cookie },
        }
      )
      .then((d) =>
        toast.success("دیدگاه با موفقیت حذف شد.", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      )
      .catch((err) =>
        toast.error("حذف موفقیت آمیز نبود!", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      );
  };

  return (
    <div className="flex flex-col gap-6">
      {fullData[0] == -1 ? (
        <div className="flex justify-center items-center p-12">
          <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-orange-500 text-lg">جزئیات دیدگاه</h2>
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => publisher()}
                className="bg-sky-500 text-white px-3 py-1 rounded text-xs transition-all duration-200 hover:bg-sky-600"
              >
                انتشار + ایمیل در صورت پاسخ بودن
              </button>
              <button
                onClick={() => remover()}
                className="bg-rose-500 text-white px-3 py-1 rounded text-xs transition-all duration-200 hover:bg-rose-600"
              >
                حذف
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
            <Link
              href={
                fullData.typeOfModel == "post"
                  ? `/blog/${fullData.src.slug}`
                  : `/shop/${fullData.src.slug}`
              }
              target="_blank"
              className="bg-green-600 text-white rounded px-3 py-1 text-sm flex justify-center items-center"
            >
              {fullData.src.title}
            </Link>
            <div className="bg-[#e5fcde] rounded px-3 py-1 text-sm flex justify-center items-center gap-2">
              <div> دیدگاهی برای یک :</div>
              <div>{fullData.typeOfModel == "post" ? "مقاله" : "محصول"}</div>
            </div>
            <div className="bg-[#e5fcde] rounded px-3 py-1 text-sm flex justify-center items-center gap-2">
              <div> تاریخ ایجاد دیدگاه :</div>
              <div>{fullData.createdAt ? fullData.createdAt : ""}</div>
            </div>
          </div>
          <form
            onKeyDown={formKeyNotSuber}
            onSubmit={updater}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <div>دیده شده</div>
              <select
                ref={viewedRef}
                className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
              >
                {fullData.viewed && fullData.viewed == true ? (
                  <>
                    <option value="true">دیده شده</option>
                    <option value="false">دیده نشده</option>
                  </>
                ) : (
                  <>
                    <option value="false">دیده نشده</option>
                    <option value="true">دیده شده</option>
                  </>
                )}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <div>منتشر شود</div>
              <select
                ref={publishedRef}
                className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
              >
                {fullData.published && fullData.published == true ? (
                  <>
                    <option value="true">بله</option>
                    <option value="false">خیر</option>
                  </>
                ) : (
                  <>
                    <option value="false">خیر</option>
                    <option value="true">بله</option>
                  </>
                )}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <div> نام نمایشی</div>
              <input
                defaultValue={fullData.displayname ? fullData.displayname : ""}
                required={true}
                type="text"
                ref={displaynameRef}
                className="inputLtr p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>ایمیل کاربر</div>
              <input
                defaultValue={fullData.email ? fullData.email : ""}
                required={true}
                type="text"
                ref={emailRef}
                className="inputLtr p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
              />
            </div>
            {fullData.parentId == "nothing" ? (
              <div></div>
            ) : (
              <div className="flex flex-col gap-2">
                <div>دیدگاه پدر</div>
                <div className="bg-[#9bf5d4] border-2 border-zinc-300 p-1 rounded flex flex-col gap-2">
                  <div className="flex justify-between items-center flex-wrap">
                    <div className="bg-[#e5fcde] rounded px-2 py-1">
                      {fullData.parent.displayname}
                    </div>
                    <div className="bg-[#e5fcde] rounded px-2 py-1">
                      {fullData.parent.email}
                    </div>
                    <div className="bg-[#b17d23] text-white rounded px-2 py-1">
                      {fullData.parent.createdAt}
                    </div>
                  </div>
                  <p className="text-black leading-9 text-justify p-2">
                    {fullData.parent.message}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div> متن دیدگاه</div>
              <textarea
                defaultValue={fullData.message ? fullData.message : ""}
                required={true}
                rows="10"
                ref={messageRef}
                className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#2357b1] p-2 w-full rounded text-white transition-all duration-200 hover:bg-[#b17d23]"
            >
              بروز رسانی
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CommentDetails;
