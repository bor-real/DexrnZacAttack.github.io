

document.addEventListener("DOMContentLoaded", function () {
    // thx actuallyaridan
        showLoadingText();
        fadeBG(true);
        // this may still be broken on Webkit, hopefully not though... Thanks, Apple.
        actuallySetLanguage();
        checkLang();
});

curTab = 1;

// Dexrn: This is for the text that shows on the loading screen.
async function showLoadingText() {
    await new Promise(resolve => setTimeout(resolve, 5000));

    var loadingText = document.querySelector('.loadingtext');
    if (loadingText) {
        loadingText.classList.remove('hidden');
    }
}

document.getElementById('savebtn').addEventListener('click', function () {
    var selectedLanguage = document.getElementById('language2').value;
    var selectedTheme = document.getElementById('themeoption').value;
    var currentTheme = getThemeCookie('Theme');
    var currentLanguage = getLang();
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


document.addEventListener('DOMContentLoaded', function () {
    var activityCard = document.querySelector('#activityCard');
    var aboutCard = document.querySelector('#aboutCard');
    var linksCard = document.querySelector('#linksCard');
    var abm = document.querySelector('#stuffTab');
    var toggleButton = document.getElementById('settingsbtn');
    var settingsPage = document.getElementById('settings');
    var tabContainer = document.getElementById('mainCardsContainer');

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
    var toggleButton = document.getElementById('settingsbtn');
    var mainCard = document.querySelector('#mainCard');
    var activityCard = document.querySelector('#activityCard');
    var aboutCard = document.querySelector('#aboutCard');
    var linksCard = document.querySelector('#linksCard');
    var abm = document.querySelector('#stuffTab');
    var closesettingsbtn = document.getElementById('settingsclose');
    var settingsPage = document.getElementById('settings');
    var tabButtons = document.getElementById('tabbutton');
    var tabContainer = document.getElementById('mainCardsContainer');

    settingsPage.style.display = 'none';

    closesettingsbtn.addEventListener('click', function () {
        curTab = curTab;
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
        curTab = curTab;
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