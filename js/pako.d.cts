// Most of the time for using packages, you would want to install these with `npm` and use it from your `node_modules` folder,
// but I just copied it here to add the typings more simply for the time being.

// https://github.com/nodeca/pako
// https://www.npmjs.com/package/@types/pako
// https://www.jsdelivr.com/package/npm/pako

declare module "https://cdn.jsdelivr.net/npm/pako@2.1.0/+esm" {
  import pako from "pako";
  export = pako;
}