let loans = JSON.parse(localStorage.getItem("loans")) || [];
const loanForm = document.getElementById("loanForm");

const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const borrowerInput = document.getElementById("borrower");
const dueDateInput = document.getElementById("dueDate");
const genreInput = document.getElementById("genre");

const loanTableBody = document.getElementById("loanTableBody");

const totalLoansElement = document.getElementById("totalLoans");
const overdueLoansElement = document.getElementById("overdueLoans");

function validateForm() {

    let isValid = true;

    // Get input values
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const borrower = borrowerInput.value.trim();
    const dueDate = dueDateInput.value;
    const genre = genreInput.value;

    // Clear previous error messages
    document.getElementById("titleError").textContent = "";
    document.getElementById("authorError").textContent = "";
    document.getElementById("borrowerError").textContent = "";
    document.getElementById("dueDateError").textContent = "";

    // Validate title
    if (title === "") {
        document.getElementById("titleError").textContent =
            "Title is required.";

        isValid = false;
    }

    // Validate author
    if (author === "") {
        document.getElementById("authorError").textContent =
            "Author is required.";

        isValid = false;
    }

    // Validate borrower
    if (borrower === "") {
        document.getElementById("borrowerError").textContent =
            "Borrower name is required.";

        isValid = false;
    }

    // Validate due date
    if (dueDate === "") {
        document.getElementById("dueDateError").textContent =
            "Due date is required.";
if (genre === "") {
    document.getElementById("genreError").textContent =
        "Genre is required.";

    isValid = false;
}
return isValid;
    }

    return isValid;
}
function addLoan() {

    const newLoan = {
        id: Date.now(),
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        borrower: borrowerInput.value.trim(),
        dueDate: dueDateInput.value,
        genre: genreInput.value,
        returned: false
    };

    loans.push(newLoan);

    saveLoans();

    displayLoans();

    loanForm.reset();
}
function saveLoans() {

    localStorage.setItem("loans", JSON.stringify(loans));

}
function displayLoans() {

    loanTableBody.innerHTML = "";

    if (loans.length === 0) {

        loanTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    No books have been added yet.
                </td>
            </tr>
        `;

        updateSummary();
        return;
    }

    loans.forEach(function(loan) {

        let status = getStatus(loan);

        let actionButton = "";

        if (!loan.returned) {

            actionButton = `
                <button
                    class="btn btn-success btn-sm"
                    data-action="return"
                    data-id="${loan.id}">
                    Return
                </button>
            `;
        }

        loanTableBody.innerHTML += `
            <tr>
                <td>${escapeHTML(loan.title)}</td>
                <td>${escapeHTML(loan.author)}</td>
                <td>${escapeHTML(loan.borrower)}</td>
                <td>${escapeHTML(loan.dueDate)}</td>
                <td>${escapeHTML(loan.genre || "-")}</td>

                <td>
                    <span class="status-${status.toLowerCase()}">
                        ${status}
                    </span>
                </td>

                <td>
                    ${actionButton}

                    <button
                        class="btn btn-danger btn-sm"
                        data-action="delete"
                        data-id="${loan.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });

    updateSummary();
}
function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function(character) {

        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return characters[character];

    });
}
function getStatus(loan) {

    if (loan.returned) {
        return "Returned";
    }

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const todayString = `${year}-${month}-${day}`;

    if (loan.dueDate < todayString) {
        return "Overdue";
    }

    return "Borrowed";
}
function updateSummary() {

    const total = loans.filter(function(loan) {
        return !loan.returned;
    }).length;

    const overdue = loans.filter(function(loan) {
        return getStatus(loan) === "Overdue";
    }).length;

    totalLoansElement.textContent = total;

    overdueLoansElement.textContent = overdue;
}
loanTableBody.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const id = Number(button.dataset.id);

    const action = button.dataset.action;

    if (action === "return") {

        const loan = loans.find(function(item) {
            return item.id === id;
        });

        if (loan) {
            loan.returned = true;
        }

    }

    if (action === "delete") {

        loans = loans.filter(function(item) {
            return item.id !== id;
        });

    }

    saveLoans();

    displayLoans();

});
loanForm.addEventListener("submit", function(event) {

    event.preventDefault();

    if (validateForm()) {

        addLoan();

    }

});



displayLoans();