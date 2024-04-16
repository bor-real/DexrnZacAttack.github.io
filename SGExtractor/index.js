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