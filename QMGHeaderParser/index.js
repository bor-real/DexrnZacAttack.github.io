import "../js/settings.js"; // sets theme and lang
import "../js/background.js"; // this sets an 'onload' handler
import "../js/fadeout.js"; // this sets a 'DOMContentLoaded' handler
import "../js/QMGParser.js"; // component setup

import { fadeBG } from "../js/background.js";
import { setVer } from "../js/ver.js";

setVer("qd");
fadeBG(true);