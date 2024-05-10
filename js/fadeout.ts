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

// Dexrn -----
// Yes a little bit of this is AI generated as I couldn't be bothered at the moment to write and try to fix a ton of code and just wanted to get this working...
// I will hopefully clean this up sometime later.
// also I hate the way the AI does things aaaaa
// You can probably see what the AI made and what I made.

const backbutton: HTMLDivElement = document.querySelector("#back")!;
export const loadingScreen: HTMLDivElement = document.querySelector(".loadingScreen")!;

document.addEventListener("DOMContentLoaded", function () {
  const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".buttonRedirect");

  function handleClick(button: HTMLButtonElement | HTMLDivElement): void {
    const delay = 350;

    loadingScreen.style.display = "flex";
    unFade(loadingScreen);
    setTimeout(() => {
      const targetURL: string = button.getAttribute("linkto")!;
      window.location.href = targetURL;
    }, delay);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      handleClick(button);
    });
  });

  if (backbutton) {
    backbutton.addEventListener("click", () => {
      handleClick(backbutton);
    });
  }
});

window.addEventListener('pageshow', function(event) {
  var hist = event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
  if (hist) {
    fade(loadingScreen);
  }
});

function fade(element: HTMLDivElement): void {
  if (element) {
    let opacity: number = 1;
    const duration: number = 20;
    /** how much to fade per call */
    const interval: number = 2;
    const timer = setInterval(function () {
      if (opacity <= 0) {
        clearInterval(timer);
        element.style.display = "none";
      }
      element.style.opacity = `${opacity}`;
      opacity -= 1 / (duration / interval);
    }, interval);
  }
}

export function unFade(element: HTMLDivElement) {
  if (element) {
      let opacity = 0;
      const duration = 20;
      const interval = 2;
      element.style.display = "flex"; 
      loadingScreen.style.pointerEvents = "none"; 
      const timer = setInterval(function () {
          if (opacity >= 1) {
            loadingScreen.style.display = "flex"; 
              clearInterval(timer);
          }
          element.style.opacity = `${opacity}`;
          opacity += 1 / (duration / interval);
      }, interval);
  }
}
