import express from 'express'
import { naxtRouter, build } from "naxt/lib/server";
import BlogPage from "./pages/blog/Blog";
import PostPage from "./pages/blog/Post";
import IndexPage from "./pages/Index";

const main = async () => {
  const app = express()
  const PORT = process.env.PORT || 3030

  const routes = {
    "/": IndexPage()``,
    "/blog": BlogPage()``,
    "/blog/:title": PostPage()``,
  };
  
  const builded = await build()
  app.use("/components", express.static(builded.dist));
  
  app.use(naxtRouter(routes))

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
}

main()