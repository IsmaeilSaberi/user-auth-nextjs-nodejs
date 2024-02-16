import BlogPageComp from "../../components/blog-page";

const BlogPage = async ({ searchParams }) => {
  return (
    <div className="container mx-auto">
      <>
        <title>وبلاگ فروشگاه فایل مدرسه اکسل</title>
        <meta name="description" content="وبلاگ فروشگاه فایل مدرسه اکسل" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="http://mdxl.ir/blog" />
      </>
      <BlogPageComp url={searchParams} />
    </div>
  );
};

export default BlogPage;
