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

// TODO: Create activities instead of only showing one at a time.

import validator from 'validator';
import langEN from "../assets/lang/en-US.json?url";
import langCN from "../assets/lang/zh-CN.json?url";

const USERID = "485504221781950465";
const pfp: HTMLImageElement = document.querySelector("#pfp")!;
const customStatus: HTMLDivElement = document.querySelector("#customStatus")!;
const onlineState: HTMLDivElement = document.querySelector("#onlineState")!;
const platforms: HTMLDivElement = document.querySelector("#platforms")!;
const bigImage: HTMLImageElement = document.querySelector("#activityImageBig")!;
const smallImage: HTMLImageElement = document.querySelector("#activityImageSmall")!;
const activityName: HTMLDivElement = document.querySelector("#activityName")!;
const smallImageAlt: HTMLImageElement = document.querySelector("#activityAlternateImageSmall")!;
const activityState: HTMLDivElement = document.querySelector("#activityState")!;
const activityDetail: HTMLDivElement = document.querySelector("#activityDetail")!;
const timeElapsed: HTMLDivElement = document.querySelector("#activityTimeElapsed")!;
var disc_platform: string[];
var disc_isOffline: boolean;
let localizedText: LocalizedText | null;

// Dexrn: This is really, really janky.
async function lanyardGetLang(): Promise<string | null> {
  const cookie = document.cookie.split(";").find(cookie => cookie.trim().startsWith("lang="));
  return cookie ? cookie.split("=")[1] ?? null : null;
}

/*
async function createActivity(lyData: LanyardAPI) {
  const {
     activities,
  } = lyData;
  console.log(activities.length);
}
*/

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
      lyonline: data.OnlineText || "Online",
      lydnd: data.DoNotDisturbText || "Do Not Disturb",
      lyidle: data.IdleText || "Idle",
      lyoffline: data.OfflineText || "Offline",
      lyunknown: data.UnknownText || "Unknown",
      lypin: data.PlatformsInUseText || "Clients:",
      lyplatm: data.PlatformMobile || "Mobile",
      lyplatd: data.PlatformDesktop || "Desktop",
      lyplatw: data.PlatformWeb || "Web",
      lytimee: data.TimeElapsedText || "Elapsed:",
      lyna: data.NoActivityText || "No Activity",
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
  } catch { }
}

async function setAvatar(lyData: LanyardAPI): Promise<void> {
    const {
        discord_user: { avatar },
    } = lyData;
    const fullUrl = `https://cdn.discordapp.com/avatars/${USERID}/${avatar}.webp?size=512`;
    pfp.src = fullUrl;
    // pfp2.src = fullUrl;
}

async function setAvatarFrame(lyData: LanyardAPI): Promise<void> {
  const {
    discord_status,
    active_on_discord_mobile,
    active_on_discord_web,
    active_on_discord_desktop,
  } = lyData;

  const statusMapping = {
    online: { color: "#3ba45d", text: localizedText!.lyonline, isOffline: false },
    dnd: { color: "#ed4245", text: localizedText!.lydnd, isOffline: false },
    idle: { color: "#faa81a", text: localizedText!.lyidle, isOffline: false },
    offline: { color: "#747e8c", text: localizedText!.lyoffline, isOffline: true },
    default: { color: "#747e8c", text: localizedText!.lyunknown, isOffline: true }
  };

  const { color, text, isOffline } = statusMapping[discord_status] || statusMapping.default;
  if (onlineState.innerText !== text) {
    onlineState.innerText = text;
    pfp.style.border = `2px solid ${color}`;
    pfp.style.boxShadow = `0 0 20px ${color}`;
    onlineState.style.cssText = `color: ${color}; opacity: ${isOffline ? 0.5 : 1};`;
    platforms.style.cssText = `color: ${color}; opacity: ${isOffline ? 0.5 : 1};`;
  }
  disc_isOffline = isOffline ?? false;

  const platformarray = [];
  if (active_on_discord_desktop) platformarray.push(localizedText!.lyplatd);
  if (active_on_discord_mobile) platformarray.push(localizedText!.lyplatm);
  if (active_on_discord_web) platformarray.push(localizedText!.lyplatw);

  disc_platform = platformarray;
  if (!disc_isOffline && platforms.innerText !== `${localizedText!.lypin}${disc_platform}`)
    platforms.innerText = `${localizedText!.lypin}${disc_platform}`;
}


async function setStatus(lyData: LanyardAPI): Promise<void> {
  const {
     discord_status, activities
  } = lyData;

  if (discord_status == "offline") {
    return;
  }

  if (activities) {
    const activityOfType4 = activities.find((m): m is LanyardActivity4 => m.type == 4);
    if (activityOfType4) {
      const { state } = activityOfType4;
      if (state) {
        if (customStatus.innerHTML !== validator.escape(state))
          customStatus.innerHTML = validator.escape(state);
      }
    }
  }

}

async function setActivityBigImage(lyData: LanyardAPI): Promise<void> {
  const {
    activities, spotify
  } = lyData;
  const mostRecent = activities.filter((m: { type: number; }) => m.type !== 4).shift();
  if (mostRecent?.emoji && !mostRecent?.assets?.large_image) {
    var ext = "webp";
    mostRecent?.emoji?.animated === true ? ext = "gif" : ext = "webp";
    bigImage.style.display = "block";
    if (bigImage.src !== `https://cdn.discordapp.com/emojis/${validator.escape(mostRecent.emoji.id)}.${ext}?quality=lossless`)
      bigImage.src = `https://cdn.discordapp.com/emojis/${validator.escape(mostRecent.emoji.id)}.${ext}?quality=lossless`;
    bigImage.title = validator.escape(mostRecent.emoji.name);
  } else if (!mostRecent?.assets?.large_image) {
    bigImage.style.display = "none";
    return;
  } else {
    const imageLink = mostRecent.assets.large_image.includes("external")
      ? `https://media.discordapp.net/external/${mostRecent.assets.large_image.split("mp:external/")[1]
      }`
      : `https://cdn.discordapp.com/app-assets/${validator.escape(mostRecent.application_id)}/${validator.escape(mostRecent.assets.large_image)}.png?quality=lossless`;
    if (mostRecent.assets.large_image.includes("spotify")) {
      bigImage.style.display = "block";
      bigImage.src = validator.escape(spotify!.album_art_url);
      bigImage.title = validator.escape(spotify!.album);
      return;
    }
    bigImage.style.display = "block";
    if (bigImage.src !== imageLink)
      bigImage.src = imageLink;
    bigImage.title = validator.escape(mostRecent.assets.large_text);
  }

}


async function setActivitySmallImage(lyData: LanyardAPI): Promise<void> {
  const {
    activities
  } = lyData;

  const mostRecent = activities.filter((m: { type: number; }) => m.type !== 4).shift();

  if (
    !mostRecent ||
    !mostRecent?.assets?.small_image ||
    mostRecent.assets.small_image.includes("spotify")
  ) {
    if (smallImage.style.display !== "none")
      smallImage.style.display = "none";
    if (smallImageAlt.style.display !== "none")
      smallImageAlt.style.display = "none";
    return;
  }

  const imageLink = mostRecent.assets.small_image.includes("external")
    ? `https://media.discordapp.net/external/${mostRecent.assets.small_image.split("mp:external/")[1]
    }`
    : `https://cdn.discordapp.com/app-assets/${mostRecent.application_id}/${mostRecent.assets.small_image}.png?size=256`;

  if (!mostRecent.assets.large_image && mostRecent.assets.small_image) {
    if (smallImageAlt.style.display !== "block")
      smallImageAlt.style.display = "block";
    if (smallImageAlt.src !== imageLink)
      smallImageAlt.src = imageLink;
    if (smallImageAlt.title !== validator.escape(mostRecent.assets.small_text))
      smallImageAlt.title = validator.escape(mostRecent.assets.small_text);
    if (smallImage.style.display !== "none")
      smallImage.style.display = "none";
  } else {
    if (smallImageAlt.style.display !== "none")
      smallImageAlt.style.display = "none";
    if (smallImage.style.display !== "block")
      smallImage.style.display = "block";
    if (smallImage.src !== imageLink)
      smallImage.src = imageLink;
    if (smallImage.title !== validator.escape(mostRecent.assets.small_text))
      smallImage.title = validator.escape(mostRecent.assets.small_text);
  }

}

async function setActivityName(lyData: LanyardAPI): Promise<void> {
  const {
    activities
  } = lyData;
  const mostRecent = activities.filter((m: { type: number; }) => m.type !== 4).shift();
  if (!mostRecent?.name) {
    activityName.innerText = localizedText!.lyna;
    return;
  }
  activityName.style.display = "block";
  activityName.innerText = validator.escape(mostRecent.name);

}
async function setActivityState(lyData: LanyardAPI): Promise<void> {
  const response = lyData;
  const activities = response.activities.filter((m) => m.type !== 4);
  if (!activities.length) {
    activityState.style.display = "none";
    return;
  }
  const mostRecent = activities.shift();
  if (!mostRecent!.state) {
    activityState.style.display = "none";
    return;
  }

  activityState.style.display = "block";
  activityState.innerText = validator.escape(mostRecent!.state) ?? "";

}

async function setTimestamp(lyData: LanyardAPI): Promise<void> {
  const response = lyData;
  const activities = response.activities.filter((m: { type: number; }) => m.type !== 4);
  const mostRecent = activities.shift();
  let created: number | undefined;
  try {
    created = mostRecent?.timestamps.start;
  } catch {
    timeElapsed.style.display = "none";
  }
  try {
    const current = new Date().getTime();
    const diff = current - created!;

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (seconds) {
      const formattime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      timeElapsed.innerText = `${localizedText!.lytimee}` + formattime;
      timeElapsed.style.display = "block";
    } else {
      timeElapsed.innerHTML = "";
      timeElapsed.style.display = "none";
    }
  } catch {
    timeElapsed.innerHTML = "";
    timeElapsed.style.display = "none";
  }

}
async function setActivityDetails(lyData: LanyardAPI): Promise<void> {
  const activities = lyData.activities.filter((m: { type: number; }) => m.type !== 4);
  if (!activities.length) {
    activityDetail.style.display = "none";
    return;
  }
  const mostRecent = activities.shift();
  if (!mostRecent!.details) {
    activityDetail.style.display = "none";
    return;
  }
  activityDetail.style.display = "block";
  activityDetail.innerText = validator.escape(mostRecent!.details) ?? "";
}

enum PID {
  EventBW,      // s <-> c
  HelloS2C,     // s --> c
  InitC2S,      // s <-- c
  HeartbeatC2S  // s <-- c
};


await actuallySetLanguage();

const ws = await new WebSocket("wss://api.lanyard.rest/socket");
ws.onmessage = async function (res)  { 
  try {
    const data = JSON.parse(res.data);
    switch (data.op) {
      // relogic style
      case PID.HelloS2C:
        ws.send(JSON.stringify({
          op: PID.InitC2S,
          d: { subscribe_to_id: USERID }
        }));
        const { hb } = data.d;
        setInterval(() => {
            ws.send(JSON.stringify({ op: PID.HeartbeatC2S }));
        }, hb);
        break;
      case PID.EventBW:
            console.log("init")
            setAvatar(data.d);
            setStatus(data.d);
            setAvatarFrame(data.d);
            setActivityBigImage(data.d);
            setActivitySmallImage(data.d);
            setActivityName(data.d);
            setActivityState(data.d);
            setActivityDetails(data.d);
            setTimestamp(data.d);
            break;
      default:
        console.log(`RECIEVED UNKNOWN PACKET! ID: ${data.d || "UNKNOWN"}`)
    }
  } catch (e) {
    console.log(`LANYARD THREW ERROR ${e}`)
  }
};


