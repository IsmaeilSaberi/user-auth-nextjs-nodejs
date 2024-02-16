"use client";
import { useState } from "react";
import DCBtn from "./btn";

const RulesCtrl = ({ setContentChanger, setMenuIsOpen }) => {
  const [colorChanger, setColorChanger] = useState("Introduce");
  return (
    <div className="flex justify-center items-center mt-12 md:mt-0 ">
      <div className="flex flex-col justify-center items-center gap-4 w-full">
        <DCBtn
          title={" قوانین کلی"}
          content={"Introduce"}
          setContentChanger={setContentChanger}
          colorChanger={colorChanger}
          setColorChanger={setColorChanger}
          setMenuIsOpen={setMenuIsOpen}
        />
        <DCBtn
          title={" قوانین خرید"}
          content={"shopping"}
          setContentChanger={setContentChanger}
          colorChanger={colorChanger}
          setColorChanger={setColorChanger}
          setMenuIsOpen={setMenuIsOpen}
        />
        <DCBtn
          title={"قوانین دیدگاه"}
          content={"comment"}
          setContentChanger={setContentChanger}
          colorChanger={colorChanger}
          setColorChanger={setColorChanger}
          setMenuIsOpen={setMenuIsOpen}
        />
        <DCBtn
          title={" سوالات پرتکرار"}
          content={"faq"}
          setContentChanger={setContentChanger}
          colorChanger={colorChanger}
          setColorChanger={setColorChanger}
          setMenuIsOpen={setMenuIsOpen}
        />
      </div>
    </div>
  );
};

export default RulesCtrl;
