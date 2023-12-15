function setLanguageCookie(language) {
  // Check if the cookie already exists
  if (!getLanguageFromCookie()) {
    document.cookie = `lang=${language}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
  }
}

// Retrieving the User's Language Preference
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
