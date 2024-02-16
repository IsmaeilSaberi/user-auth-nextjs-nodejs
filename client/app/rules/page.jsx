import MainRules from "@/components/rules-component/rules-main";

export const metadata = {
  metadataBase: new URL("http://mdxl.ir/"),
  title: "قوانین",
  description: "قوانین فروشگاه مدرسه اکسل",
  alternates: {
    canonical: "/rules",
    languages: {
      fa: "/fa-IR",
    },
  },
};

const Page = () => {
  return (
    <section className="container mx-auto flex justify-center items-center flex-wrap gap-4">
      <MainRules />
    </section>
  );
};

export default Page;
