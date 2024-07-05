import "../js/settings.js"; // sets theme and lang
import "../js/background.js"; // this sets an 'onload' handler
import "../js/fadeout.js"; // this sets a 'DOMContentLoaded' handler
import "../js/modules/common.js"; // common setup
import { parse } from "marked";
import { fadeBG } from "../js/background.js";
import { parseString, doubleImportTest } from "../js/modules/common.js";

doubleImportTest(new URL(import.meta.url).href);

fetch("https://dexrn.duckdns.org/post?post=QMG")
.then(response => {
    return response.json();
})
.then(async data => {
    const mdElement = document.createElement("div");
    mdElement.innerHTML = await parse(parseString(JSON.stringify(data.body)).slice(1,-1));
    document.querySelector("#blogCard")?.appendChild(mdElement);
});

fadeBG(true);