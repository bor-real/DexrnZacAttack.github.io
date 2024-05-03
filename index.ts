// These imports are here because they use side-effects, rather than
// import-based function calls. Ideally modules don't add side-effects, rather
// they can export functionality that can be called from the module that imports it.

import "./js/settings.js"; // sets theme and lang
import "./js/lanyard.js"; // lanyard setup
import "./js/modules/msgbox.js"; // unused? not used yet, at least
// import "./js/steam.js"; // unused
import "./js/background.js"; // this sets an 'onload' handler
import "./js/fadeout.js"; // this sets a 'DOMContentLoaded' handler
import "./js/expandable.js"; // component setup

import { fadeBG } from "./js/background.js";
import { actuallySetLanguage } from "./js/lanyard.js";
import { type Theme, checkLang, getLang, getThemeCookie, setTheme } from "./js/settings.js"
import { curTab, setCurTab } from "./js/tabs.js";
import { setVer } from "./js/ver.js";

document.addEventListener("DOMContentLoaded", function () {
    // thx actuallyaridan
        showLoadingText();
        fadeBG(true);
        // this may still be broken on Webkit, hopefully not though... Thanks, Apple.
        actuallySetLanguage();
        checkLang();
});

setCurTab(1);

// Dexrn: This is for the text that shows on the loading screen.
async function showLoadingText(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 5000));

    var loadingText = document.querySelector('.loadingtext');
    if (loadingText) {
        loadingText.classList.remove('hidden');
    }
}

document.getElementById('savebtn')!.addEventListener('click', function () {
    var selectedLanguage = (document.getElementById('language2') as HTMLInputElement).value;
    var selectedTheme: Theme = (document.getElementById('themeoption') as HTMLSelectElement).value as Theme;
    if (selectedLanguage !== getLang() && selectedLanguage !== 'unselected') {
        var expires = new Date('Fri, 31 Dec 9999 23:59:59 GMT').toUTCString();
        document.cookie = 'lang=' + selectedLanguage + '; expires=' + expires + '; path=/';
        actuallySetLanguage();
        checkLang();
    } else {
    }
    if (selectedTheme !== getThemeCookie('Theme') && selectedTheme !== 'unselectedtheme') {
        setTheme(selectedTheme);
    } else {

    }
});

// Note: Made these nullable to get rid of some pesky errors + I am not sure what exactly to do to make them not null.
document.addEventListener('DOMContentLoaded', function () {
    var activityCard: HTMLElement = document.querySelector('#activityCard')!;
    var aboutCard: HTMLElement = document.querySelector('#aboutCard')!;
    var linksCard: HTMLElement = document.querySelector('#linksCard')!;
    var abm: HTMLElement = document.querySelector('#stuffTab')!;
    var toggleButton: HTMLElement = document.getElementById('settingsbtn')!;
    var settingsPage: HTMLElement = document.getElementById('settings')!;
    var tabContainer: HTMLElement = document.getElementById('mainCardsContainer')!;

    settingsPage.style.display = 'none';

    toggleButton.addEventListener('click', function () {
        tabContainer.style.display = 'none';
        activityCard.style.display = 'none';
        aboutCard.style.display = 'none';
        linksCard.style.display = 'none';
        abm.style.display = 'none';
        toggleButton.style.display = 'none';
        settingsPage.style.display = 'block';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var toggleButton: HTMLElement = document.getElementById('settingsbtn')!;
    var activityCard: HTMLElement = document.querySelector('#activityCard')!;
    var aboutCard: HTMLElement = document.querySelector('#aboutCard')!;
    var linksCard: HTMLElement = document.querySelector('#linksCard')!;
    var abm: HTMLElement = document.querySelector('#stuffTab')!;
    var closesettingsbtn: HTMLElement = document.getElementById('settingsclose')!;
    var settingsPage: HTMLElement = document.getElementById('settings')!;
    var tabContainer: HTMLElement = document.getElementById('mainCardsContainer')!;
    var savebtn: HTMLElement = document.getElementById('savebtn')!;

    settingsPage.style.display = 'none';

    closesettingsbtn.addEventListener('click', function () {
        setCurTab(previous => previous);
        tabContainer.style.display = 'block';
        console.log("init curTab: " + curTab);
        if (curTab === 1) {
            console.log(1)
            activityCard.style.display = 'block';
            aboutCard.style.display = 'block';
            linksCard.style.display = 'block';
        } else if (curTab === 2) {
            console.log(2)
            abm.style.display = 'block';
        }
        toggleButton.style.display = 'block';
        settingsPage.style.display = 'none';
    });
    savebtn.addEventListener('click', function () {
        setCurTab(previous => previous);
        tabContainer.style.display = 'block';
        console.log("init curTab: " + curTab);
        if (curTab === 1) {
            console.log(1)
            activityCard.style.display = 'block';
            aboutCard.style.display = 'block';
            linksCard.style.display = 'block';
        } else if (curTab === 2) {
            console.log(2)
            abm.style.display = 'block';
        }
        toggleButton.style.display = 'block';
        settingsPage.style.display = 'none';
    });
});


setVer("default");