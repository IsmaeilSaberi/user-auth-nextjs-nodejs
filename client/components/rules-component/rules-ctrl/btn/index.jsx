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
          ? "w-full md:w-36 h-8 md:h-10 text-base rounded flex justify-center items-center bg-[#23b17d] text-white border-[0.15rem] border-[#b13e57] transition-all duration-200 hover:bg-indigo-700"
          : "w-full md:w-36 h-8 md:h-10 text-base rounded flex justify-center items-center bg-[#b17d23] text-white transition-all duration-200 hover:bg-[#23b17d]"
      }
    >
      {title}
    </button>
  );
};

export default DCBtn;
