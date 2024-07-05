import "../js/settings.js"; // sets theme and lang
import "../js/background.js"; // this sets an 'onload' handler
import "../js/fadeout.js"; // this sets a 'DOMContentLoaded' handler
import "../js/QMGParser.js"; // component setup
import "../js/modules/common.js"; // common setup

import { fadeBG } from "../js/background.js";
import { setVer } from "../js/ver.js";
import { doubleImportTest } from "../js/modules/common.js";
doubleImportTest(new URL(import.meta.url).href);
setVer("qd");
fadeBG(true);