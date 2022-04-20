import BlogPage from "./pages/blog/Blog";
import PostPage from "./pages/blog/Post";
import IndexPage from "./pages/Index";

export const routes = {
  "/": {
    page: IndexPage,
  },
  "/blog": {
    page: BlogPage,
  },
  "/blog/:title": {
    page: PostPage,
    getStaticPaths: async () => {},
    getStaticProps: async () => {},
  },
};
