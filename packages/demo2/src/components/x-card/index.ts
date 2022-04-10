import { cmp, html } from "naxt/lib";
import { Title } from "../x-title";

export const tag = 'x-card'

export const Card = cmp(({ title, text }) => html`
  <div>
    ${Title({ title })}
    <span>${text}</span>
  </div>
`)(tag)