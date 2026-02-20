// ===================== State Management =====================
let users = JSON.parse(localStorage.getItem('journalUsers')) || {};
let currentUser = null;
let currentPage = 0;
const totalPages = 3; // Cover + 3 pages

// ===================== Page Navigation =====================
function showPage(pageName) {
  const loginPage = document.getElementById('loginPage');
  const homePage = document.getElementById('homePage');

  if (pageName === 'login') {
    loginPage.classList.add('active');
    homePage.classList.remove('active');
  } else if (pageName === 'home') {
    loginPage.classList.remove('active');
    homePage.classList.add('active');
  }
}

// ===================== Login Functionality =====================
function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Please enter both username and password');
    return;
  }

  // Check if user exists
  if (users[username]) {
    // Verify password
    if (users[username].password === password) {
      currentUser = username;
      document.getElementById('welcomeText').textContent = `Welcome back, ${username}!`;
      loadUserEntry();
      showPage('home');
      document.getElementById('loginForm').reset();
    } else {
      alert('Incorrect password');
    }
  } else {
    // Create new user
    users[username] = {
      password: password,
      entries: {}
    };
    localStorage.setItem('journalUsers', JSON.stringify(users));
    currentUser = username;
    document.getElementById('welcomeText').textContent = `Welcome, ${username}!`;
    initializeNewEntry();
    showPage('home');
    document.getElementById('loginForm').reset();
  }
}

// ===================== Logout Functionality =====================
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    saveEntry(); // Save before logout
    currentUser = null;
    currentPage = 0;
    resetBook();
    showPage('login');
  }
}

// ===================== Entry Management =====================
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function initializeNewEntry() {
  const today = getTodayDate();
  if (!users[currentUser].entries[today]) {
    users[currentUser].entries[today] = {
      entry0: '',
      entry1: '',
      entry2: '',
      entry3: '',
      entry4: '',
      entry5: ''
    };
    localStorage.setItem('journalUsers', JSON.stringify(users));
  }
  updateEntryDisplay();
}

function loadUserEntry() {
  const today = getTodayDate();
  if (!users[currentUser].entries[today]) {
    initializeNewEntry();
  } else {
    updateEntryDisplay();
  }
  updateDateDisplay();
}

function updateEntryDisplay() {
  const today = getTodayDate();
  const entries = users[currentUser].entries[today];

  for (let i = 0; i < 6; i++) {
    const textarea = document.getElementById(`entry${i}`);
    if (textarea) {
      textarea.value = entries[`entry${i}`] || '';
    }
  }
}

function saveEntry() {
  if (!currentUser) return;

  const today = getTodayDate();
  if (!users[currentUser].entries[today]) {
    initializeNewEntry();
  }

  for (let i = 0; i < 6; i++) {
    const textarea = document.getElementById(`entry${i}`);
    if (textarea) {
      users[currentUser].entries[today][`entry${i}`] = textarea.value;
    }
  }

  localStorage.setItem('journalUsers', JSON.stringify(users));
  showNotification('Entry saved successfully!');
}

function updateDateDisplay() {
  const today = getTodayDate();
  const dateObj = new Date(today);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString('en-US', options);
  document.getElementById('entryDate').textContent = formattedDate;
}

// ===================== Book Navigation =====================
function nextPage() {
  const pages = document.querySelectorAll('.page');
  
  if (currentPage < pages.length - 1) {
    pages[currentPage].classList.add('flipped');
    currentPage++;
  }
  
  updatePageUI();
}

function prevPage() {
  const pages = document.querySelectorAll('.page');
  
  if (currentPage > 0) {
    currentPage--;
    pages[currentPage].classList.remove('flipped');
  }
  
  updatePageUI();
}

function updatePageUI() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageCounter = document.getElementById('pageCounter');

  // Update button states
  if (currentPage === 0) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }

  if (currentPage >= document.querySelectorAll('.page').length - 1) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }

  // Update page counter
  pageCounter.textContent = `Page ${currentPage}`;
}

function resetBook() {
  currentPage = 0;
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('flipped'));

  // Clear textareas
  for (let i = 0; i < 6; i++) {
    const textarea = document.getElementById(`entry${i}`);
    if (textarea) {
      textarea.value = '';
    }
  }

  updatePageUI();
}

// ===================== Notifications =====================
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #228b22 0%, #1a6b1a 100%);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(34, 139, 34, 0.4);
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// ===================== Initialization =====================
document.addEventListener('DOMContentLoaded', function() {
  showPage('login');
  updatePageUI();
});

// Auto-save every 30 seconds
setInterval(() => {
  if (currentUser) {
    saveEntry();
  }
}, 30000);