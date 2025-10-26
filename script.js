const form = document.getElementById("expense-form");
const tableBody = document.querySelector("#expense-table tbody");
const totalDisplay = document.getElementById("total");
const categoryFilter = document.getElementById("filter-category");
const dateFilter = document.getElementById("filter-date");
const resetFilter = document.getElementById("reset-filter");
const ctx = document.getElementById("expenseChart");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function updateLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function renderExpenses(filterCat = "", filterDate = "") {
  tableBody.innerHTML = "";
  let total = 0;

  const filtered = expenses.filter((exp) => {
    const matchCat = filterCat
      ? exp.category.toLowerCase().includes(filterCat.toLowerCase())
      : true;
    const matchDate = filterDate ? exp.date === filterDate : true;
    return matchCat && matchDate;
  });

  filtered.forEach((expense, index) => {
    total += parseFloat(expense.amount);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.name}</td>
      <td>₹${expense.amount}</td>
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td>
        <button class="edit-btn" onclick="editExpense(${index})">✏️</button>
        <button class="delete-btn" onclick="deleteExpense(${index})">❌</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  totalDisplay.textContent = total.toFixed(2);
  renderChart();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const expense = {
    name: document.getElementById("name").value,
    amount: document.getElementById("amount").value,
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
  };
  expenses.push(expense);
  updateLocalStorage();
  renderExpenses();
  form.reset();
});

function deleteExpense(index) {
  expenses.splice(index, 1);
  updateLocalStorage();
  renderExpenses();
}

function editExpense(index) {
  const exp = expenses[index];
  document.getElementById("name").value = exp.name;
  document.getElementById("amount").value = exp.amount;
  document.getElementById("category").value = exp.category;
  document.getElementById("date").value = exp.date;
  deleteExpense(index);
}

categoryFilter.addEventListener("input", () => {
  renderExpenses(categoryFilter.value, dateFilter.value);
});

dateFilter.addEventListener("change", () => {
  renderExpenses(categoryFilter.value, dateFilter.value);
});

resetFilter.addEventListener("click", () => {
  categoryFilter.value = "";
  dateFilter.value = "";
  renderExpenses();
});

let chartInstance;
function renderChart() {
  const categoryTotals = {};

  expenses.forEach((exp) => {
    categoryTotals[exp.category] =
      (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
  });

  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: [
            "#60a5fa",
            "#a5b4fc",
            "#facc15",
            "#34d399",
            "#f87171",
            "#c084fc",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
}

renderExpenses();


