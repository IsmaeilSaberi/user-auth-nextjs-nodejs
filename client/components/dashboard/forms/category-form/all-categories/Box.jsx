"use client";
import Image from "next/image";

const Box = ({ data, setCategoryDetailCtrl, setRandNumForCategoryClick }) => {
  const goToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div
      onClick={() => {
        goToTop();
        setCategoryDetailCtrl(data._id);
        setRandNumForCategoryClick(Math.random());
      }}
      className="relative flex justify-between items-center w-full cursor-pointer p-6 rounded-lg border-2 border-zinc-200 bg-[#9bf5d4] transition-all duration-200 hover:border-orange-500"
    >
      <div className="flex justify-start items-center m-4">
        <Image
          className="rounded-lg"
          alt={data.imageAlt}
          src={data.image}
          title={data.imageAlt}
          width={200}
          height={200}
        />
      </div>
      <div className="flex flex-col gap-4 h-20">
        <div className="absolute top-3 left-[60%]">{data.title}</div>
        <div className="px-3 py-1 absolute top-9 left-[50%]">
          <ul className="flex flex-col flex-wrap gap-1 text-sm">
            {data.subCategories.map((sc, i) => (
              <li className="bg-blue-600 text-white rounded p-1" key={i}>
                {sc}
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute text-xs text-white bottom-3 left-3 flex justify-end items-center gap-2">
          <div>
            {data.situation == true ? (
              <div className="bg-green-500 px-2 py-1 rounded">منتشر شده</div>
            ) : (
              <div className="bg-red-500 px-2 py-1 rounded">پیش نویس</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Box;
