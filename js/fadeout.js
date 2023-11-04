// Dexrn -----
// Yes a little bit of this is AI generated as I couldn't be bothered at the moment to write and try to fix a ton of code and just wanted to get this working...
// I will hopefully clean this up sometime later.
// also I hate the way the AI does things aaaaa
// You can probably see what the AI made and what I made.

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".button");
    const backbutton = document.querySelector("#back");
    const background = document.querySelector(".bg");
    const topright = document.querySelector(".topright");

    function handleClick(button) {
        const delay = 350;
        const loadingContainer = document.querySelector('.loadingcontainer');

        loadingContainer.style.display = 'flex';
        fade(background);
        fade(topright);
        setTimeout(() => {
            const targetURL = button.getAttribute('linkto');
            window.location.href = targetURL;
        }, delay);
    }

    buttons.forEach(button => {
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
                element.style.display = 'none';
            }
            element.style.opacity = opacity;
            opacity -= 1 / (duration / interval);
        }, interval);
    }
}

