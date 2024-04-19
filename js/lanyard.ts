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

import langEN from "../assets/lang/en-US.json?url";
import langCN from "../assets/lang/zh-CN.json?url";

const API_URL = "https://api.lanyard.rest/v1";
const USERID = "485504221781950465";
const pfp: HTMLImageElement = document.querySelector("#pfp")!;
const customStatus: HTMLDivElement = document.querySelector("#customStatus")!;
const onlineState: HTMLDivElement = document.querySelector("#onlineState")!;
const platforms: HTMLDivElement = document.querySelector("#platforms")!;
const bigImage: HTMLImageElement = document.querySelector("#activityImageBig")!;
const smallImage: HTMLImageElement = document.querySelector("#activityImageSmall")!;
const name: HTMLDivElement = document.querySelector("#activityName")!;
const smallImageAlt: HTMLImageElement = document.querySelector("#activityAlternateImageSmall")!;
const state: HTMLDivElement = document.querySelector("#activityState")!;
const details: HTMLDivElement = document.querySelector("#activityDetail")!;
const elapsed: HTMLDivElement = document.querySelector("#activityTimeElapsed")!;
var disc_platform: string[];
var disc_isOffline: boolean;
let localizedText: LocalizedText;

// Dexrn: This is really, really janky.
async function lanyardGetLang(): Promise<string | null> {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "lang") {
      return value ?? null;
    }
  }
  return null;
}

async function lanyardCheckLang(lang: string | null): Promise<string> {
  let langPath: string;
  switch (lang) {
    case "zh-CN":
      langPath = langCN;
      break;
    case "en-US":
    default:
      langPath = langEN;
      break;
  }
  return langPath;
}
async function lanyardSetLang<T extends keyof LanyardLangNameMap>(langFilePath: string): Promise<LocalizedText<T> | null> {
  try {
    const response = await fetch(langFilePath);
    const data: LanyardLang<T> = await response.json();

    return {
      // Dexrn: These are the language strings.
      lyonline: data.OnlineText,
      lydnd: data.DoNotDisturbText,
      lyidle: data.IdleText,
      lyoffline: data.OfflineText,
      lyunknown: data.UnknownText,
      lypin: data.PlatformsInUseText,
      lyplatm: data.PlatformMobile,
      lyplatd: data.PlatformDesktop,
      lyplatw: data.PlatformWeb,
      lytimee: data.TimeElapsedText,
      lyna: data.NoActivityText,
    };
  } catch (error) {
    console.error("Error whilst loading lang file:", error);
    return null;
  }
}

export async function actuallySetLanguage(): Promise<void> {
  const lang = await lanyardGetLang();
  const langFilePath = await lanyardCheckLang(lang);
  try {
    localizedText = await lanyardSetLang(langFilePath);
  } catch {}
}

async function fetchResponse(userId: string): Promise<LanyardAPI> {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`);
    return await res.json(); // this is where the type would come from
  } catch (err) {
    console.error(err);
  }
}
async function setAvatar(): Promise<void> {
  const {
    data: {
      discord_user: { avatar },
    },
  } = await fetchResponse(USERID);
  const fullUrl = `https://cdn.discordapp.com/avatars/${USERID}/${avatar}.webp?size=512`;
  pfp.src = fullUrl;
  // pfp2.src = fullUrl;
}
async function setAvatarFrame(): Promise<void> {
  const {
    data: {
      discord_status,
      active_on_discord_mobile,
      active_on_discord_web,
      active_on_discord_desktop,
      // custom
    },
  } = await fetchResponse(USERID);
  // Dexrn: Jank incoming!
  switch (discord_status) {
    case "online":
      onlineState.innerText = localizedText.lyonline;
      pfp.style.border = "2px solid #3ba45d";
      pfp.style.boxShadow = "0 0 20px #3ba45d";
      onlineState.style.cssText = "color: #3ba45d; opacity: 1;";
      platforms.style.cssText = "color: #3ba45d; opacity: 1;";
      break;
    case "dnd":
      pfp.style.border = "2px solid #ed4245";
      pfp.style.boxShadow = "0 0 20px #ed4245";
      onlineState.innerText = localizedText.lydnd;
      onlineState.style.cssText = "color: #ed4245; opacity: 1;";
      platforms.style.cssText = "color: #ed4245; opacity: 1;";
      break;
    case "idle":
      onlineState.innerText = localizedText.lyidle;
      pfp.style.border = "2px solid #faa81a";
      pfp.style.boxShadow = "0 0 20px #faa81a";
      onlineState.style.cssText = "color: #faa81a; opacity: 1;";
      platforms.style.cssText = "color: #faa81a; opacity: 1;";
      break;
    case "offline":
      onlineState.innerText = localizedText.lyoffline;
      pfp.style.border = "2px solid #747e8c";
      pfp.style.boxShadow = "0 0 20px #747e8c";
      onlineState.style.cssText = "color: unset; opacity: 0.5;";
      disc_isOffline = true;
      break;
    default:
      onlineState.innerText = localizedText.lyunknown;
      pfp.style.border = "2px solid #747e8c";
      pfp.style.boxShadow = "0 0 20px #747e8c";
      onlineState.style.cssText = "color: unset; opacity: 0.5;";
      disc_isOffline = true;
  }

  const platformarray: string[] = [];

  // Dexrn: I should make it show pictures instead.
  if (active_on_discord_desktop == true) {
    platformarray.push(`${localizedText.lyplatd}`);
  }

  if (active_on_discord_mobile == true) {
    platformarray.push(`${localizedText.lyplatm}`);
  }

  if (active_on_discord_web == true) {
    platformarray.push(`${localizedText.lyplatw}`);
  }

  disc_platform = platformarray;

  if (disc_isOffline != true)
    // Dexrn: Best way I could think of doing it.
    platforms.innerText = `${localizedText.lypin}${disc_platform}`;
}


async function setStatus(): Promise<void> {
  const {
    data: { discord_status, activities },
  } = await fetchResponse(USERID);

  if (discord_status == "offline") {
    return;
  }

  if (activities) {
    const activityOfType4 = activities.find((m): m is LanyardActivity4 => m.type == 4);
    if (activityOfType4) {
      const { state } = activityOfType4;
      if (state) {
        customStatus.innerHTML = `${state}`;
      }
    }
  }
}

async function setActivityBigImage(): Promise<void> {
  const {
    data: { activities, spotify },
  } = await fetchResponse(USERID);
  const mostRecent = activities.filter((m: { type: number; }) => m.type !== 4).shift();
  if (!mostRecent?.assets?.large_image) {
    bigImage.style.display = "none";
    return;
  } else {
    const imageLink = mostRecent.assets.large_image.includes("external")
      ? `https://media.discordapp.net/external/${
          mostRecent.assets.large_image.split("mp:external/")[1]
        }`
      : `https://cdn.discordapp.com/app-assets/${mostRecent.application_id}/${mostRecent.assets.large_image}.png?size=256`;
    if (mostRecent.assets.large_image.includes("spotify")) {
      bigImage.style.display = "block";
      bigImage.src = spotify.album_art_url;
      bigImage.title = spotify.album;
      return;
    }
    bigImage.style.display = "block";
    bigImage.src = imageLink;
    bigImage.title = mostRecent.assets.large_text;
  }
}
async function setActivitySmallImage(): Promise<void> {
  const {
    data: { activities },
  } = await fetchResponse(USERID);

  const mostRecent = activities.filter((m: { type: number; }) => m.type !== 4).shift();

  if (
    !mostRecent ||
    !mostRecent?.assets?.small_image ||
    mostRecent.assets.small_image.includes("spotify")
  ) {
    smallImage.style.display = "none";
    smallImageAlt.style.display = "none";
    return;
  }

  const imageLink = mostRecent.assets.small_image.includes("external")
    ? `https://media.discordapp.net/external/${
        mostRecent.assets.small_image.split("mp:external/")[1]
      }`
    : `https://cdn.discordapp.com/app-assets/${mostRecent.application_id}/${mostRecent.assets.small_image}.png?size=256`;

  if (!mostRecent.assets.large_image && mostRecent.assets.small_image) {
    smallImageAlt.style.display = "block";
    smallImageAlt.src = imageLink;
    smallImageAlt.title = mostRecent.assets.small_text;
    smallImage.style.display = "none";
  } else {
    smallImageAlt.style.display = "none";
    smallImage.style.display = "block";
    smallImage.src = imageLink;
    smallImage.title = mostRecent.assets.small_text;
  }
}

async function setActivityName(): Promise<void> {
  const {
    data: { activities },
  } = await fetchResponse(USERID);
  const mostRecent = activities.filter((m: { type: number; }) => m.type !== 4).shift();
  if (!mostRecent?.name) {
    name.innerText = localizedText.lyna;
    return;
  }
  name.style.display = "block";
  name.innerText = mostRecent.name;
}
async function setActivityState(): Promise<void> {
  const response = await fetchResponse(USERID);
  const activities = response.data.activities.filter((m) => m.type !== 4);
  if (!activities.length) {
    state.style.display = "none";
    return;
  }
  const mostRecent = activities.shift();
  if (!mostRecent.state) {
    state.style.display = "none";
    return;
  }

  state.style.display = "block";
  state.innerText = mostRecent.state;
}

async function setTimestamp(): Promise<void> {
  const response = await fetchResponse(USERID);
  const activities = response.data.activities.filter((m: { type: number; }) => m.type !== 4);
  const mostRecent = activities.shift();
  let created: number;
  created = mostRecent?.timestamps.start;
  try {
    const current = new Date().getTime();
    const diff = current - created;

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    const formattime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    elapsed.innerText = `${localizedText.lytimee}` + formattime;
  } catch {
    elapsed.innerHTML = "";
  }
}
async function setActivityDetails(): Promise<void> {
  const response = await fetchResponse(USERID);

  const activities = response.data.activities.filter((m: { type: number; }) => m.type !== 4);
  if (!activities.length) {
    details.style.display = "none";
    return;
  }
  const mostRecent = activities.shift();
  if (!mostRecent.details) {
    details.style.display = "none";
    return;
  }
  details.style.display = "block";
  details.innerText = mostRecent.details;
}

function presenceInvoke(): void {
  setActivityBigImage();
  setActivitySmallImage();
  setActivityName();
  setActivityState();
  setActivityDetails();
}

function statusInvoke(): void {
  setStatus();
  setAvatarFrame();
}

function invoke(): void {
  setInterval(() => {
    setTimestamp();
    presenceInvoke();
    statusInvoke();
  }, 1000);
  setAvatar();
}

invoke();
actuallySetLanguage();
