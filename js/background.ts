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

var DLog = false;
console.log(
  'background.js: Dexrn: I put logging in here but you\'ll have to set "DLog" to true.'
);
/**
 * @param {string} message
 * @returns {void}
 */
function DexrnsFunnyLogger(message) {
  if (DLog) {
    console.log("background.js: " + message);
  } else {
    return;
  }
}

/**
 * @param {number} hour
 * @returns {void}
 */
function setBGTime(hour) {
  /** @type {HTMLDivElement} */
  let bgElement = document.querySelector(".bg");
  if (hour >= 6 && hour < 20 ) {
    DexrnsFunnyLogger("day time");
    bgElement.style.backgroundImage =
      "url('https://api.itzpeto.com/dexrn/day')";
  } else {
    DexrnsFunnyLogger("night time");
    bgElement.style.backgroundImage =
      "url('https://api.itzpeto.com/dexrn/night')";
  } 
}

/**
 * @param {boolean | Event} bgload
 * @returns {void}
 */
export function fadeBG(bgload) {
  if (bgload == true) {
    DexrnsFunnyLogger("bgload is true");
    let now = new Date();
    let hour = now.getHours();
    /** @type {HTMLDivElement} */
    let bgElement = document.querySelector(".bg");
    /** @type {HTMLDivElement} */
    let maincontainer = document.querySelector(".mainContent");
    /** @type {HTMLDivElement} */
    let loadingScreen = document.querySelector(".loadingScreen");
    if (bgElement) {
      setBGTime(hour);
      maincontainer.style.display = "none";
      const bg = new Image();
      bg.src = bgElement.style.backgroundImage.slice(5, -2);

      const loadingfade = function() {
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 500);
      };
      
      bg.onload = function () {
        maincontainer.style.display = "block";
        loadingfade();
        const duration = 1000;
        const startTime = performance.now();
        bgElement.style.opacity = "0";

        function animate() {
          const currenttime = performance.now();
          const elapsedtime = currenttime - startTime;
          const opacity = elapsedtime / duration;
          if (opacity <= 1) {
            bgElement.style.opacity = `${opacity}`;
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

window.onload = fadeBG;

