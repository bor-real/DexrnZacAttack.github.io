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
        // document.getElementById('steambutton').className = 'tabbutton';
        document.getElementById('abbutton').className = 'tabbutton';
        document.getElementById('normalmode').style.display = 'block';
        document.getElementById('normalmode1').style.display = 'block';
        document.getElementById('normalmode2').style.display = 'block';
        document.getElementById('normalmode3').style.display = 'block';
        document.getElementById('steamcard').style.display = 'none';
        document.getElementById('abmcard').style.display = 'none';
        }
        break;
    case "About":
        if (document.getElementById('abbutton').className !== 'tabbuttonclicked') {
            console.log("Discord");
            document.getElementById('abbutton').className = 'tabbuttonclicked';
            // document.getElementById('steambutton').className = 'tabbutton';
            document.getElementById('dcbutton').className = 'tabbutton';
            document.getElementById('normalmode').style.display = 'none';
            document.getElementById('normalmode1').style.display = 'none';
            document.getElementById('normalmode2').style.display = 'none';
            document.getElementById('normalmode3').style.display = 'none';
            document.getElementById('steamcard').style.display = 'none';
            document.getElementById('abmcard').style.display = 'block';

            }
            break;
    default:
        break;
}}