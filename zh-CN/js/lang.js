// Language Detection
function detectUserLanguage() {
  const userLanguage = navigator.language;
  if (userLanguage === 'zh-CN') {
    return 'zh-CN';
  } else {
    return 'en-US'; // Default to English (United States)
  }
}

// Storing the Detected Language as a Cookie
function setLanguageCookie(language) {
  // Check if the cookie already exists
  if (!getLanguageFromCookie()) {
    document.cookie = `userLanguage=${language}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
  }
}

// Retrieving the User's Language Preference
function getLanguageFromCookie() {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'userLanguage') {
      return value;
    }
  }
  return null; // Cookie not found
}

// Usage:
const userLanguage = detectUserLanguage();
setLanguageCookie(userLanguage);