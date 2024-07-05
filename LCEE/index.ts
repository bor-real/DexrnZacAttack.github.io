import "../js/settings.js"; // sets theme and lang
import "../js/background.js"; // this sets an 'onload' handler
import "../js/fadeout.js"; // this sets a 'DOMContentLoaded' handler
import "../js/LCEE-Core.js"; // component setup
import "../js/modules/common.js"; // common setup

import { stringify } from "nbtify";
import { switchCompressionMode } from '../js/LCEE-Core.js';
import { fadeBG } from '../js/background.js';
import { setVer } from '../js/ver.js';
import { readFile } from "../js/LCEE-Core.js";

import type { NBTData } from "nbtify";
import { doubleImportTest } from "../js/modules/common.js";

doubleImportTest(new URL(import.meta.url).href);

let i = 0;
function incrementI(): void {
  // only thing I could think to name it...
  if (i > 1) {
    i = 0;
  } else {
    i++;
  }
  switchCompressionMode(i);
}
document.querySelector('#CompModeBtn')!.addEventListener('click', incrementI);
document.querySelector('#backNBTBtn')!.addEventListener('click', hideNBTCard);
fadeBG(true);
setVer("le");


export function showNBTCard(data: NBTData | undefined): void {
    if (data == undefined)
        throw new Error("Data is undefined!");

    if (document.getElementById("nbtCard")!.style.display == "none") {
        document.getElementById("lceCard")!.style.display = "none";
        document.getElementById("back")!.style.display = "none";
        document.getElementById("nbtCard")!.style.display = "flex";
        document.getElementById("backNBTBtn")!.style.display = "block";
        document.getElementById("nbtData")!.innerText = stringify(data, { space: 2 });
    }

}

export function hideNBTCard(): void {
    if (document.getElementById("nbtCard")!.style.display !== "none") {
        document.getElementById("back")!.style.display = "block";
        document.getElementById("backNBTBtn")!.style.display = "none";
        document.getElementById("lceCard")!.style.display = "flex";
        document.getElementById("nbtCard")!.style.display = "none";
    }
}

(document.getElementById("fileInput")!).addEventListener("change", onFileSelected);

function onFileSelected(this: HTMLInputElement): void {
  const file = this.files![0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      readFile(file, file.name);
    };
    reader.readAsArrayBuffer(file);
  }
}

document.addEventListener("dragover", (e) => {
  e.preventDefault();
});

document.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer!.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      readFile(file, file.name);
    };
    reader.readAsArrayBuffer(file);
  }
});