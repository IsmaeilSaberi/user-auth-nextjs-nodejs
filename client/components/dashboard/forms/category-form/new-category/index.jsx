"use client";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const NewCategory = () => {
  const [auth_cookie, setauth_cookie] = useState(Cookies.get("auth_cookie"));

  const titleRef = useRef();
  const imageUrlRef = useRef();
  const imageAltRef = useRef();
  const slugRef = useRef();
  const shortDescRef = useRef();
  const situationRef = useRef();

  const formKeyNotSuber = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  //SUBCATEGORY MANAGING
  const subCategoryRef = useRef();
  const [subCategory, setsubCategory] = useState([]);
  const subCategorySuber = (e) => {
    if (e.key === "Enter") {
      let subCategoryList = [...subCategory];
      const data = subCategoryRef.current.value;
      if (data.length > 0) {
        subCategoryList = [
          ...subCategory,
          data.replace(/\s+/g, "_").toLowerCase(),
        ];
        setsubCategory(subCategoryList);
      }
      subCategoryRef.current.value = "";
    }
  };

  const subCategoryDeleter = (indexToRemove) => {
    setsubCategory(subCategory.filter((_, index) => index !== indexToRemove));
  };

  const submitter = (e) => {
    e.preventDefault();
    const formData = {
      title: titleRef.current.value,
      image: imageUrlRef.current.value,
      imageAlt: imageAltRef.current.value,
      slug: slugRef.current.value.replace(/\s+/g, "-").toLowerCase(),
      shortDesc: shortDescRef.current.value,
      subCategories: subCategory,
      situation: situationRef.current.value,
      date: new Date().toLocaleDateString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/new-category`;
    axios
      .post(url, formData, {
        headers: { auth_cookie: auth_cookie },
      })
      .then((d) => {
        formData.situation == "true"
          ? toast.success("دسته محصول با موفقیت ذخیره و منتشر شد.", {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          : toast.success("دسته محصول با موفقیت به صورت پیش نویس ذخیره شد.", {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
      })
      .catch((err) => {
        let message = "خطایی در ذخیره و ایجاد دسته محصول رخ داد.";
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
    <div className="flex flex-col gap-6">
      <h2 className="text-orange-500 text-lg">دسته جدید</h2>
      <form
        onSubmit={submitter}
        onKeyDown={formKeyNotSuber}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <div> عنوان دسته محصول</div>
          <input
            required={true}
            type="text"
            ref={titleRef}
            className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>آدرس عکس</div>
          <input
            required={true}
            type="text"
            ref={imageUrlRef}
            className="inputLtr p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>آلت عکس</div>
          <input
            type="text"
            required={true}
            ref={imageAltRef}
            className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>اسلاگ دسته محصول</div>
          <input
            type="text"
            required={true}
            ref={slugRef}
            className="inputLtr p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>توضیح کوتاه دسته محصول</div>
          <input
            type="text"
            required={true}
            ref={shortDescRef}
            className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
          />
        </div>
        <div className="subCategory flex flex-col gap-2">
          <h3>زیر گروه دسته بندی</h3>
          <div className="subCategory w-full flex flex-col gap-4">
            <div className="input flex gap-2 items-center">
              <input
                type="text"
                onKeyDown={subCategorySuber}
                ref={subCategoryRef}
                className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
                placeholder="زیرگروه را وارد کنید و اینتر بزنید..."
              />
            </div>
            <div className="subCategoryResults flex gap-3 justify-start flex-wrap">
              {subCategory.map((sc, index) => {
                return (
                  <div
                    key={sc}
                    className="res flex gap-1 text-sm py-1 px-2 rounded border-2 border-zinc-600"
                  >
                    <i
                      className="text-[#bf535b] flex items-center cursor-pointer"
                      onClick={() => {
                        subCategoryDeleter(index);
                      }}
                    >
                      <span className="text-xs">{sc}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </i>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>انتشار یا پیش نویس</div>
          <select
            ref={situationRef}
            className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
          >
            <option value={"true"}>انتشار</option>
            <option value={"false"}>پیش نویس</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-[#2357b1] p-2 w-full rounded text-white transition-all duration-200 hover:bg-[#b17d23]"
        >
          ارسال
        </button>
      </form>
    </div>
  );
};

export default NewCategory;
