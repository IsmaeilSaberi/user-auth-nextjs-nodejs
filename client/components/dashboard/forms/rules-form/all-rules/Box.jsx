"use client";

const Box = ({ data, setRuleDetailCtrl, setRandNumForRuleClick }) => {
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
        setRuleDetailCtrl(data._id);
        setRandNumForRuleClick(Math.random());
      }}
      className="relative flex flex-col md:flex-row justify-between items-center w-full cursor-pointer p-2 rounded-lg border-2 border-zinc-200 bg-zinc-100 transition-all duration-200 hover:border-indigo-500"
    >
      <div className="flex flex-col gap-4 h-20">
        <div className="absolute top-2 right-2 text-xl">{data.title}</div>
        <div className="flex items-center gap-2 absolute bottom-5 left-5">
          <div className="bg-indigo-600 rounded px-3 py-1 text-xs text-white">
            {data.typeOfRule == "intro"
              ? "قوانین کلی"
              : data.typeOfRule == "comment"
              ? " قوانین دیدگاه"
              : " قوانین سوال"}
          </div>
          {data.situation == true ? (
            <div className="text-xs bg-green-500 text-white px-2 py-1 rounded">
              روشن
            </div>
          ) : (
            <div className="text-xs bg-rose-500 text-white px-2 py-1 rounded">
              خاموش
            </div>
          )}
          <div className="text-xs bg-orange-500 text-white px-2 py-1 rounded">
            {data.createdAt}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Box;
