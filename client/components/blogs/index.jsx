import Link from "next/link";

import BlogBox from "./blogbox";

const getData = async () => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-new-posts`
  );
  return data.json();
};

const Blogs = async () => {
  const data = await getData();

  return (
    <>
      {data.length < 1 ? (
        <div></div>
      ) : (
        <section className="container border-[0.1rem] border-[#23b17d] rounded mx-auto m-2 flex flex-col gap-4">
          <header className="m-2 flex justify-between items-center">
            <h2 className="text-[#b53057] text-md md:text-xl border-[#b53057] border-r-2 pr-2">
              جدیدترین مقالات
            </h2>
            <div className="flex gap-1 items-center">
              <Link
                className="bg-[#b17d23] px-4 border-2 py-2 rounded transition-all duration-200 hover:bg-[#b1239b]"
                href={`/blog`}
              >
                مشاهده ی همه
              </Link>
            </div>
          </header>
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-2 p-2">
            {data.map((bl, i) => (
              <div key={i}>
                <BlogBox data={bl} />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default Blogs;
