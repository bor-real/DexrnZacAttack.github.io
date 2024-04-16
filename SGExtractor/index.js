import "https://cdnjs.cloudflare.com/ajax/libs/ice/3.7.100/Ice.min.js";

import "../js/settings.js"; // sets theme and lang
import "../js/background.js"; // this sets an 'onload' handler
import "../js/fadeout.js"; // this sets a 'DOMContentLoaded' handler
import "../js/LCEExtractor.js"; // component setup

import { switchCompressionMode } from '../js/LCEExtractor.js';
import { fadeBG } from '../js/background.js';
import { setVer } from '../js/ver.js';

let i = 0;
function incrementI() {
  // only thing I could think to name it...
  if (i > 1) {
    i = 0;
  } else {
    i++;
  }
  switchCompressionMode(i);
}
document.querySelector('#CompModeBtn').addEventListener('click', incrementI);
fadeBG(true);
setVer("le");


export function showNBTCard(data) {
    if (data == undefined)
        throw new Error("Data is undefined!");

    if (document.getElementById("nbtCard").style.display == "none") {
        document.getElementById("lceCard").style.display = "none";
        document.getElementById("nbtCard").style.display = "flex";
        document.getElementById("nbtData").innerText = JSON.stringify(data);
    }

}

export function hideNBTCard() {
    if (document.getElementById("nbtCard").style.display !== "none") {
        document.getElementById("lceCard").style.display = "flex";
        document.getElementById("nbtCard").style.display = "none";
    }
}

document.querySelector('#hideNBTData').addEventListener('click', hideNBTCard);