let curTab;

function changeMainCard(whatToChangeTo) {

switch (whatToChangeTo) {
    // case "Steam":
    //     if (document.getElementById('steambutton').className !== 'tabbuttonclicked') {
    //     console.log("Steam");
    //     document.getElementById('dcbutton').className = 'tabbutton';
    //     document.getElementById('steambutton').className = 'tabbuttonclicked';
    //     document.getElementById('mainCard').style.display = 'none';
    //     document.getElementById('steamcard').style.display = 'block';
    //     }
    //     break;
    case "Discord":
        curTab = 1;
        if (document.getElementById('dcbutton').className !== 'tabbuttonclicked') {
        console.log("Discord");
        document.getElementById('dcbutton').className = 'tabbuttonclicked';
        // document.getElementById('steambutton').className = 'tabbutton';
        document.getElementById('abbutton').className = 'tabbutton';
        document.getElementById('mainCard').style.display = 'block';
        document.getElementById('activityCard').style.display = 'block';
        document.getElementById('aboutCard').style.display = 'block';
        document.getElementById('linksCard').style.display = 'block';
        document.getElementById('steamcard').style.display = 'none';
        document.getElementById('stuffTab').style.display = 'none';
        }
        break;
    case "About":
        curTab = 2;
        if (document.getElementById('abbutton').className !== 'tabbuttonclicked') {
            console.log("About");
            document.getElementById('abbutton').className = 'tabbuttonclicked';
            // document.getElementById('steambutton').className = 'tabbutton';
            document.getElementById('dcbutton').className = 'tabbutton';
            document.getElementById('mainCard').style.display = 'none';
            document.getElementById('activityCard').style.display = 'none';
            document.getElementById('aboutCard').style.display = 'none';
            document.getElementById('linksCard').style.display = 'none';
            document.getElementById('steamcard').style.display = 'none';
            document.getElementById('stuffTab').style.display = 'block';

            }
            break;
    default:
        break;
}}