"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import RichTextEditor from "@/components/rich-text-editor-component";

const PostDetails = ({ postId }) => {
  const [auth_cookie, setauth_cookie] = useState(Cookies.get("auth_cookie"));
  const [longDesc, setLongDesc] = useState(null);

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

  const titleRef = useRef();
  const slugRef = useRef();
  const imageRef = useRef();
  const imageAltRef = useRef();
  const shortDescRef = useRef();
  const publishedRef = useRef();

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

  ////RELATED POSTS
  const [posts, setPosts] = useState([-1]);
  useEffect(() => {
    const postsUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/related-posts`;
    axios
      .get(postsUrl, {
        headers: { auth_cookie: auth_cookie },
      })
      .then((d) => {
        setPosts(d.data);
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
  }, []);

  const [relatedPosts, setRelatedPosts] = useState();

  // this part used for getting one post details for using in default values
  const [fullData, setFullData] = useState([-1]);
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-post-by-id/${postId}`,
        {
          headers: { auth_cookie: auth_cookie },
        }
      )
      .then((d) => {
        setFullData(d.data);
        setTag(d.data.tags);
        setLongDesc(d.data.longDesc);
        setRelatedPosts(d.data.relatedPosts);
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
  }, [postId]);

  const relatedPostsManager = (v) => {
    let related = [...relatedPosts];
    if (v.target.checked) {
      related = [...related, v.target.value];
    } else {
      related.splice(relatedPosts.indexOf(v.target.value), 1);
    }
    setRelatedPosts(related);
  };

  // here we update a post details
  const updater = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
    }
    e.preventDefault();
    const formData = {
      title: titleRef.current.value,
      updatedAt: new Date().toLocaleDateString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      slug: slugRef.current.value,
      image: imageRef.current.value,
      imageAlt: imageAltRef.current.value,
      shortDesc: shortDescRef.current.value,
      longDesc: longDesc,
      tags: tag,
      published: publishedRef.current.value,
      relatedPosts: relatedPosts,
    };
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-post/${postId}`;
    axios
      .post(url, formData, {
        headers: { auth_cookie: auth_cookie },
      })
      .then((d) => {
        goToTop();
        formData.published == "true"
          ? toast.success("مقاله با موفقیت آپدیت و منتشر شد.", {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          : toast.success(
              "مقاله با موفقیت آپدیت و به صورت پیش نویس ذخیره شد.",
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
        let message = "خطایی در آپدیت و ذخیره مقاله رخ داد.";
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

  // this part is used to delete a post
  const remover = (e) => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/remove-post/${postId}`;
    axios
      .post(
        url,
        { item: 1 },
        {
          headers: { auth_cookie: auth_cookie },
        }
      )
      .then((d) =>
        toast.success("مقاله با موفقیت حذف شد.", {
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
            <h2 className="text-orange-500 text-lg">جزئیات پست</h2>
            <div className="flex justify-end items-center gap-2">
              <Link
                href={`/blog/${fullData.slug}`}
                target="_blank"
                className="bg-blue-400 text-white px-3 py-1 rounded text-sm transition-all duration-200 hover:bg-blue-500"
              >
                لینک پست
              </Link>
              <button
                onClick={() => {
                  remover();
                  goToTop();
                }}
                className="bg-rose-400 text-white px-3 py-1 rounded text-xs transition-all duration-200 hover:bg-rose-500"
              >
                حذف
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
            <div className="bg-[#e5fcde] rounded px-3 py-1 text-sm">
              {fullData._id ? fullData._id : ""}
            </div>
            <div className="bg-[#e5fcde] rounded px-3 py-1 text-sm">
              تاریخ ایجاد {fullData.createdAt ? fullData.createdAt : ""}
            </div>
            <div className="bg-[#e5fcde] rounded px-3 py-1 text-sm">
              به روز رسانی {fullData.updatedAt ? fullData.updatedAt : ""}
            </div>
            <div className="bg-[#e5fcde] rounded px-3 py-1 text-sm">
              {fullData.pageView ? fullData.pageView : 0} بازدید
            </div>
            <div className="bg-[#e5fcde] rounded px-3 py-1 text-sm">
              {fullData.comments ? fullData.comments.length : 0} دیدگاه
            </div>
          </div>
          <form
            onKeyDown={formKeyNotSuber}
            onSubmit={updater}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <div>عنوان جدید مقاله</div>
              <input
                defaultValue={fullData.title ? fullData.title : ""}
                required={true}
                type="text"
                ref={titleRef}
                className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>اسلاگ جدید پست</div>
              <input
                defaultValue={fullData.slug ? fullData.slug : ""}
                required={true}
                type="text"
                ref={slugRef}
                className="inputLtr p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>آدرس جدید عکس</div>
              <input
                defaultValue={fullData.image ? fullData.image : ""}
                required={true}
                type="text"
                ref={imageRef}
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
              <div>توضیحات کوتاه جدید</div>
              <input
                defaultValue={fullData.shortDesc ? fullData.shortDesc : ""}
                type="text"
                required={true}
                ref={shortDescRef}
                className="p-2 rounded w-full outline-none border-2 border-zinc-300 focus:border-[#18e52d]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>توضیحات کامل جدید</div>
              <RichTextEditor
                dValue={fullData.longDesc ? fullData.longDesc : ""}
                setLongDesc={setLongDesc}
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
                          className="text-[#bf535b] flex items-center"
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
            <div className="related flex flex-col gap-2">
              <h3>مقالات مرتبط</h3>
              {posts[0] == -1 ? (
                <div className="flex justify-center items-center p-12">
                  <Image
                    alt="loading"
                    width={40}
                    height={40}
                    src={"/loading.svg"}
                  />
                </div>
              ) : posts.length < 1 ? (
                <div className="p-3">مقاله ای یافت نشد!</div>
              ) : (
                <div className="flex justify-start items center flex-wrap gap-2">
                  {posts.map((po, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 bg-[#9bf5d4] px-2 py-1 rounded border border-indigo-400"
                    >
                      <label htmlFor={po._id}>{po.title}</label>
                      {fullData.relatedPosts &&
                      fullData.relatedPosts.includes(po._id) ? (
                        <input
                          name={po._id}
                          id={po._id}
                          onChange={relatedPostsManager}
                          value={po._id}
                          type="checkbox"
                          defaultChecked
                        />
                      ) : (
                        <input
                          name={po._id}
                          id={po._id}
                          onChange={relatedPostsManager}
                          value={po._id}
                          type="checkbox"
                        />
                      )}
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
                {fullData.published && fullData.published == true ? (
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

export default PostDetails;
