"use client";

const DCBtn = ({
  title,
  content,
  setContentChanger,
  setColorChanger,
  colorChanger,
  setMenuIsOpen,
}) => {
  ///SCROLL TO TOP
  const goToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={() => {
        setContentChanger(content);
        setColorChanger(content);
        setMenuIsOpen(-1);
        goToTop();
      }}
      className={
        colorChanger == content
          ? "w-full md:w-40 h-6 md:h-10 text-md rounded flex justify-center items-center bg-[#2357b1] text-white transition-all duration-200 hover:bg-indigo-400"
          : "w-full md:w-40 h-6 md:h-10 text-md rounded flex justify-center items-center bg-[#b17d23] text-white transition-all duration-200 hover:bg-indigo-400"
      }
    >
      {title}
    </button>
  );
};

export default DCBtn;
