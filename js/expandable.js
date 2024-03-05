let expandcards

function expandCard() {
    expandcards = document.querySelectorAll('.expandcard');
 
    expandcards.forEach(function (expandcard) {
       expandcard.addEventListener('click', function () {
          this.classList.toggle('active');
       });
    });
}

setTimeout(expandCard, 1000);