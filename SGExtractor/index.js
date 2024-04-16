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