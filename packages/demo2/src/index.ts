import express from "express";
import { naxtRouter } from "naxt/lib/router";
import { build } from "naxt/lib/server";
import BlogPage from "./pages/blog/Blog";
import PostPage from "./pages/blog/Post";
import IndexPage from "./pages/Index";
import Layout from "./components/x-layout";

const main = async () => {
  const app = express();
  const PORT = process.env.PORT || 3030;

  const routes = {
    "/": IndexPage()``,
    "/blog": BlogPage()``,
    "/blog/:title": PostPage()``,
  };

  const builded = await build();
  app.use("/components", express.static(builded.dist));

  const layout = (content: string) => {
    return "" + Layout()({ content }).html;
  };

  app.use(naxtRouter(routes, layout));

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

main();
