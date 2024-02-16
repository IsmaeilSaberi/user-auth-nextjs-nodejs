"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import RichTextEditor from "@/components/rich-text-editor-component";

const NewProduct = () => {
  const [auth_cookie, setauth_cookie] = useState(Cookies.get("auth_cookie"));
  const [longDesc, setLongDesc] = useState(null);

  const titleRef = useRef();
  const slugRef = useRef();
  const imageRef = useRef();
  const imageAltRef = useRef();
  const shortDescRef = useRef();
  const priceRef = useRef();
  const publishedRef = useRef();
  const videoLinkRef = useRef();
  const videoDurationRef = useRef();
  const videoSizeRef = useRef();

  // managing typeOfProduct
  // const typeOfProductRef = useRef();
  const [typeOfProduct, setTypeOfProduct] = useState("free");

  ///// managing freeParts
  const [freeParts, setFreeParts] = useState([
    {
      title: "",
      file: "",
    },
  ]);
  const [freePreview, setFreePreview] = useState(false);

  const handleAddFreePart = () => {
    setFreeParts([
      ...freeParts,
      {
        title: "",
        file: "",
      },
    ]);
  };

  const handleRemoveFreePart = (index) => {
    const newFreeParts = [...freeParts];
    newFreeParts.splice(index, 1);
    setFreeParts(newFreeParts);
  };

  ///// managing cashParts
  const [cashParts, setCashParts] = useState([
    {
      title: "",
      file: "",
    },
  ]);
  const [cashPreview, setCashPreview] = useState(false);

  const handleAddCashPart = () => {
    setCashParts([
      ...cashParts,
      {
        title: "",
        file: "",
      },
    ]);
  };

  const handleRemoveCashPart = (index) => {
    const newCashParts = [...cashParts];
    newCashParts.splice(index, 1);
    setCashParts(newCashParts);
  };

  ///// the part for prevent for submitting with enter key
  const formKeyNotSuber = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  //TAG MANAGING
  const tagRef = useRef();
  const [tag, setTag] = useState([]);
  const tagSuber = (e) => {
    if (e.key === "Enter") {
      let tagList = [...tag];
      const data = tagRef.current.value;
      if (data.length > 0) {
        tagList = [...tag, data.replace(/\s+/g, "_").toLowerCase()];
        setTag(tagList);
      }
      tagRef.current.value = "";
    }
  };

  const tagDeleter = (indexToRemove) => {
    setTag(tag.filter((_, index) => index !== indexToRemove));
  };

  ////CATEGORIES AND SUBCATEGORIES
  const [categories, setCategories] = useState([-1]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  useEffect(() => {
    const categoriesUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/product-categories`;
    axios
      .get(categoriesUrl, {
        headers: { auth_cookie: auth_cookie },
      })
      .then((d) => {
        setCategories(d.data);
      })
      .catch((err) => console.log("خطا!"));
  }, []);

  //////////////
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    const selectedCategory = categories.find(
      (category) => category._id === categoryId
    );
    setSubcategories(selectedCategory.subCategories);
  };

  const handleSubcategoryChange = (e) => {
    const subcategory = e.target.value;
    setSelectedSubcategory(subcategory);
  };

  ////RELATED PRODUCTS
  const [products, setProducts] = useState([-1]);
  useEffect(() => {
    const productsUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/related-products`;
    axios
      .get(productsUrl, {
        headers: { auth_cookie: auth_cookie },
      })
      .then((d) => {
        setProducts(d.data);
      })
      .catch((err) => console.log("خطا!"));
  }, []);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const relatedProductsManager = (v) => {
    let related = [...relatedProducts];
    if (v.target.checked) {
      related = [...related, v.target.value];
    } else {
      related.splice(relatedProducts.indexOf(v.target.value), 1);
    }
    setRelatedProducts(related);
  };

  const submitter = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
    }
    e.preventDefault();
    const formData = {
      title: titleRef.current.value,
      createdAt: new Date().toLocaleDateString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      updatedAt: new Date().toLocaleDateString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      slug: slugRef.current.value,
      typeOfProduct: typeOfProduct,
      price: priceRef.current.value,
      image: imageRef.current.value,
      imageAlt: imageAltRef.current.value,
      shortDesc: shortDescRef.current.value,
      longDesc: longDesc,
      videoLink: videoLinkRef.current.value,
      videoDuration: videoDurationRef.current.value,
      videoSize: videoSizeRef.current.value,
      tags: tag,
      subCategory: selectedSubcategory,
      pageView: 0,
      published: publishedRef.current.value,
      comments: [],
      relatedProducts: relatedProducts,
      category: selectedCategory,
      freeParts: freeParts.map((freepart) => ({
        title: freepart.title,
        file: freepart.file,
      })),
      cashParts: cashParts.map((cashpart) => ({
        title: cashpart.title,
        file: cashpart.file,
      })),
    };

    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/new-product`;
    axios
      .post(url, formData, {
        headers: { auth_cookie: auth_cookie },
      })
      .then((d) => {
        formData.published == "true"
          ? toast.success("محصول با موفقیت منتشر شد.", {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          : toast.success("محصول با موفقیت به صورت پیش نویس ذخیره شد.", {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
      })
      .catch((err) => {
        let message = "خطایی در ذخیره و ایجاد محصول رخ داد.";
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
      <h2 className="text-orange-500 text-lg">محصول جدید</h2>
      <form
        onKeyDown={formKeyNotSuber}
        onSubmit={submitter}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <div>عنوان محصول</div>
          <input
            required={true}
            type="text"
            ref={titleRef}
            className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>نوع محصول</div>
          <div className="flex gap-4 p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]">
            <label className="flex gap-1">
              رایگان
              <input
                type="radio"
                value="free"
                checked={typeOfProduct === "free"}
                onChange={() => setTypeOfProduct("free")}
              />
            </label>
            <label className="flex gap-1">
              پولی
              <input
                type="radio"
                value="cash"
                checked={typeOfProduct === "cash"}
                onChange={() => setTypeOfProduct("cash")}
              />
            </label>
            <label className="flex gap-1">
              ترکیبی
              <input
                type="radio"
                value="combine"
                checked={typeOfProduct === "combine"}
                onChange={() => setTypeOfProduct("combine")}
              />
            </label>
          </div>
        </div>
        {/* this is new part for adding and managing product freeparts and its files(download links) */}
        {typeOfProduct == "free" ? (
          <div className="flex flex-col justify-center items-center">
            <div className="text-start w-full p-1">فایل های رایگان</div>
            <div className="container mx-auto flex flex-col items-center justify-center border-[0.05rem] border-indigo-500">
              {freePreview ? (
                <div className="w-full max-w-4xl p-4">
                  {freeParts.map((part, partIndex) => (
                    <div key={partIndex} className="mb-4">
                      <h3 className="text-lg font-bold mb-2">
                        بخش {partIndex + 1}: {part.title}
                      </h3>
                      <div className="text-lg font-bold mb-2">
                        فایل بخش : {part.file}
                      </div>
                    </div>
                  ))}
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
                    onClick={() => setFreePreview(false)}
                  >
                    ویرایش بخش
                  </button>
                </div>
              ) : (
                <form className="w-full max-w-4xl p-4">
                  {freeParts.map((part, partIndex) => (
                    <div key={partIndex} className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold">
                          بخش {partIndex + 1}
                        </h3>
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                          onClick={() => handleRemoveFreePart(partIndex)}
                        >
                          حذف بخش
                        </button>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label
                            htmlFor={`part-title-${partIndex}`}
                            className="block font-bold mb-2"
                          >
                            عنوان بخش:
                          </label>
                          <input
                            type="text"
                            id={`part-title-${partIndex}`}
                            className="w-full border border-gray-300 p-2 rounded"
                            value={part.title}
                            onChange={(e) => {
                              const newFreeParts = [...freeParts];
                              newFreeParts[partIndex].title = e.target.value;
                              setFreeParts(newFreeParts);
                            }}
                            required
                          />
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <label
                            htmlFor={`part-file-${partIndex}`}
                            className="block font-bold mb-2"
                          >
                            فایل بخش:
                          </label>
                          <input
                            type="text"
                            id={`part-file-${partIndex}`}
                            className="inputLtr w-full border border-gray-300 p-2 rounded"
                            value={part.file}
                            onChange={(e) => {
                              const newFreeParts = [...freeParts];
                              newFreeParts[partIndex].file = e.target.value;
                              setFreeParts(newFreeParts);
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                      onClick={handleAddFreePart}
                    >
                      افزودن بخش
                    </button>
                    <button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                      onClick={() => setFreePreview(true)}
                    >
                      مشاهده بخش های اضافه شده
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : typeOfProduct == "cash" ? (
          <div className="flex flex-col justify-center items-center">
            <div className="text-start w-full p-1">فایل های پولی</div>
            <div className="container mx-auto flex flex-col items-center justify-center border-[0.05rem] border-indigo-500">
              {cashPreview ? (
                <div className="w-full max-w-4xl p-4">
                  {cashParts.map((part, partIndex) => (
                    <div key={partIndex} className="mb-4">
                      <h3 className="text-lg font-bold mb-2">
                        بخش {partIndex + 1}: {part.title}
                      </h3>
                      <div className="text-lg font-bold mb-2">
                        فایل بخش : {part.file}
                      </div>
                    </div>
                  ))}
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
                    onClick={() => setCashPreview(false)}
                  >
                    ویرایش بخش
                  </button>
                </div>
              ) : (
                <form className="w-full max-w-4xl p-4">
                  {cashParts.map((part, partIndex) => (
                    <div key={partIndex} className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold">
                          بخش {partIndex + 1}
                        </h3>
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                          onClick={() => handleRemoveCashPart(partIndex)}
                        >
                          حذف بخش
                        </button>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label
                            htmlFor={`part-title-${partIndex}`}
                            className="block font-bold mb-2"
                          >
                            عنوان بخش:
                          </label>
                          <input
                            type="text"
                            id={`part-title-${partIndex}`}
                            className="w-full border border-gray-300 p-2 rounded"
                            value={part.title}
                            onChange={(e) => {
                              const newCashParts = [...cashParts];
                              newCashParts[partIndex].title = e.target.value;
                              setCashParts(newCashParts);
                            }}
                            required
                          />
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <label
                            htmlFor={`part-file-${partIndex}`}
                            className="block font-bold mb-2"
                          >
                            فایل بخش:
                          </label>
                          <input
                            type="text"
                            id={`part-file-${partIndex}`}
                            className="inputLtr w-full border border-gray-300 p-2 rounded"
                            value={part.file}
                            onChange={(e) => {
                              const newCashParts = [...cashParts];
                              newCashParts[partIndex].file = e.target.value;
                              setCashParts(newCashParts);
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                      onClick={handleAddCashPart}
                    >
                      افزودن بخش
                    </button>
                    <button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                      onClick={() => setCashPreview(true)}
                    >
                      مشاهده بخش های اضافه شده
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-center items-center">
              <div className="text-start w-full p-1">فایل های رایگان</div>
              <div className="container mx-auto flex flex-col items-center justify-center border-[0.05rem] border-indigo-500">
                {freePreview ? (
                  <div className="w-full max-w-4xl p-4">
                    {freeParts.map((part, partIndex) => (
                      <div key={partIndex} className="mb-4">
                        <h3 className="text-lg font-bold mb-2">
                          بخش {partIndex + 1}: {part.title}
                        </h3>
                        <div className="text-lg font-bold mb-2">
                          فایل بخش : {part.file}
                        </div>
                      </div>
                    ))}
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
                      onClick={() => setFreePreview(false)}
                    >
                      ویرایش بخش
                    </button>
                  </div>
                ) : (
                  <form className="w-full max-w-4xl p-4">
                    {freeParts.map((part, partIndex) => (
                      <div key={partIndex} className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-bold">
                            بخش {partIndex + 1}
                          </h3>
                          <button
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                            onClick={() => handleRemoveFreePart(partIndex)}
                          >
                            حذف بخش
                          </button>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <label
                              htmlFor={`part-title-${partIndex}`}
                              className="block font-bold mb-2"
                            >
                              عنوان بخش:
                            </label>
                            <input
                              type="text"
                              id={`part-title-${partIndex}`}
                              className="w-full border border-gray-300 p-2 rounded"
                              value={part.title}
                              onChange={(e) => {
                                const newFreeParts = [...freeParts];
                                newFreeParts[partIndex].title = e.target.value;
                                setFreeParts(newFreeParts);
                              }}
                              required
                            />
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <label
                              htmlFor={`part-file-${partIndex}`}
                              className="block font-bold mb-2"
                            >
                              فایل بخش:
                            </label>
                            <input
                              type="text"
                              id={`part-file-${partIndex}`}
                              className="inputLtr w-full border border-gray-300 p-2 rounded"
                              value={part.file}
                              onChange={(e) => {
                                const newFreeParts = [...freeParts];
                                newFreeParts[partIndex].file = e.target.value;
                                setFreeParts(newFreeParts);
                              }}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        onClick={handleAddFreePart}
                      >
                        افزودن بخش
                      </button>
                      <button
                        type="button"
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                        onClick={() => setFreePreview(true)}
                      >
                        مشاهده بخش های اضافه شده
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="text-start w-full p-1">فایل های پولی</div>
              <div className="container mx-auto flex flex-col items-center justify-center border-[0.05rem] border-indigo-500">
                {cashPreview ? (
                  <div className="w-full max-w-4xl p-4">
                    {cashParts.map((part, partIndex) => (
                      <div key={partIndex} className="mb-4">
                        <h3 className="text-lg font-bold mb-2">
                          بخش {partIndex + 1}: {part.title}
                        </h3>
                        <div className="text-lg font-bold mb-2">
                          فایل بخش : {part.file}
                        </div>
                      </div>
                    ))}
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
                      onClick={() => setCashPreview(false)}
                    >
                      ویرایش بخش
                    </button>
                  </div>
                ) : (
                  <form className="w-full max-w-4xl p-4">
                    {cashParts.map((part, partIndex) => (
                      <div key={partIndex} className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-bold">
                            بخش {partIndex + 1}
                          </h3>
                          <button
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                            onClick={() => handleRemoveCashPart(partIndex)}
                          >
                            حذف بخش
                          </button>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <label
                              htmlFor={`part-title-${partIndex}`}
                              className="block font-bold mb-2"
                            >
                              عنوان بخش:
                            </label>
                            <input
                              type="text"
                              id={`part-title-${partIndex}`}
                              className="w-full border border-gray-300 p-2 rounded"
                              value={part.title}
                              onChange={(e) => {
                                const newCashParts = [...cashParts];
                                newCashParts[partIndex].title = e.target.value;
                                setCashParts(newCashParts);
                              }}
                              required
                            />
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <label
                              htmlFor={`part-file-${partIndex}`}
                              className="block font-bold mb-2"
                            >
                              فایل بخش:
                            </label>
                            <input
                              type="text"
                              id={`part-file-${partIndex}`}
                              className="inputLtr w-full border border-gray-300 p-2 rounded"
                              value={part.file}
                              onChange={(e) => {
                                const newCashParts = [...cashParts];
                                newCashParts[partIndex].file = e.target.value;
                                setCashParts(newCashParts);
                              }}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        onClick={handleAddCashPart}
                      >
                        افزودن بخش
                      </button>
                      <button
                        type="button"
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                        onClick={() => setCashPreview(true)}
                      >
                        مشاهده بخش های اضافه شده
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </>
        )}
        <div className="flex flex-col gap-2">
          <div>اسلاگ محصول</div>
          <input
            required={true}
            type="text"
            ref={slugRef}
            className="inputLtr p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>قیمت محصول(تومان)</div>
          <input
            required={true}
            type="number"
            ref={priceRef}
            className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>آدرس عکس</div>
          <input
            required={true}
            type="text"
            ref={imageRef}
            className="inputLtr p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>آلت عکس</div>
          <input
            required={true}
            type="text"
            ref={imageAltRef}
            className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>توضیحات کوتاه</div>
          <input
            type="text"
            required={true}
            ref={shortDescRef}
            className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>توضیحات کامل </div>
          <RichTextEditor setLongDesc={setLongDesc} />
        </div>
        <div className="flex flex-col gap-2">
          <div>لینک ویدئو</div>
          <input
            required={true}
            type="text"
            ref={videoLinkRef}
            className="inputLtr p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>زمان ویدئو</div>
          <input
            required={true}
            type="Number"
            ref={videoDurationRef}
            className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>اندازه ویدئو</div>
          <input
            required={true}
            type="Number"
            ref={videoSizeRef}
            className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-indigo-600"
          />
        </div>
        <div className="tags flex flex-col gap-2">
          <h3>برچسب ها</h3>
          <div className="tags w-full flex flex-col gap-4">
            <div className="input flex gap-2 items-center">
              <input
                type="text"
                onKeyDown={tagSuber}
                ref={tagRef}
                className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
                placeholder="تگ را وارد کنید و اینتر بزنید..."
              />
            </div>
            <div className="tagResults flex gap-3 justify-start flex-wrap">
              {tag.map((t, index) => {
                return (
                  <div
                    key={t}
                    className="res flex gap-1 text-sm py-1 px-2 rounded border-2 border-zinc-600"
                  >
                    <i
                      className="text-[#bf535b] flex items-center cursor-pointer"
                      onClick={() => {
                        tagDeleter(index);
                      }}
                    >
                      <span className="text-xs">{t}</span>
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
        <div className="categories flex flex-col gap-2">
          <h3>دسته بندی ها</h3>
          {categories[0] == -1 ? (
            <div className="flex justify-center items-center p-12">
              <Image
                alt="loading"
                width={40}
                height={40}
                src={"/loading.svg"}
              />
            </div>
          ) : categories.length < 1 ? (
            <div className="p-3">دسته ای یافت نشد!</div>
          ) : (
            <div className="flex justify-start items center flex-wrap gap-2">
              <select
                id="category"
                className="border border-gray-300 rounded p-1"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">یک دسته بندی را انتخاب کنید</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div>زیر دسته محصول</div>
          {subcategories.length < 1 ? (
            <></>
          ) : (
            <select
              id="subcategory"
              className="border border-gray-300 rounded p-1"
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
            >
              <option value="">زیر دسته محصول را انتخاب کنید</option>
              {subcategories.map((subcategory, index) => (
                <option key={index} value={subcategory}>
                  {subcategory.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="related flex flex-col gap-2">
          <h3>محصولات مرتبط</h3>
          {products[0] == -1 ? (
            <div className="flex justify-center items-center p-12">
              <Image
                alt="loading"
                width={40}
                height={40}
                src={"/loading.svg"}
              />
            </div>
          ) : products.length < 1 ? (
            <div className="p-3">محصولی یافت نشد!</div>
          ) : (
            <div className="flex justify-start items center flex-wrap gap-2">
              {products.map((pro, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 bg-[#9bf5d4] px-2 py-1 rounded border border-indigo-400"
                >
                  <label htmlFor={pro._id}>{pro.title}</label>
                  <input
                    name={pro._id}
                    id={pro._id}
                    onChange={relatedProductsManager}
                    value={pro._id}
                    type="checkbox"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div>منتشر شود</div>
          <select
            ref={publishedRef}
            className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
          >
            <option value="true">انتشار</option>
            <option value="false">پیش نویس</option>
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

export default NewProduct;
