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