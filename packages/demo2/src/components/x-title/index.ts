import { cmp, html } from "naxt/lib";
import classes from './style.module.css'

export const tag = 'x-title'

export const Title = cmp(({ title }) => html`
  <h1 class="${classes.title}">${title}</h1>
`)(tag)