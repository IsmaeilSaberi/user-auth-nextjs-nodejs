"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/legacy/image";
import Cookies from "js-cookie";

const RuleDetails = ({ ruleId }) => {
  const [auth_cookie, setauth_cookie] = useState(Cookies.get("auth_cookie"));

  // the part for prevent for submitting with enter key
  const formKeyNotSuber = (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
    }
  };

  const titleRef = useRef();
  const slugRef = useRef();
  const linkRef = useRef();
  const situationRef = useRef();
  const descriptionRef = useRef();
  const typeOfRuleRef = useRef();

  const [fullData, setFullData] = useState([-1]);

  // this part used for getting one rule details for using in details component
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-rule-by-id/${ruleId}`,
        {
          headers: { auth_cookie: auth_cookie },
        }
      )
      .then((d) => {
        setFullData(d.data);
      })
      .catch((err) =>
        toast.error("خطا در لود اطلاعات!", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      );
  }, [ruleId]);

  // here we update a rule details
  const updater = (e) => {
    e.preventDefault();
    const formData = {
      title: titleRef.current.value,
      situation: situationRef.current.value,
      description: descriptionRef.current.value,
      slug: slugRef.current.value,
      link: linkRef.current.value,
      typeOfRule: typeOfRuleRef.current.value,
      updatedAt: new Date().toLocaleDateString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-rule/${ruleId}`,
        formData,
        {
          headers: { auth_cookie: auth_cookie },
        }
      )
      .then((d) => {
        formData.situation == "true"
          ? toast.success("قانون با موفقیت آپدیت و منتشر شد.", {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          : toast.success("قانون با موفقیت آپدیت و به صورت خاموش ذخیره شد.", {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
      })
      .catch((err) => {
        console.log("خطا!");
        let message = "خطایی در آپدیت و ذخیره قانون رخ داد.";
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

  // this part is used to delete a rule
  const remover = (e) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/remove-rule/${ruleId}`,
        { item: 1 },
        {
          headers: { auth_cookie: auth_cookie },
        }
      )
      .then((d) =>
        toast.success("قانون با موفقیت حذف شد.", {
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
    <div className="flex w-full flex-col gap-6">
      {fullData[0] == -1 ? (
        <div className="flex justify-center items-center p-12">
          <Image alt="loading" width={120} height={120} src={"/loading2.svg"} />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-[#bf535b] text-lg">جزئیات قانون</h2>
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => remover()}
                className="bg-rose-500 text-white px-3 py-1 rounded-md text-xs transition-all duration-200 hover:bg-rose-600"
              >
                حذف
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
            <div className="bg-zinc-200 rounded px-3 py-1 text-sm flex justify-center items-center gap-2">
              {fullData._id ? fullData._id : ""}
            </div>
            <div className="bg-zinc-200 rounded px-3 py-1 text-sm flex justify-center items-center gap-2">
              <div>تاریخ ایجاد :</div>
              <div>{fullData.createdAt ? fullData.createdAt : ""}</div>
            </div>
            <div className="bg-zinc-200 rounded px-3 py-1 text-sm flex justify-center items-center gap-2">
              <div> به روز رسانی :</div>
              <div>{fullData.updatedAt ? fullData.updatedAt : ""}</div>
            </div>
          </div>
          <form
            onSubmit={updater}
            onKeyDown={formKeyNotSuber}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <div>عنوان</div>
              <input
                defaultValue={fullData.title ? fullData.title : ""}
                required={true}
                type="text"
                ref={titleRef}
                className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>اسلاگ</div>
              <input
                defaultValue={fullData.slug ? fullData.slug : ""}
                type="text"
                required={true}
                ref={slugRef}
                className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>لینک به محصول یا دانلود</div>
              <input
                defaultValue={fullData.link ? fullData.link : ""}
                type="text"
                required={true}
                ref={linkRef}
                className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>توضیحات کامل</div>
              <textarea
                defaultValue={fullData.description ? fullData.description : ""}
                rows="8"
                type="text"
                required={true}
                ref={descriptionRef}
                className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
              ></textarea>
            </div>
            <div className="flex flex-col gap-2">
              <div>نوع توصیه</div>
              <select
                ref={typeOfRuleRef}
                className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
              >
                {fullData.typeOfRule && fullData.typeOfRule == "intro" ? (
                  <>
                    <option value={"intro"}>قوانین کلی</option>
                    <option value={"comment"}>قوانین دیدگاه</option>
                    <option value={"question"}>قوانین سوال</option>
                    <option value={"shopping"}>قوانین خرید</option>
                    <option value={"contact"}>تماس با ما</option>
                    <option value={"faq"}>سوالات متداول</option>
                  </>
                ) : fullData.typeOfRule && fullData.typeOfRule == "comment" ? (
                  <>
                    <option value={"comment"}>قوانین دیدگاه</option>
                    <option value={"intro"}>قوانین کلی</option>
                    <option value={"question"}>قوانین سوال</option>
                    <option value={"shopping"}>قوانین خرید</option>
                    <option value={"contact"}>تماس با ما</option>
                    <option value={"faq"}>سوالات متداول</option>
                  </>
                ) : fullData.typeOfRule && fullData.typeOfRule == "question" ? (
                  <>
                    <option value={"question"}>قوانین سوال</option>
                    <option value={"intro"}>قوانین کلی</option>
                    <option value={"comment"}>قوانین دیدگاه</option>
                    <option value={"shopping"}>قوانین خرید</option>
                    <option value={"contact"}>تماس با ما</option>
                    <option value={"faq"}>سوالات متداول</option>
                  </>
                ) : fullData.typeOfRule && fullData.typeOfRule == "contact" ? (
                  <>
                    <option value={"contact"}>تماس با ما</option>
                    <option value={"shopping"}>قوانین خرید</option>
                    <option value={"intro"}>قوانین کلی</option>
                    <option value={"comment"}>قوانین دیدگاه</option>
                    <option value={"question"}>قوانین سوال</option>
                    <option value={"faq"}>سوالات متداول</option>
                  </>
                ) : (
                  <>
                    <option value={"faq"}>سوالات متداول</option>
                    <option value={"shopping"}>قوانین خرید</option>
                    <option value={"intro"}>قوانین کلی</option>
                    <option value={"comment"}>قوانین دیدگاه</option>
                    <option value={"question"}>قوانین سوال</option>
                    <option value={"contact"}>تماس با ما</option>
                  </>
                )}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <div>روشن یا خاموش</div>
              <select
                ref={situationRef}
                className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
              >
                {fullData.situation && fullData.situation == true ? (
                  <>
                    <option value="true">روشن</option>
                    <option value="false">خاموش</option>
                  </>
                ) : (
                  <>
                    <option value="false">خاموش</option>
                    <option value="true">روشن</option>
                  </>
                )}
              </select>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 p-2 w-full rounded-md text-white transition-all duration-200 hover:bg-indigo-800"
            >
              بروز رسانی
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RuleDetails;
