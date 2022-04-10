import { Button as Template } from "./template";

export const Button = (props, children) => {
  const fragment = document.createDocumentFragment();
  const template = document.createElement("template");
  template.innerHTML = Template(props, children);
  fragment.appendChild(template.content.cloneNode(true));
  template.remove();
  return fragment;
};
