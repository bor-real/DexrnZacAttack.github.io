// Dexrn: TODO: Make a button to show the background panorama when clicked.
function background() {
    let now = new Date();
    let hour = now.getHours();
    let bgElement = document.querySelector('.bg');
    bgElement.style.display = 'none';
    if (bgElement) {
        if (hour >= 6 && hour < 20) {
            bgElement.style.backgroundImage = "url('https://api.itzpeto.com/dexrn/day')";
        } else {
            bgElement.style.backgroundImage = "url('https://api.itzpeto.com/dexrn/night')";
        }
        const bgImage = new Image();
        bgImage.src = bgElement.style.backgroundImage.slice(5, -2);
    }
}


window.onload = background;

function showbg() {
    bgElement.style.display = 'block';
}
