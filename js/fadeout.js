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

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".buttonRedirect");
  const backbutton = document.querySelector("#back");
  const background = document.querySelector(".bg");
  const topright = document.querySelector(".topright");

  function handleClick(button) {
    const delay = 350;
    const loadingScreen = document.querySelector(".loadingScreen");

    loadingScreen.style.display = "flex";
    fade(background);
    setTimeout(() => {
      const targetURL = button.getAttribute("linkto");
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

function fade(element) {
  if (element) {
    let opacity = 1;
    const duration = 300;
    const interval = 10;
    const timer = setInterval(function () {
      if (opacity <= 0) {
        clearInterval(timer);
        element.style.display = "none";
      }
      element.style.opacity = opacity;
      opacity -= 1 / (duration / interval);
    }, interval);
  }
}
