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

const bgElement: HTMLDivElement = document.querySelector(".bg")!;
const loadingScreen: HTMLDivElement = document.querySelector(".loadingScreen")!;

function setBGTime(hour: number): void {
  if (hour >= 6 && hour < 20 ) {
    bgElement.style.backgroundImage =
      "url('https://dexrn.duckdns.org/panorama?time=day')";
  } else {
    bgElement.style.backgroundImage =
      "url('https://dexrn.duckdns.org/panorama?time=night')";
  } 
}

export function fadeBG(bgload: boolean | Event): void {
  if (bgload == true) {
    let now = new Date();
    let hour = now.getHours();
    if (bgElement) {
      setBGTime(hour);
      const bg = new Image();
      bg.src = bgElement.style.backgroundImage.slice(5, -2);

      const loadingfade = function() {
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 500);
      };
      
      bg.onload = function () {
        loadingfade();
      };
    } else {
      console.error("background.js: No bgElement!!!");
    }
  } else {
    return;
  }
}

window.onload = fadeBG;

