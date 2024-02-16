"use client";
import { useState, useEffect } from "react";
import AllRules from "./all-rules";
import NewRule from "./new-rule";
import RuleDetails from "./rule-details";

const RuleMain = () => {
  const [ruleDetailCtrl, setRuleDetailCtrl] = useState("");
  const [randNumForRuleClick, setRandNumForRuleClick] = useState(1);
  const [details, setDetails] = useState(
    <AllRules
      setRandNumForRuleClick={setRandNumForRuleClick}
      setRuleDetailCtrl={setRuleDetailCtrl}
    />
  );

  useEffect(() => {
    if (ruleDetailCtrl != "") {
      setDetails(<RuleDetails ruleId={ruleDetailCtrl} />);
    }
  }, [randNumForRuleClick]);

  return (
    <div className="flex flex-col gap-6 relative pt-4 md:pt-8">
      <section className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-indigo-600 text-lg w-full">قوانین</h1>
        <div className="flex w-full justify-between md:justify-end items-center gap-10 md:gap-2">
          <button
            onClick={() =>
              setDetails(
                <AllRules
                  setRandNumForRuleClick={setRandNumForRuleClick}
                  setRuleDetailCtrl={setRuleDetailCtrl}
                />
              )
            }
            className="flex justify-center items-center w-32 h-10 rounded bg-indigo-600 text-white transition-all duration-200 hover:bg-indigo-800"
          >
            همه
          </button>
          <button
            onClick={() => setDetails(<NewRule />)}
            className="flex justify-center items-center w-32 h-10 rounded bg-indigo-600 text-white transition-all duration-200 hover:bg-indigo-800"
          >
            قانون جدید
          </button>
        </div>
      </section>
      <section className="flex justify-center items-center">{details}</section>
    </div>
  );
};

export default RuleMain;
