import Image from "next/image";
import Link from "next/link";

const BlogBox = ({ data }) => {
  return (
    <article className="sliderItem p-2 transition-all duration-200">
      <div className="relative h-[24rem] w-full md:w-72 border-[0.1rem] border-[#23b17d] bg-white rounded hover:border-[#b17d23] hover:border-[0.13rem]">
        <div className="flex items-center justify-center p-1">
          <Link href={`/blog/${data.slug}`} target="_blank">
            <Image
              className="p-2"
              alt={data.imageAlt}
              title={data.imageAlt}
              width={288}
              height={120}
              src={data.image}
            />
          </Link>
        </div>
        <div className="flex flex-col gap-2 ">
          <Link href={`/blog/${data.slug}`} target="_blank">
            <h3 className="m-2 line-clamp-2">{data.title}</h3>
          </Link>
          <p className="text-base sm:text-sm text-justify m-2 line-clamp-4">
            {data.shortDesc}
          </p>
          <div className="h-1 w-[90%] absolute left-2 right-2 bottom-12 mx-auto bg-zinc-300"></div>
          <div className="flex justify-between items-center m-1 absolute bottom-2 right-2 left-2">
            <div className="text-base sm:text-sm bg-zinc-400 rounded py-1 px-3">
              {data.updatedAt}
            </div>
            <div className="text-base sm:text-sm bg-zinc-400 rounded py-1 px-3">
              {data.pageView} بازدید
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogBox;
