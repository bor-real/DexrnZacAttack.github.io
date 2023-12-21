var DLog = false;
console.log(
  'background.js: Dexrn: I put logging in here but you\'ll have to set "DLog" to true.'
);
function DexrnsFunnyLogger(message) {
  if (DLog) {
    console.log("background.js: " + message);
  } else {
    return;
  }
}

function backgroundfade(bgload) {
  if (bgload == true) {
    DexrnsFunnyLogger("bgload is true");
    let now = new Date();
    let hour = now.getHours();
    let bgElement = document.querySelector(".bg");
    let maincontainer = document.querySelector(".contentcontainer");
    let loadingcontainer = document.querySelector(".loadingcontainer");
    if (bgElement) {
      if (hour >= 6 && hour < 20) {
        DexrnsFunnyLogger("day time");
        bgElement.style.backgroundImage =
          "url('https://api.itzpeto.com/dexrn/day')";
      } else {
        DexrnsFunnyLogger("night time");
        bgElement.style.backgroundImage =
          "url('https://api.itzpeto.com/dexrn/night')";
      }
      maincontainer.style.display = "none";
      const bgImage = new Image();
      bgImage.src = bgElement.style.backgroundImage.slice(5, -2);

      function loadingfade() {
        loadingcontainer.style.opacity = 0;
        setTimeout(() => {
          loadingcontainer.style.display = "none";
        }, 500);
      }

      bgImage.onload = function () {
        maincontainer.style.display = "block";
        loadingfade();
        const duration = 1000;
        const startTime = performance.now();
        bgElement.style.opacity = 0;

        function animate() {
          const currenttime = performance.now();
          const elapsedtime = currenttime - startTime;
          const opacity = elapsedtime / duration;
          if (opacity <= 1) {
            bgElement.style.opacity = opacity;
            requestAnimationFrame(animate);
          }
        }
        requestAnimationFrame(animate);
      };
    } else {
      console.error("background.js: No bgElement!!!");
    }
  } else {
    return;
  }
}

window.onload = backgroundfade;
