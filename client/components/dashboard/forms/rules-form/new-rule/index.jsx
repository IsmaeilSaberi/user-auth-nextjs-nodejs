"use client";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const NewRule = () => {
  const [auth_cookie, setauth_cookie] = useState(Cookies.get("auth_cookie"));

  const titleRef = useRef();
  const slugRef = useRef();
  const linkRef = useRef();
  const situationRef = useRef();
  const descriptionRef = useRef();
  const typeOfRuleRef = useRef();

  const formKeyNotSuber = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const submitter = (e) => {
    e.preventDefault();
    const formData = {
      title: titleRef.current.value,
      situation: situationRef.current.value,
      description: descriptionRef.current.value,
      slug: slugRef.current.value,
      link: linkRef.current.value,
      typeOfRule: typeOfRuleRef.current.value,
      createdAt: new Date().toLocaleDateString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      updatedAt: new Date().toLocaleDateString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/new-rule`;
    axios
      .post(url, formData, {
        headers: { auth_cookie: auth_cookie },
      })
      .then((d) => {
        formData.situation == "true"
          ? toast.success("قانون با موفقیت ذخیره و منتشر شد.", {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          : toast.success("قانون با موفقیت به صورت خاموش ذخیره شد.", {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
      })
      .catch((err) => {
        let message = "خطایی در ذخیره و ایجاد قانون رخ داد.";
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

  return (
    <div className="flex w-full flex-col gap-6">
      <h2 className="text-[#bf535b] text-lg">قانون جدید</h2>
      <form
        onSubmit={submitter}
        onKeyDown={formKeyNotSuber}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <div>عنوان</div>
          <input
            required={true}
            type="text"
            ref={titleRef}
            className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>اسلاگ</div>
          <input
            type="text"
            required={true}
            ref={slugRef}
            className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>لینک به محصول یا دانلود</div>
          <input
            type="text"
            required={true}
            ref={linkRef}
            className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>توضیحات کامل</div>
          <textarea
            rows="8"
            type="text"
            required={true}
            ref={descriptionRef}
            className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
          ></textarea>
        </div>
        <div className="flex flex-col gap-2">
          <div>نوع قانون</div>
          <select
            ref={typeOfRuleRef}
            className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
          >
            <option value={"intro"}>قوانین کلی</option>
            <option value={"shopping"}>قوانین خرید</option>
            <option value={"comment"}>قوانین دیدگاه</option>
            <option value={"question"}>قوانین سوال</option>
            <option value={"contact"}>تماس با ما</option>
            <option value={"faq"}>سوالات متداول</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <div>روشن یا خاموش</div>
          <select
            ref={situationRef}
            className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
          >
            <option value="true">روشن</option>
            <option value="false">خاموش</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-indigo-600 p-2 w-full rounded-md text-white transition-all duration-200 hover:bg-indigo-800"
        >
          ارسال
        </button>
      </form>
    </div>
  );
};

export default NewRule;
