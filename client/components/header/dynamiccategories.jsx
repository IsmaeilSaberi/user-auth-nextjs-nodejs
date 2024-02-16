import { useRouter } from "next/navigation";
import DynamicDropdown from "../dropdown-menu/dynamicdropdown";
import { useState } from "react";

const DynamicCategories = ({ data, setMenuIsOpen }) => {
  ////// THESE PARTS ARE FOR HANDELING DYNAMIC DROP DOWNS OPENING AND CLOSING
  const [cateStates, setCatStates] = useState(Array(data.length).fill(false));

  const handleCatStates = (i) => {
    const nextCateStates = cateStates.slice();
    nextCateStates[i] = !cateStates[i];
    for (let j = 0; j < cateStates.length; j++) {
      if (j !== i) {
        nextCateStates[j] = false;
      }
    }
    setCatStates(nextCateStates);
  };
  const router = useRouter();
  return (
    <>
      {data.length < 1 ? (
        <div></div>
      ) : (
        data.map((da, i) => (
          <li
            onMouseEnter={() => handleCatStates(i)}
            onMouseLeave={() => handleCatStates(i)}
            key={i}
            // href={`/shop?keyword=${escape(da.title)}`}
            onClick={() => {
              handleCatStates(i);
              // router.push(`/shop?keyword=${escape(da.title)}`);
              // setMenuIsOpen(-1);
            }}
            className="bg-[#b17d23] cursor-pointer text-white hover:text-[#b12357] border-purple-300 border-[0.1rem] h-9 rounded px-1 flex justify-center items-center transition-all duration-200 hover:bg-[#9fe2a6]"
          >
            {da.title}
            <DynamicDropdown
              index={i}
              setMenuIsOpen={setMenuIsOpen}
              cateStates={cateStates[i]}
              handleCatStates={handleCatStates}
              data={da.subCategories}
            />
          </li>
        ))
      )}
    </>
  );
};

export default DynamicCategories;
