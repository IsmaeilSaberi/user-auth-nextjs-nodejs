"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import Cookies from "js-cookie";

const CategoryDetails = ({ categoryId }) => {
  const [auth_cookie, setauth_cookie] = useState(Cookies.get("auth_cookie"));

  // the part for prevent for submitting with enter key
  const formKeyNotSuber = (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
    }
  };

  const titleRef = useRef();
  const imageUrlRef = useRef();
  const imageAltRef = useRef();
  const slugRef = useRef();
  const shortDescRef = useRef();
  const situationRef = useRef();

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

  // here we update a category details
  const updater = (e) => {
    e.preventDefault();
    const formData = {
      id: categoryId,
      title: titleRef.current.value,
      image: imageUrlRef.current.value,
      imageAlt: imageAltRef.current.value,
      slug: slugRef.current.value.replace(/\s+/g, "-").toLowerCase(),
      situation: situationRef.current.value,
      subCategories: subCategory,
      shortDesc: shortDescRef.current.value,
      date: new Date().toLocaleDateString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-category/${categoryId}`,
        formData,
        {
          headers: { auth_cookie: auth_cookie },
        }
      )
      .then((d) => {
        formData.situation == "true"
          ? toast.success("دسته محصول با موفقیت آپدیت و منتشر شد.", {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          : toast.success(
              "دسته محصول با موفقیت آپدیت و به صورت پیش نویس ذخیره شد.",
              {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            );
      })
      .catch((err) => {
        let message = "خطایی در آپدیت و ذخیره دسته محصول رخ داد.";
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

  const [fullData, setFullData] = useState([-1]);

  // this part used for getting one category details for using in details component
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-category/${categoryId}`,
        {
          headers: { auth_cookie: auth_cookie },
        }
      )
      .then((d) => {
        setFullData(d.data);
        setsubCategory(d.data.subCategories);
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
  }, [categoryId]);

  // this part is used to delete a category
  const remover = (e) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/remove-category/${categoryId}`,
        { item: 1 },
        {
          headers: { auth_cookie: auth_cookie },
        }
      )
      .then((d) =>
        toast.success("دسته محصول با موفقیت حذف شد.", {
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
            <h2 className="text-orange-500 text-lg">جزئیات دسته بندی محصول</h2>
            <button
              onClick={() => remover()}
              className="bg-rose-400 text-white px-3 py-1 rounded text-xs transition-all duration-200 hover:bg-rose-500"
            >
              حذف
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="bg-[#e5fcde] rounded px-3 py-1 text-sm">
              {fullData._id ? fullData._id : ""}
            </div>
            <div className="bg-[#e5fcde] rounded px-3 py-1 text-sm">
              {fullData.date ? fullData.date : ""}
            </div>
          </div>
          <form
            onKeyDown={formKeyNotSuber}
            onSubmit={updater}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <div>عنوان جدید دسته محصول</div>
              <input
                defaultValue={fullData.title ? fullData.title : ""}
                required={true}
                type="text"
                ref={titleRef}
                className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>آدرس جدید عکس</div>
              <input
                defaultValue={fullData.image ? fullData.image : ""}
                required={true}
                type="text"
                ref={imageUrlRef}
                className="inputLtr p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>آلت جدید عکس</div>
              <input
                defaultValue={fullData.imageAlt ? fullData.imageAlt : ""}
                required={true}
                type="text"
                ref={imageAltRef}
                className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>اسلاگ جدید دسته محصول</div>
              <input
                defaultValue={fullData.slug ? fullData.slug : ""}
                required={true}
                type="text"
                ref={slugRef}
                className="inputLtr p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>توضیحات کوتاه جدید دسته محصول</div>
              <input
                defaultValue={fullData.shortDesc ? fullData.shortDesc : ""}
                required={true}
                type="text"
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
                {fullData.situation == true ? (
                  <>
                    <option value="true">انتشار</option>
                    <option value="false">پیش نویس</option>
                  </>
                ) : (
                  <>
                    <option value="false">پیش نویس</option>
                    <option value="true">انتشار</option>
                  </>
                )}
              </select>
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

export default CategoryDetails;
