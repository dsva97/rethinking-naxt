import express from "express";
import { daxtRouter } from "daxt";
import { routes } from ".";
import Layout from "./components/x-layout";

const app = express();

app.use(daxtRouter(routes, Layout));

app.listen(3050);
