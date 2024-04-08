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

function updateSteamInfo(steamData) {
    const steamPfp = document.getElementById('steampfp');
    
    const avatar = steamData.avatar;
    const status = steamData.status;
    const badge = steamData.badge;
    const state = status.state;
    const name = steamData.username;
    const recentlyPlayed = steamData.recent_activity;
    const lastPlayed = recentlyPlayed.games[0];

    // Dexrn: I set the actual things here
    stmusername.textContent = name;
    steamPfp.src = avatar;
    lastPlayed.textContent = lastPlayed;

    switch (state) {
        case "offline":
            stmstatus.textContent = "Offline";
            stmstatus.style.cssText = "color: unset; opacity: 0.5;";
            steamPfp.style.border = "2px solid #747e8c";
            steamPfp.style.boxShadow = "0 0 20px #747e8c";
            break;
        case "online":
            stmstatus.textContent = "Online";
            stmstatus.style.cssText = "color: #3ba45d; opacity: 1;";
            steamPfp.style.border = "2px solid #3ba45d";
            steamPfp.style.boxShadow = "0 0 20px #3ba45d";
            break;
        default:
            console.log(state);
            break;
    }
  }
  
  async function fetchSteamData() {
    try {
      const response = await fetch('https://api.snaz.in/v2/steam/user-profile/76561198403988969');
      const data = await response.json();
  
      updateSteamInfo(data);
    } catch (error) {
      console.error('Error fetching Steam data:', error);
    }
  }
  
  fetchSteamData();
  
//   setInterval(fetchSteamData, 1000);