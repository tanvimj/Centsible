// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCg9Hyp3egqKyb4YJCVHJDJcxFyYEvrroI",
  authDomain: "centsible-40125.firebaseapp.com",
  projectId: "centsible-40125",
  storageBucket: "centsible-40125.appspot.com",
  messagingSenderId: "665505386105",
  appId: "1:665505386105:web:cbaeeaf0584fde180a8ea8",
  measurementId: "G-1JVNDTB627",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const modeInput = document.getElementById("mode");
const addExpenseBtn = document.getElementById("add-expense");
const tableContainer = document.querySelector(".table-container");
const closeTableBtn = document.getElementById("close-table-btn");
const showTableBtn = document.getElementById("show-table-btn");

// Chat functionality - DOM Elements
const chatTrigger = document.getElementById('chat-trigger');
const floatingChatBtn = document.getElementById('floating-chat-btn');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

// Chat functionality - Functions
function openChat() {
  if (chatWindow) {
    chatWindow.style.display = 'flex';
    // Hide the floating elements when chat is open
    const chatCont = document.querySelector('.chat-cont');
    if (chatCont) chatCont.style.display = 'none';
    if (floatingChatBtn) floatingChatBtn.style.display = 'none';
  }
}

function closeChat() {
  if (chatWindow) {
    chatWindow.style.display = 'none';
    // Show the floating elements when chat is closed
    const chatCont = document.querySelector('.chat-cont');
    if (chatCont) chatCont.style.display = 'flex';
    if (floatingChatBtn) floatingChatBtn.style.display = 'block';
  }
}

function sendMessage() {
  if (!chatInput || !chatMessages) return;
  
  const message = chatInput.value.trim();
  if (message) {
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user';
    userMessage.textContent = message;
    chatMessages.appendChild(userMessage);

    // Clear input
    chatInput.value = '';

    // Simulate bot response
    setTimeout(() => {
      const botMessage = document.createElement('div');
      botMessage.className = 'chat-message bot';
      botMessage.textContent = 'Thanks for your message! I\'m still learning, but I\'m here to help with your financial questions.';
      chatMessages.appendChild(botMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Show table when button clicked
showTableBtn?.addEventListener("click", () => {
  tableContainer.style.display = "block";
  showTableBtn.style.display = "none";
});

// Close table when close button clicked
closeTableBtn?.addEventListener("click", () => {
  tableContainer.style.display = "none";
  showTableBtn.style.display = "inline-block";
});

// Listen for Auth State
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Logged in as:", user.email);
    await loadExpenses(user.uid);
  } else {
    window.location.href = "/LoginSignup/index.html";
  }
});
// Remove the duplicate import and replace the budget click handler with:

document.getElementById('budget')?.addEventListener('click', () => {
  // Check if user is currently authenticated
  const user = auth.currentUser;
  
  if (user) {
    // ✅ User is logged in, redirect to budget page
    window.location.href = "/BudgetPage/index.html";
  } else {
    // ❌ User is not logged in, redirect to login page
    window.location.href = "/LoginSignup/index.html";
  }
});

// Alternative approach if you want to wait for auth state to be determined:
document.getElementById('budget')?.addEventListener('click', () => {
  // Create a one-time auth state check
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // ✅ User is logged in, redirect to budget page
      window.location.href = "/BudgetPage/index.html";
    } else {
      // ❌ User is not logged in, redirect to login page
      window.location.href = "/LoginSignup/index.html";
    }
    // Unsubscribe immediately after checking
    unsubscribe();
  });
});

// Add Expense
addExpenseBtn?.addEventListener("click", async () => {
  const user = auth.currentUser;
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value.trim();
  const mode = modeInput.value.trim();

  if (!user || isNaN(amount) || !category || !mode) {
    alert("Please fill all fields correctly.");
    return;
  }

  try {
    await addDoc(collection(db, "expenses", user.uid, "records"), {
      amount,
      category,
      mode,
      date: new Date().toISOString(),
    });

    // Clear inputs
    amountInput.value = "";
    categoryInput.value = "";
    modeInput.value = "";

    await loadExpenses(user.uid); // Reload data after adding
  } catch (error) {
    console.error("Error adding expense:", error);
  }
});

// Load Expenses and setup table + charts
async function loadExpenses(uid) {
  const expensesRef = collection(db, "expenses", uid, "records");
  const q = query(expensesRef, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);

  const tableBody = document.getElementById("expenses-body");
  if (tableBody) {
    tableBody.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const docId = docSnap.id;

      const tr = document.createElement("tr");
      const formattedDate = new Date(data.date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      tr.innerHTML = `
        <td>
          <span class="category-text">${data.category}</span>
          <input class="edit-category" style="display:none" value="${data.category}">
        </td>
        <td>
          <span class="amount-text">${data.amount}</span>
          <input type="number" class="edit-amount" style="display:none" value="${data.amount}">
        </td>
        <td>
          <span class="date-text">${formattedDate}</span>
          <input type="date" class="edit-date" style="display:none" value="${data.date.slice(0, 10)}">
        </td>
        <td>
          <span class="mode-text">${data.mode || "—"}</span>
          <input class="edit-mode" style="display:none" value="${data.mode || ""}">
        </td>
        <td>
          <button class="edit-btn" data-id="${docId}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#95683c">
              <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
            </svg>
          </button>
          <button class="save-btn" data-id="${docId}" style="display:none">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#95683c">
              <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/>
            </svg>
          </button>
          <button class="delete-btn" data-id="${docId}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#95683c">
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
          </button>
        </td>
      `;

      tableBody.appendChild(tr);
    });

    // Attach event listeners for Delete buttons
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const docId = e.currentTarget.getAttribute("data-id");
        await deleteExpense(uid, docId);
      });
    });

    // Attach event listeners for Edit buttons
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const row = e.currentTarget.closest("tr");
        row.querySelectorAll("span").forEach((el) => (el.style.display = "none"));
        row.querySelectorAll("input").forEach((el) => (el.style.display = "inline"));
        row.querySelector(".edit-btn").style.display = "none";
        row.querySelector(".save-btn").style.display = "inline";
      });
    });

    // Attach event listeners for Save buttons
    document.querySelectorAll(".save-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const docId = e.currentTarget.getAttribute("data-id");
        const row = e.currentTarget.closest("tr");

        const newCategory = row.querySelector(".edit-category").value.trim();
        const newAmount = parseFloat(row.querySelector(".edit-amount").value);
        const newDate = row.querySelector(".edit-date").value;
        const newMode = row.querySelector(".edit-mode").value.trim();

        if (!newCategory || isNaN(newAmount) || !newDate || !newMode) {
          alert("Please enter valid inputs.");
          return;
        }

        try {
          const expenseRef = doc(db, "expenses", uid, "records", docId);
          await updateDoc(expenseRef, {
            category: newCategory,
            amount: newAmount,
            date: new Date(newDate).toISOString(),
            mode: newMode,
          });

          await loadExpenses(uid); // Refresh data and UI after update
        } catch (error) {
          console.error("Error updating expense:", error);
        }
      });
    });
  }

  // Prepare array for chart updates
  const expensesArray = [];
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    expensesArray.push({
      amount: data.amount,
      category: data.category,
      date: data.date,
      mode: data.mode,
    });
  });

  // Update charts with the data
  updateCharts(expensesArray);
}

// Delete Expense function
async function deleteExpense(uid, docId) {
  try {
    const expenseDoc = doc(db, "expenses", uid, "records", docId);
    await deleteDoc(expenseDoc);
    await loadExpenses(uid);
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
}

// Format number as INR currency
function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

// Generate random finance summary for display
function generateRandomFinanceSummary() {
  const income = Math.floor(Math.random() * 90000) + 10000; // ₹10k - ₹1L
  const outcome = Math.floor(Math.random() * income);
  const savings = income - outcome;

  const box1 = document.querySelector(".box1");
  const box2 = document.querySelector(".box2");
  const box3 = document.querySelector(".box3");

  if (box1) box1.textContent = `Monthly Income: ${formatINR(income)}`;
  if (box2) box2.textContent = `Monthly Outcome: ${formatINR(outcome)}`;
  if (box3) box3.textContent = `Monthly Savings: ${formatINR(savings)}`;
}

// Generate random summary on page load
generateRandomFinanceSummary();

let categoryChart = null;
let trendChart = null;

// Initialize charts once on page load
function initializeCharts() {
  const ctx1 = document.getElementById("categoryChart");
  const ctx2 = document.getElementById("trendChart");

  if (!ctx1 || !ctx2) {
    console.warn("Chart canvases not found");
    return;
  }

  // Category Doughnut Chart
  categoryChart = new Chart(ctx1.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            "#e9c46a",
            "#f4a261",
            "#e76f51",
            "#2a9d8f",
            "#264653",
            "#f72585",
            "#7209b7",
            "#560bad",
          ],
          borderWidth: 1,
          borderColor: "#deb68a",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 15,
            usePointStyle: true,
            color: "#5c492c",
          },
        },
      },
    },
  });

  // Cumulative Expenses Line Chart
  trendChart = new Chart(ctx2.getContext("2d"), {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Cumulative Spending",
          data: [],
          borderColor: "#e9c46a",
          backgroundColor: "rgba(233, 196, 106, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#e76f51",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#5c492c",
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#5c492c",
            callback: function (value) {
              return "₹" + value;
            },
          },
        },
        x: {
          ticks: { color: "#5c492c" },
        },
      },
    },
  });
}

// Update charts with new data
function updateCharts(expensesData) {
  if (!categoryChart || !trendChart) {
    console.warn("Charts not initialized");
    return;
  }

  if (!expensesData || expensesData.length === 0) {
    // No data state for charts
    categoryChart.data.labels = ["No expenses yet"];
    categoryChart.data.datasets[0].data = [1];
    categoryChart.data.datasets[0].backgroundColor = ["#faedcd"];

    trendChart.data.labels = ["Start"];
    trendChart.data.datasets[0].data = [0];
  } else {
    updateCategoryChart(expensesData);
    updateCumulativeTrendChart(expensesData);
  }

  categoryChart.update();
  trendChart.update();
}

// Update doughnut chart with category totals
function updateCategoryChart(expenses) {
  const categoryTotals = {};

  expenses.forEach((expense) => {
    const category = expense.category || "Other";
    categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
  });

  categoryChart.data.labels = Object.keys(categoryTotals);
  categoryChart.data.datasets[0].data = Object.values(categoryTotals);
  categoryChart.data.datasets[0].backgroundColor = [
    "#ccd5ae",
    "#e9edc9",
    "#e7c8a0",
    "#d4a373",
    "#e0b990",
    "#ca8f53",
    "#5c492c",
    "#d8e2dc",
  ].slice(0, Object.keys(categoryTotals).length);
}

// Update cumulative spending line chart
function updateCumulativeTrendChart(expenses) {
  // Sort expenses oldest first for cumulative calculation
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));

  const cumulativeData = [];
  const labels = [];
  let runningTotal = 0;

  // Add starting point
  if (sortedExpenses.length > 0) {
    labels.push("Start");
    cumulativeData.push(0);
  }

  sortedExpenses.forEach((expense, index) => {
    runningTotal += expense.amount;
    const expenseLabel = `${expense.category} #${index + 1}`;
    labels.push(expenseLabel);
    cumulativeData.push(runningTotal);
  });

  trendChart.data.labels = labels;
  trendChart.data.datasets[0].data = cumulativeData;
}

// Initialize charts on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeCharts();
  
  // Initialize chat event listeners after DOM is loaded
  if (chatTrigger) {
    chatTrigger.addEventListener('click', openChat);
  }
  
  if (floatingChatBtn) {
    floatingChatBtn.addEventListener('click', openChat);
  }
  
  if (chatClose) {
    chatClose.addEventListener('click', closeChat);
  }
  
  if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
  }
  
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
});

const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
  navbar.classList.toggle('show');
});