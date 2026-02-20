function openBook() {
    const home = document.getElementById("home");
    const book = document.getElementById("bookContainer");
    
    home.style.opacity = "0";
    setTimeout(() => {
        home.style.display = "none";
        book.style.display = "block";
    }, 500);
}

function closeBook() {
    location.reload(); // Simple way to reset back to the cover
}

function saveEntry() {
    const text = document.querySelector('textarea').value;
    if(text.trim() === "") {
        alert("Your journal is empty! Write something down first.");
    } else {
        alert("Thoughts saved to your memory.");
        // In a real app, you'd save to localStorage here
    }
}