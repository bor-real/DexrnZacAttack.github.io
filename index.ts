// These imports are here because they use side-effects, rather than
// import-based function calls. Ideally modules don't add side-effects, rather
// they can export functionality that can be called from the module that imports it.

import "./js/settings.js"; // sets theme and lang
import "./js/lanyard.js"; // lanyard setup
import "./js/modules/msgbox.js"; // unused? not used yet, at least
import "./js/modules/common.js"; // common setup
// import "./js/steam.js"; // unused
import "./js/background.js"; // this sets an 'onload' handler
import "./js/fadeout.js"; // this sets a 'DOMContentLoaded' handler
import "./js/expandable.js"; // component setup

doubleImportTest(new URL(import.meta.url).href);

import { fadeBG } from "./js/background.js";
import { actuallySetLanguage } from "./js/lanyard.js";
import {
  Theme,
  checkLang,
  getLang,
  getThemeCookie,
  getTranslation,
  setTheme,
} from "./js/settings.js";
import { curTab, setCurTab } from "./js/tabs.js";
import { setVer } from "./js/ver.js";
import { fetchBlogList } from "./js/blog.js";
import { parse } from "marked";
import { v1 } from "uuid";
import { parseString, getAllElements, GetType, doubleImportTest } from "./js/modules/common.js";

function init() {
  // thx actuallyaridan
  showLoadingText();
  fadeBG(true);
  // this may still be broken on Webkit, hopefully not though... Thanks, Apple.
  actuallySetLanguage();
  checkLang();
}

init();
var activityCard: HTMLElement = document.querySelector("#activityCard")!;
var aboutCard: HTMLElement = document.querySelector("#aboutCard")!;
var linksCard: HTMLElement = document.querySelector("#linksCard")!;
var abm: HTMLElement = document.querySelector("#blogCard")!;
var toggleButton: HTMLElement = document.getElementById("settingsbtn")!;
var settingsPage: HTMLElement = document.getElementById("settings")!;
var tabContainer: HTMLElement = document.getElementById("mainCardsContainer")!;
var activityCard: HTMLElement = document.querySelector("#activityCard")!;
var closesettingsbtn: HTMLElement = document.getElementById("settingsclose")!;
var tabContainer: HTMLElement = document.getElementById("mainCardsContainer")!;
var savebtn: HTMLElement = document.getElementById("savebtn")!;

settingsPage.style.display = "none";

closesettingsbtn.addEventListener("click", function () {
  setCurTab((previous) => previous);
  tabContainer.style.display = "block";
  console.log("init curTab: " + curTab);
  if (curTab === 1) {
    console.log(1);
    activityCard.style.display = "block";
    aboutCard.style.display = "block";
    linksCard.style.display = "block";
  } else if (curTab === 2) {
    console.log(2);
    abm.style.display = "block";
  }
  toggleButton.style.display = "block";
  settingsPage.style.display = "none";
});
savebtn.addEventListener("click", function () {
  setCurTab((previous) => previous);
  tabContainer.style.display = "block";
  console.log("init curTab: " + curTab);
  if (curTab === 1) {
    console.log(1);
    activityCard.style.display = "block";
    aboutCard.style.display = "block";
    linksCard.style.display = "block";
  } else if (curTab === 2) {
    console.log(2);
    abm.style.display = "block";
  }
  toggleButton.style.display = "block";
  settingsPage.style.display = "none";
});
settingsPage.style.display = "none";

toggleButton.addEventListener("click", function () {
  tabContainer.style.display = "none";
  activityCard.style.display = "none";
  aboutCard.style.display = "none";
  linksCard.style.display = "none";
  abm.style.display = "none";
  toggleButton.style.display = "none";
  settingsPage.style.display = "block";
});

setCurTab(1);

// Dexrn: This is for the text that shows on the loading screen.
async function showLoadingText(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  var loadingText = document.querySelector(".loadingtext");
  if (loadingText) {
    loadingText.classList.remove("hidden");
  }
}

document.getElementById("savebtn")!.addEventListener("click", function () {
  var selectedLanguage = (
    document.getElementById("language2") as HTMLInputElement
  ).value;
  var selectedTheme: Theme = (
    document.getElementById("themeoption") as HTMLSelectElement
  ).value as Theme;
  if (selectedLanguage !== getLang() && selectedLanguage !== "unselected") {
    var expires = new Date("Fri, 31 Dec 9999 23:59:59 GMT").toUTCString();
    document.cookie =
      "lang=" + selectedLanguage + "; expires=" + expires + "; path=/";
    actuallySetLanguage();
    checkLang();
  } else {
  }
  if (
    selectedTheme !== getThemeCookie("Theme") &&
    selectedTheme !== "unselectedtheme"
  ) {
    setTheme(selectedTheme);
  } else {
  }
});

setVer("default");

async function popBlogTab() {
    document.querySelectorAll("#blogPostPreview").forEach(element => {
        element.remove()
    });
    const blogTabBody = document.querySelector("#blogCard")!;
    blogTabBody.innerHTML = "";
    const loadingText = document.createElement("h1");
    loadingText.innerText = await getTranslation("UniversalLoading");
    loadingText.className = "postTitle";
    blogTabBody.appendChild(loadingText);
    const blogs = await fetchBlogList();
    blogs.forEach(blog => {
        if ((blog.hidden) !== true) {
            const blogElement = document.createElement("div");
            blogElement.id = `blog_${blog.timestamp}`;
            blogElement.className = "blogPostPreview";
            const blogTitle = document.createElement("h1");
            blogTitle.innerText = blog.title;
            blogTitle.className = "blogTitlePreview";
            const blogDate = document.createElement("p");
            blogDate.innerText = Intl.DateTimeFormat('en-US', {"timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone, "hour12": true, "hour": "numeric", "minute": "numeric", "second": "numeric", "day": "numeric", "month": "numeric", "year": "numeric"}).format(blog.timestamp);
            blogDate.className = "blogDate";
            blogElement.appendChild(blogTitle);
            blogElement.appendChild(blogDate);
            blogTabBody.appendChild(blogElement);
            blogTabBody.appendChild(document.createElement("br"));
            blogElement.addEventListener('click', async function() {
                await viewBlog(blog.title, blog.body);
            });
        }
    });
    if (document.querySelectorAll(".blogPostPreview").length == 0) {
        loadingText.innerText = await getTranslation("BlogNoPosts");
    } else {
        loadingText.remove();
    }
}

interface elementVisibility {
    element: HTMLElement,
    visibility: string
}

async function viewBlog(title: string, content: string) {

    // random UUID
    const randomUUID = v1();

    // create elements
    const backBar = document.createElement("div");
    const backBarBtn = document.createElement("div");
    const blogPage = document.createElement("div");
    const body = document.createElement("div");
    const postTitle = document.createElement("h1");

    // set IDs
    backBar.id = `blogPage_backBar_${randomUUID}`;
    backBarBtn.id = `blogPage_backBarBtn_${randomUUID}`;
    blogPage.id = `blogPage_${randomUUID}`;
    body.id = `blogPage_body_${randomUUID}`;
    postTitle.id = `blogPage_postTitle_${randomUUID}`;

    // set classes
    backBarBtn.className = `back`;
    backBar.className = `topcard`;
    blogPage.className = `card`;
    body.className = `postBody`;
    postTitle.className = `postTitle`;

    // format the markdown and set text
    body.innerHTML = await parse(parseString(JSON.stringify(content)).slice(1,-1));
    postTitle.innerText = title;

    // set width
    blogPage.style.width = "70%";
    backBar.style.width = "70%";

    // set onclick
    const allVisibleElements = getAllElements(GetType.visible);
    let elements: elementVisibility[] = [];
    backBar.addEventListener('click', function() {
        elements.forEach(element => {
            if (!["homepage"].includes(element.element.id) && !["body", "head", "html"].includes(element.element.tagName.toLowerCase()))
                backBar.remove();
                blogPage.remove();
                backBarBtn.remove();
                body.remove();
                postTitle.remove();
                element.element.style.display = element.visibility;
        });
    });

    // set backBarBtn text and some styling stuffs
    backBarBtn.innerText = await getTranslation("BackButton");
    backBarBtn.style.cursor = "pointer";
    backBar.style.marginTop = "20px";

    // appendChild
    backBar.appendChild(backBarBtn);
    blogPage.appendChild(postTitle);
    blogPage.appendChild(body);

    // hide all visible elements
    allVisibleElements.forEach(element => {
        elements.push({element: element, visibility: element.style.display});
        if (!["homepage"].includes(element.id) && !["body", "head", "html"].includes(element.tagName.toLowerCase()))
            element.style.display = "none";
    });

    // show the blog
    document.querySelector("#homepage")!.appendChild(backBar);
    document.querySelector("#homepage")!.appendChild(blogPage);
}

document.querySelector('#bbutton')!.addEventListener('click', await popBlogTab);
