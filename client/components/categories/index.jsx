const getData = async () => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-active-categories`,
    {
      cache: "no-store",
    }
  );
  return data.json();
};

import CatBox from "./box";

const Categories = async () => {
  const data = await getData();
  return (
    <div className="container mx-auto p-2">
      {data.length < 1 ? (
        <div></div>
      ) : (
        <section className="flex justify-center md:justify-between items-center gap-2 flex-wrap border-[0.1rem] rounded-sm border-[#23b17d] p-2">
          {data.map((da, i) => (
            <CatBox key={i} data={da} />
          ))}
        </section>
      )}
    </div>
  );
};

export default Categories;
