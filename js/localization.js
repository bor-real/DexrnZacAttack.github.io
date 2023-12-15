function checkLang() {
    const lang = getLanguageFromCookie();
    console.log(lang);
    let langFilePath;

    switch (lang) {
    case 'zh-CN':
        langFilePath = "assets/lang/zh-CN.json";
        break;
    case 'en-US':
        langFilePath = "assets/lang/en-US.json";
        break;
    default:
        langFilePath = "/assets/lang/en-US.json";
        break;
    }
    setLang(langFilePath);
}

checkLang();


function getLanguageFromCookie() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'lang') {
            return value;
        }
    }
    return null; // Cookie not found
}


// Dexrn: Localization! (Kinda janky.)
// Dexrn: TODO: Make this it's own JS file.
function setLang(langFilePath) {
    fetch(langFilePath)
        .then(response => response.json())
        .then(data => {
            checkIfExists('loadingtext', data.LoadingText);
            checkIfExists('status2', data.Status2);
            checkIfExists('activity-name', data.ActivityName);
            checkIfExists('activity-state', data.ActivityState);
            checkIfExists('activity-detail', data.ActivityDetail);
            checkIfExists('activity-path', data.ActivityPath);
            checkIfExists('home-path', data.HomePath);
            checkIfExists('about-path', data.AboutPath);
            checkIfExists('stuff-path', data.LinksPath);
            checkIfExists('mainbtn-1', data.MainPageButton1);
            checkIfExists('mainbtn-2', data.MainPageButton2);
            checkIfExists('abm-1', data.AboutMeTxt1);
            checkIfExists('abm-2', data.AboutMeTxt2);
            checkIfExists('savebtn', data.SettingsSaveButton);
            checkIfExists('settings-path', data.SettingsPath);
            checkIfExists('backbtn', data.BackButton);
            checkIfExists('languagetxt', data.LanguageText);
            checkIfExists('settingsbtn', data.SettingsButton);
            checkIfExists('ftlLanguageTxt', data.FirstTimeLoadLanguageText);
            checkIfExists('ftlcbtn-1', data.FirstTimeLoadButton1);
            checkIfExists('backbtn', data.BackButton);
            checkIfExists('backbtn2', data.BackButtonAlt);
            checkIfExists('qmghp-path', data.QMGHeaderParserPath);
            checkIfExists('fileselectbtn', data.FileSelectButton);
            checkIfExists('output', data.QMGHPOutputText);
            checkIfExists('qmgr-path', data.QMGResearchPath);
            checkIfExists('404msg', data.NotFoundErrorText)
            checkIfExists('homebtn', data.HomeButton);
            checkIfExists('403msg', data.ForbiddenErrorText)
            checkIfExists('selopt', data.SelectOptionText);
            checkIfExists('selopt2', data.SelectOptionText);
            checkIfExists('darkthmopt', data.DarkThemeOption);
            checkIfExists('lightthmopt', data.LightThemeOption);
            checkIfExists('themetxt', data.ThemeText);
            checkIfExists('ftlThemeTxt', data.FirstTimeLoadThemeText);
        })
        .catch(error => console.error('Error whilst loading lang file:', error));
}

// Dexrn: This makes sure that the element exists before setting it... otherwise it will throw an error.
function checkIfExists(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}


        function setTheme(theme) {
            var expirationDate = new Date('Fri, 31 Dec 9999 23:59:59 GMT');
            document.cookie = `Theme=${theme}; expires=${expirationDate.toUTCString()}; path=/`;            

            applyTheme(theme);
        }

        function applyTheme(theme) {
            const stylesheetElement = document.getElementById('theme');
            switch (theme) {
                case 'default-dark':
                stylesheetElement.href = 'css/default.css';
                break;
                case 'default-light':
                stylesheetElement.href = 'css/default-light.css';
                break;
                default:
                stylesheetElement.href = 'css/default.css';
                break;
            }
        }

        function getThemeCookie(name) {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [cookieName, cookieValue] = cookie.trim().split('=');
                if (cookieName === name) {
                    return cookieValue;
                }
            }
            return null;
        }

        const savedTheme = getThemeCookie('Theme');

        applyTheme(savedTheme);
        