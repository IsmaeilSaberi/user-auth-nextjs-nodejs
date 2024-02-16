import he from "he";

const HtmlRender = ({ htmlContent }) => {
  const decodedHtml = he.decode(htmlContent ? htmlContent : "");

  return (
    <div
      className="text-justify"
      dangerouslySetInnerHTML={{ __html: decodedHtml }}
    ></div>
  );
};

export default HtmlRender;
