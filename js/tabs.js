function changeMainCard(whatToChangeTo) {

switch (whatToChangeTo) {
    // case "Steam":
    //     if (document.getElementById('steambutton').className !== 'tabbuttonclicked') {
    //     console.log("Steam");
    //     document.getElementById('dcbutton').className = 'tabbutton';
    //     document.getElementById('steambutton').className = 'tabbuttonclicked';
    //     document.getElementById('normalmode').style.display = 'none';
    //     document.getElementById('steamcard').style.display = 'block';
    //     }
    //     break;
    case "Discord":
        if (document.getElementById('dcbutton').className !== 'tabbuttonclicked') {
        console.log("Discord");
        document.getElementById('dcbutton').className = 'tabbuttonclicked';
        document.getElementById('steambutton').className = 'tabbutton';
        document.getElementById('normalmode').style.display = 'block';
        document.getElementById('steamcard').style.display = 'none';
        }
        break;
    default:
        break;
}}