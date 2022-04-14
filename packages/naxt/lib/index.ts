const isStrOrNumber = (value: any, key?: any): value is string | number =>
  (typeof value === "string" || typeof value === "number") &&
  (key ? typeof key === "string" || typeof key === "number" : true);

export const cmp = (execHtml: Function) => {
  return function (tag: string = "") {
    return function (props: object) {
      let heads = new Set<string>();
      const setHead = (string = "") => {
        heads.add(string);
        return "";
      };
      let { html, dependencies, ...res } = execHtml({ ...props, setHead });

      heads = new Set(Array.from([...heads, ...res.heads]));

      if (!globalThis.fetch && tag) {
        const attr = Object.entries(props)
          .map(([key, value]) =>
            isStrOrNumber(value) ? ` ${key}="${value}"` : ""
          )
          .join("");
        html = `<${tag}${attr}>${html}</${tag}>`;
      }
      return { tag, dependencies, html, heads };
    };
  };
};

export const html = (...fragments: any[]) => {
  const parts: any[] = [...fragments.shift()];
  let html = parts?.shift();
  let dependencies = new Set<string>();
  let heads = new Set<string>();

  for (let i = 0; i < parts.length; i++) {
    let fragment = fragments[i] || "";
    const part = parts[i];

    if (fragment?.tag) {
      dependencies.add(fragment.tag);
      dependencies = new Set<string>([
        ...dependencies,
        ...fragment.dependencies,
      ]);
      fragment = fragment.html;
    }
    if (fragment.heads) {
      heads = new Set<string>([...heads, ...fragment.heads]);
    }

    html += fragment + part;
  }

  return {
    dependencies,
    html,
    heads,
  };
};
