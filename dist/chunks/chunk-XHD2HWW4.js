import {
  init_live_reload
} from "./chunk-VVUAQP7I.js";

// node_modules/.pnpm/@taj-wf+utils@1.1.1/node_modules/@taj-wf/utils/dist/index.js
init_live_reload();
var c = ({ selector: e, parent: t, log: n = "debug" }) => {
  let o = (t || document).querySelector(e);
  return o === null ? (n === false || (n === "debug" ? console.debug : console.error)(`${n.toUpperCase()}: Element with selector "${e}" not found in ${t !== void 0 ? "the specified parent element:" : "the document."}`, t), null) : o;
};
var d = ({ selector: e, parent: t, log: n = "debug" }) => {
  let o = Array.from((t || document).querySelectorAll(e));
  return o.length === 0 ? (n === false || (n === "debug" ? console.debug : console.error)(`${n.toUpperCase()}: No elements found with selector "${e}" in ${t !== void 0 ? "the specified parent element:" : "the document."}`, t), null) : o;
};
var u = () => {
  let e = import.meta.url;
  return c({ selector: `script[src="${e}"]` });
};
var y = (e = [], t) => {
  let n = null, o = t === "debug" ? console.debug : t === "error" ? console.error : null;
  try {
    n = gsap;
  } catch {
    o?.("GSAP script needs to be imported before this script:", u(), `
`, "Get GSAP from here: https://gsap.com/docs/v3/Installation/ ");
  }
  let r = [n];
  for (let l = 0; l < e.length; l++) {
    let s = e[l], p = null;
    try {
      p = window[s] || null;
    } catch {
      o?.(`${s} plugin script needs to be imported before this script.`, u(), `
`, `Get ${s} plugin from here: https://gsap.com/docs/v3/Installation/ `);
    }
    r[l + 1] = p;
  }
  return r;
};

export {
  c,
  d,
  y
};
//# sourceMappingURL=chunk-XHD2HWW4.js.map
