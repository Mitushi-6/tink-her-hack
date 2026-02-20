let currentPage = 0;
const pages = document.querySelectorAll(".page");

function nextPage() {
    if (currentPage < pages.length) {
        pages[currentPage].classList.add("flipped");
        currentPage++;
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        pages[currentPage].classList.remove("flipped");
    }
}