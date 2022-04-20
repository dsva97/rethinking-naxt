import express from "express";
import path from "path";
import { daxtRouter } from "daxt/lib/router";
import { build } from "daxt/lib/server";
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
  app.use("/__scripts__", express.static(builded.dist));
  const parts = path.join(builded.dist + "/../__parts__");
  app.use("/__parts__", express.static(parts));
  app.use("/tailwind.css", (req, res) => {
    res.sendFile(path.join(builded.dist + "/../tailwind.css"));
  });

  const layout = (content: string) => {
    return "" + Layout()({ content }).html;
  };

  app.use(daxtRouter(routes, layout));

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

main();
