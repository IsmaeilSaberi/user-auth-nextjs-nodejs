"use client";
import { useEffect, useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import RulesCtrl from "../rules-ctrl";
import CommonRules from "../forms/Introduction";
import CommentRules from "../forms/comment-rules";
import QuestionRules from "../forms/question-rules";
import ShoppingRules from "../forms/shopping-rules";

const MainRules = () => {
  const [contentChanger, setContentChanger] = useState("Introduce");
  const [details, setDetails] = useState(<CommonRules />);

  const goToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (contentChanger == "comment") {
      setDetails(<CommentRules />);
    } else if (contentChanger == "faq") {
      setDetails(<QuestionRules />);
    } else if (contentChanger == "shopping") {
      setDetails(<ShoppingRules />);
    } else {
      setDetails(<CommonRules />);
    }
    goToTop();
  }, [contentChanger]);

  //FOR RESPONSIVE
  const [menuIsOpen, setMenuIsOpen] = useState(-1);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-start gap-2">
        <div
          className={
            menuIsOpen == -1
              ? "z-50 md:z-30 w-full md:w-56 bg-gray-600 md:bg-zinc-100 rounded-none md:rounded-md md:bg-transparent fixed md:sticky md:top-8 md:right-0 md:bottom-8 h-auto p-2 top-0 bottom-0 left-[100%] md:left-0 -right-[100%] transition-all duration-500"
              : "z-50 md:z-30 w-full md:w-56 backdrop-blur-3xl md:bg-zinc-100 rounded-none md:rounded-md md:bg-transparent h-[100vh] p-2 fixed top-0 bottom-0 right-0 left-0 md:absolute transition-all duration-500"
          }
        >
          <RulesCtrl
            setContentChanger={setContentChanger}
            setMenuIsOpen={setMenuIsOpen}
          />
        </div>
        <div className="p-2 bg-zinc-50 w-full rounded mt-2 md:mt-0">
          {details}
        </div>
      </div>
      <div className="fixed z-50 flex md:hidden left-4 top-4  rounded-full p-1">
        <MdOutlineDashboard
          onClick={() => setMenuIsOpen(menuIsOpen * -1)}
          className={
            menuIsOpen == -1
              ? "w-8 h-8 text-indigo-600 flex"
              : "w-9 h-9 text-black hidden"
          }
        />
        <AiOutlineClose
          onClick={() => setMenuIsOpen(menuIsOpen * -1)}
          className={
            menuIsOpen == 1
              ? "w-8 h-8 text-black fixed top-2 left-2"
              : "w-10 h-10 text-black hidden"
          }
        />
      </div>
    </div>
  );
};

export default MainRules;
