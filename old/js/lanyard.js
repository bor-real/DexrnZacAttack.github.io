function updateContent(data) {
    const pfp = document.getElementById('pfp');
    const statusDot = document.getElementById('status-dot');
    const status2 = document.getElementById('status2');
    const status3 = document.getElementById('status3');
    const username = document.getElementById('username');
    const bigImage = document.getElementById('activity-big-image');
    const smallImage = document.getElementById('activity-small-image');
    const name = document.getElementById('activity-name');
    const state = document.getElementById('activity-state');
    const details = document.getElementById('activity-detail');

    const { discord_status, discord_user, activities } = data;

    if (discord_user) {
        const avatarurl = `https://cdn.discordapp.com/avatars/485504221781950465/${discord_user.avatar}.webp?size=512`;
        pfp.src = avatarurl;
        username.textContent = discord_user.username;
    }

    switch (discord_status) {
        case 'online':
            statusDot.style.background = '#3ba45d';
            status2.innerHTML = 'Online';
            status2.style.cssText = 'color: #3ba45d; opacity: 1;';
            status3.style.cssText = 'color: #3ba45d; opacity: 1;';
            break;
        case 'dnd':
            statusDot.style.background = '#ed4245';
            status2.innerHTML = 'Do not disturb';
            status2.style.cssText = 'color: #ed4245; opacity: 1;';
            status3.style.cssText = 'color: #ed4245; opacity: 1;';
            break;
        case 'idle':
            statusDot.style.background = '#faa81a';
            status2.innerHTML = 'Idle';
            status2.style.cssText = 'color: #faa81a; opacity: 1;';
            status3.style.cssText = 'color: #faa81a; opacity: 1;';
            break;
        case 'offline':
            statusDot.style.background = '#747e8c';
            statusDot.title = 'Offline';
            status2.innerHTML = 'Offline';
            status2.style.cssText = 'color: unset; opacity: 0.5;';
            break;
    }

    if (activities && activities.length > 0) {
        const mostRecent = activities[0];
        name.innerHTML = mostRecent.name || 'No activity';
        state.innerHTML = mostRecent.state || '';
        details.innerHTML = mostRecent.details || '';
        // Dexrn: Will enable this if I ever get the images working well...
    //     if (mostRecent.assets) {
    //         const bigimage = mostRecent.assets.large_image || '';
    //         const smallimage = mostRecent.assets.small_image || '';
    //         // Dexrn: I don't know how to use mp:external, so let's just extract the URL from it.
    //         function fixmpexternal(mpExternalURL) {
    //             const match = /mp:external\/(.*?)\/(.*)/.exec(mpExternalURL);
    //             if (match) {
    //                 return match[2];
    //             }
    //             return '';
    //         }
    //         const bigimagenomp = fixmpexternal(bigimage);
    //         const smallimagenomp = fixmpexternal(smallimage);
    //         const realbigimage = bigimagenomp.replace("https/", "https://");
    //         const realsmallimage = smallimagenomp.replace("https/", "https://");
    //         bigImage.src = realbigimage;
    //         // smallImage.src = realsmallimage;
    //     }
    } else {
        name.innerHTML = 'No Activity.';
        state.innerHTML = null;
        details.innerHTML = null;
        bigImage.src = null;
    }
}

fetch('https://api.lanyard.rest/v1/users/485504221781950465')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateContent(data.data);
        } else {
            console.error(`Lanyard API request failed, maybe it's down?`);
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

updateContent();
