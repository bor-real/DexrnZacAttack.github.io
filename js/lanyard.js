var DLog = false;
console.log(
  'lanyard.js: Dexrn: I put logging in here but you\'ll have to set "DLog" to true.'
);
function DexrnsFunnyLogger(message) {
  if (DLog) {
    console.log("lanyard.js: " + message);
  } else {
    return;
  }
}

const API_URL = "https://api.lanyard.rest/v1";
const USERID = "485504221781950465";
const pfp = document.getElementById("pfp");
const customStatus = document.getElementById("customStatus");
const onlineState = document.getElementById("onlineState");
const platforms = document.getElementById("platforms");
const username = document.getElementById("username");
const bigImage = document.getElementById("activityImageBig");
const smallImage = document.getElementById("activityImageSmall");
const name = document.getElementById("activityName");
const smallImageAlt = document.getElementById("activityAlternateImageSmall");
const state = document.getElementById("activityState");
const details = document.getElementById("activityDetail");
const elapsed = document.getElementById("activityTimeElapsed");
// Dexrn -----
// It is currently 10:09 PM as I am writing this.
// Wanted to have more info about my Discord status on the website.
var disc_status;
var disc_platform;
var disc_isOffline;
let localizedText;

// Dexrn: This is really, really janky.
async function lanyardGetLang() {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "lang") {
      return value;
    }
  }
  return null; // Cookie not found
}

async function lanyardCheckLang(lang) {
  let langPath;
  switch (lang) {
    case "zh-CN":
      langPath = "/assets/lang/zh-CN.json";
      break;
    case "en-US":
    default:
      langPath = "/assets/lang/en-US.json";
      break;
  }
  return langPath;
}
async function lanyardSetLang(langFilePath) {
  try {
    const response = await fetch(langFilePath);
    const data = await response.json();

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
    return {};
  }
}

async function actuallySetLanguage() {
  const lang = await lanyardGetLang();
  const langFilePath = await lanyardCheckLang(lang);
  try {
    localizedText = await lanyardSetLang(langFilePath);
  } catch {}
}

DexrnsFunnyLogger("Dexrn: I hate this so I am adding debug logging here...");
DexrnsFunnyLogger("variables set");
async function fetchResponse(userId) {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}
async function setAvatar() {
  const {
    data: {
      discord_user: { avatar },
    },
  } = await fetchResponse(USERID);
  const fullUrl = `https://cdn.discordapp.com/avatars/${USERID}/${avatar}.webp?size=512`;
  pfp.src = fullUrl;
  DexrnsFunnyLogger("setAvatar");
  // pfp2.src = fullUrl;
}
async function setAvatarFrame() {
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
      DexrnsFunnyLogger("Online");
      // statusDot.style.background = "#3ba45d";
      onlineState.innerText = localizedText.lyonline;
      // statusDot.title = localizedText.lyonline;
      pfp.style.border = "2px solid #3ba45d";
      pfp.style.boxShadow = "0 0 20px #3ba45d";
      onlineState.style.cssText = "color: #3ba45d; opacity: 1;";
      platforms.style.cssText = "color: #3ba45d; opacity: 1;";
      break;
    case "dnd":
      DexrnsFunnyLogger("DND (Do not disturb)");
      // statusDot.style.background = "#ed4245";
      pfp.style.border = "2px solid #ed4245";
      pfp.style.boxShadow = "0 0 20px #ed4245";
      // statusDot.title = localizedText.lydnd;
      onlineState.innerText = localizedText.lydnd;
      onlineState.style.cssText = "color: #ed4245; opacity: 1;";
      platforms.style.cssText = "color: #ed4245; opacity: 1;";
      break;
    case "idle":
      DexrnsFunnyLogger("Idle");
      // statusDot.style.background = "#faa81a";
      // statusDot.title = localizedText.lyidle;
      onlineState.innerText = localizedText.lyidle;
      pfp.style.border = "2px solid #faa81a";
      pfp.style.boxShadow = "0 0 20px #faa81a";
      onlineState.style.cssText = "color: #faa81a; opacity: 1;";
      platforms.style.cssText = "color: #faa81a; opacity: 1;";
      break;
    case "offline":
      DexrnsFunnyLogger("Offline");
      // statusDot.style.background = "#747e8c";
      // statusDot.title = localizedText.lyoffline;
      onlineState.innerText = localizedText.lyoffline;
      pfp.style.border = "2px solid #747e8c";
      pfp.style.boxShadow = "0 0 20px #747e8c";
      onlineState.style.cssText = "color: unset; opacity: 0.5;";
      disc_isOffline = true;
      break;
    default:
      DexrnsFunnyLogger("Unknown (default)");
      // statusDot.style.background = "#747e8c";
      // statusDot.title = localizedText.lyunknown;
      onlineState.innerText = localizedText.lyunknown;
      pfp.style.border = "2px solid #747e8c";
      pfp.style.boxShadow = "0 0 20px #747e8c";
      onlineState.style.cssText = "color: unset; opacity: 0.5;";
      disc_isOffline = true;
  }

  const platformarray = [];

  // Dexrn: I should make it show pictures instead.
  if (active_on_discord_desktop == true) {
    DexrnsFunnyLogger("Platform(s): Desktop");
    platformarray.push(`${localizedText.lyplatd}`);
  }

  if (active_on_discord_mobile == true) {
    DexrnsFunnyLogger("Platform(s): Mobile");
    platformarray.push(`${localizedText.lyplatm}`);
  }

  if (active_on_discord_web == true) {
    DexrnsFunnyLogger("Platform(s): Web");
    platformarray.push(`${localizedText.lyplatw}`);
  }

  disc_platform = platformarray;

  if (disc_isOffline != true)
    // Dexrn: Best way I could think of doing it.
    platforms.innerText = `${localizedText.lypin}${disc_platform}`;
}


async function setStatus() {
  const {
    data: { discord_status, activities },
  } = await fetchResponse(USERID);

  if (discord_status == "offline") {
    return;
  }

  if (activities) {
    DexrnsFunnyLogger("activities is true");
    const activityOfType4 = activities.find((m) => m.type == 4);
    if (activityOfType4) {
      const { state } = activityOfType4;
      if (state) {
        customStatus.innerHTML = `${state}`;
      }
    }
  }
}

async function setActivityBigImage() {
  const {
    data: { activities, spotify },
  } = await fetchResponse(USERID);
  const mostRecent = activities.filter((m) => m.type !== 4).shift();
  if (!mostRecent?.assets?.large_image) {
    DexrnsFunnyLogger("No large_image");
    bigImage.style.display = "none";
    return;
  } else {
    const imageLink = mostRecent.assets.large_image.includes("external")
      ? `https://media.discordapp.net/external/${
          mostRecent.assets.large_image.split("mp:external/")[1]
        }`
      : `https://cdn.discordapp.com/app-assets/${mostRecent.application_id}/${mostRecent.assets.large_image}.png?size=256`;
    if (mostRecent.assets.large_image.includes("spotify")) {
      DexrnsFunnyLogger("spotify");
      bigImage.style.display = "block";
      bigImage.src = spotify.album_art_url;
      bigImage.title = spotify.album;
      return;
    }
    bigImage.style.display = "block";
    DexrnsFunnyLogger("large_image set");
    bigImage.src = imageLink;
    bigImage.title = mostRecent.assets.large_text;
  }
}
async function setActivitySmallImage() {
  const {
    data: { activities },
  } = await fetchResponse(USERID);

  const mostRecent = activities.filter((m) => m.type !== 4).shift();

  if (
    !mostRecent ||
    !mostRecent?.assets?.small_image ||
    mostRecent.assets.small_image.includes("spotify")
  ) {
    smallImage.style.display = "none";
    DexrnsFunnyLogger('small_image false or large_image includes "spotify"');
    // Dexrn: I was a dumbass and forgot to also not display if smallImage is false.
    smallImageAlt.style.display = "none";
    return;
  }

  DexrnsFunnyLogger("small_image true");
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
    DexrnsFunnyLogger("show small image as large.");
  } else {
    smallImageAlt.style.display = "none";
    smallImage.style.display = "block";
    smallImage.src = imageLink;
    smallImage.title = mostRecent.assets.small_text;
    DexrnsFunnyLogger("show small image on top of large image.");
  }
}

async function setActivityName() {
  const {
    data: { activities },
  } = await fetchResponse(USERID);
  const mostRecent = activities.filter((m) => m.type !== 4).shift();
  if (!mostRecent?.name) {
    DexrnsFunnyLogger("No activity name");
    name.innerText = localizedText.lyna;
    return;
  }
  DexrnsFunnyLogger("activity name set");
  name.style.display = "block";
  name.innerText = mostRecent.name;
}
async function setActivityState() {
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

async function setTimestamp() {
  const response = await fetchResponse(USERID);
  const activities = response.data.activities.filter((m) => m.type !== 4);
  const mostRecent = activities.shift();
  try {
  const created = mostRecent.timestamps.start;
  } catch {
    // stop yelling at me ;(
  }
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
    DexrnsFunnyLogger(`Start Time: ${created}`);
    DexrnsFunnyLogger(`Current Time: ${current}`);
    DexrnsFunnyLogger(`Diff (current - created): ${diff}`);
    DexrnsFunnyLogger(`Formatted Time: ${formattime}`);
  } catch {
    DexrnsFunnyLogger("No start time");
    elapsed.innerHTML = "";
  }
}
async function setActivityDetails() {
  const response = await fetchResponse(USERID);

  const activities = response.data.activities.filter((m) => m.type !== 4);
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

function presenceInvoke() {
  setActivityBigImage();
  setActivitySmallImage();
  setActivityName();
  setActivityState();
  setActivityDetails();
}

function statusInvoke() {
  setStatus();
  setAvatarFrame();
}

function invoke() {
  setInterval(() => {
    setTimestamp();
    presenceInvoke();
    statusInvoke();
  }, 1000);
  setAvatar();
}

invoke();
actuallySetLanguage();
