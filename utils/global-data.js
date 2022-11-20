export const getGlobalData = () => {
  const blogTitle = process.env.BLOG_TITLE
    ? decodeURI(process.env.BLOG_TITLE)
    : 'CSS Tech History';
  const footerText = process.env.BLOG_FOOTER_TEXT
    ? decodeURI(process.env.BLOG_FOOTER_TEXT)
    : 'By @YinDongFang';

  return {
    blogTitle,
    footerText,
  };
};
