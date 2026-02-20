

function nextPage() {
  if (currentFlip < flipEls.length) {
    flipEls[currentFlip].classList.add("flipped");
    currentFlip++;
    updateUI();
  }
}

function prevPage() {
  if (currentFlip > 0) {
    currentFlip--;
    flipEls[currentFlip].classList.remove("flipped");
    updateUI();
  }
}
function nextPage() {

  if (currentFlip >= flipEls.length) return;

  // flip current page
  flipEls[currentFlip].classList.add("flipped");

  currentFlip++;

  updateUI();
}

function prevPage() {

  if (currentFlip <= 0) return;

  currentFlip--;

  // unflip previous page
  flipEls[currentFlip].classList.remove("flipped");

  updateUI();
}