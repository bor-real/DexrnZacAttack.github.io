/*
Copyright 2024 Dexrn ZacAttack

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var DLog = false;
console.log(
    'settings.js: Dexrn: I put logging in here but you\'ll have to set "DLog" to true.'
  );
/**
 * @param {string} message
 * @returns {void}
 */
function DexrnsFunnyLogger(message) {
  if (DLog) {
    console.log("settings.js: " + message);
  } else {
    return;
  }
}

/**
 * @param {"default-light" | "default-dark"} theme
 * @returns {void}
 */
export function setTheme(theme) {
  var expirationDate = new Date("Fri, 31 Dec 9999 23:59:59 GMT");
  document.cookie = `Theme=${theme}; expires=${expirationDate.toUTCString()}; path=/`;

  applyTheme(theme);
}

/**
 * @param {"default-light" | "default-dark"} theme
 * @returns {void}
 */
function applyTheme(theme) {
  const stylesheetElement = /** @type {HTMLLinkElement} */ (document.getElementById("theme"));
  switch (theme) {
    case "default-light":
      stylesheetElement.href = "/css/default-light.css";
      break;
    case "default-dark":
    default:
      stylesheetElement.href = "/css/default-dark.css";
      break;
  }
}

/**
 * @template {string} K
 * @param {K} name
 * @returns {K extends "Theme" ? "default-light" | "default-dark" : string | null}
 */
export function getThemeCookie(name) {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName === name) {
      // @ts-expect-error - type inference, TS overloads would work better to solve this
      return cookieValue;
    }
  }
  return null;
}

const savedTheme = getThemeCookie("Theme");

applyTheme(savedTheme);

/**
 * @param {keyof LanyardLangNameMap} [syslang]
 * @returns {void}
 */
export function checkLang(syslang) {
  const lang = getLang();
  DexrnsFunnyLogger(`Language: ${lang}`);
  let langFilePath;
  if (lang) {
      DexrnsFunnyLogger(`Not using system language`);
  switch (lang.toLowerCase()) {
    case "zh-cn":
      langFilePath = "/assets/lang/zh-CN.json";
      break;
    case "en-us":
    default:
      langFilePath = "/assets/lang/en-US.json";
      break;
  }} else if (syslang) {
    DexrnsFunnyLogger(`Using system language: ${syslang}`);
    switch (syslang.toLowerCase()) {
      case "zh-cn":
        langFilePath = "/assets/lang/zh-CN.json";
        break;
      case "en-us":
      default:
        langFilePath = "/assets/lang/en-US.json";
        break;
    }} else {
      langFilePath = "/assets/lang/en-US.json";
    }
  setLang(langFilePath);
}


checkLang();

/**
 * @returns {string}
 */
export function getLang() {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "lang") {
      return value;
    }
  } 
  DexrnsFunnyLogger(`Language cookie not found`);
  return null;
}

// Dexrn: Localization! (Kinda janky.)
/**
 * @param {string} langFilePath
 * @return {void}
 */
function setLang(langFilePath) {
  fetch(langFilePath)
    .then((response) => response.json())
    .then((data) => {
      checkIfExists("loadingText", data.LoadingText);
      checkIfExists("onlineState", data.Status2);
      checkIfExists("activityName", data.ActivityName);
      checkIfExists("activityState", data.ActivityState);
      checkIfExists("activityDetail", data.ActivityDetail);
      checkIfExists("activity-path", data.ActivityPath);
      checkIfExists("discord-path", data.DiscordPath);
      checkIfExists("steam-path", data.SteamPath);
      checkIfExists("about-path", data.AboutPath);
      checkIfExists("stuff-path", data.LinksPath);
      checkIfExists("mainbtn-1", data.MainPageButton1);
      checkIfExists("mainbtn-2", data.MainPageButton2);
      checkIfExists("mainbtn-3", data.MainPageButton3);
      checkIfExists("abm-1", data.AboutMeTxt1);
      checkIfExists("abm-2", data.AboutMeTxt2);
      checkIfExists("savebtn", data.SettingsSaveButton);
      checkIfExists("settings-path", data.SettingsPath);
      checkIfExists("backbtn", data.BackButton);
      checkIfExists("languagetxt", data.LanguageText);
      checkIfExists("settingsbtn", data.SettingsButton);
      checkIfExists("ftlLanguageTxt", data.FirstTimeLoadLanguageText);
      checkIfExists("ftlcbtn-1", data.FirstTimeLoadButton1);
      checkIfExists("backbtn", data.BackButton);
      checkIfExists("backbtn2", data.BackButtonAlt);
      checkIfExists("qmghp-path", data.QMGHeaderParserPath);
      checkIfExists("lcee-path", data.LCEExtractorPath);
      checkIfExists("lcefileselectbtn", data.LCEFileSelectButton);
      checkIfExists("fileselectbtn", data.FileSelectButton);
      checkIfExists("output", data.QMGHPOutputText);
      checkIfExists("qmgr-path", data.QMGResearchPath);
      checkIfExists("404msg", data.NotFoundErrorText);
      checkIfExists("homebtn", data.HomeButton);
      checkIfExists("403msg", data.ForbiddenErrorText);
      checkIfExists("selopt", data.SelectOptionText);
      checkIfExists("selopt2", data.SelectOptionText);
      checkIfExists("darkthmopt", data.DarkThemeOption);
      checkIfExists("lightthmopt", data.LightThemeOption);
      checkIfExists("themetxt", data.ThemeText);
      checkIfExists("ftlThemeTxt", data.FirstTimeLoadThemeText);
      checkIfExists("blogbtntxt", data.BlogButtonText);
      checkIfExists("abbutton", data.StuffText);
      checkIfExists("stuff2-path", data.MyStuffPath);
      checkIfExists("darkopt", data.InitialSetupDarkThemeOption);
      checkIfExists("lightopt", data.InitialSetupLightThemeOption);
    })
    .catch((error) => console.error("Error whilst loading lang file:", error));
}

// Dexrn: This makes sure that the element exists before setting it... otherwise it will throw an error.
/**
 * @param {string} elementId
 * @param {string} value
 * @returns {void}
 */
function checkIfExists(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  } else {
    DexrnsFunnyLogger(`Element ${element} does not exist on this page.`);
  }
}
