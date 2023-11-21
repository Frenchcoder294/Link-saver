let myLeads = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");

const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage;
    render(myLeads);
}

tabBtn.addEventListener("click", function () {
    const name = prompt("Enter a name for the URL:");
    if (name !== null) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            myLeads.push({ name, url: tabs[0].url });
            localStorage.setItem("myLeads", JSON.stringify(myLeads));
            render(myLeads);
        });
    }
});


function render(leads) {
    let listItems = "";
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                ${leads[i].name ? `<span>${leads[i].name}: </span>` : ''}
                <a target='_blank' href='${leads[i].url}' title='Click to open in a new tab'>
                    ${leads[i].url}
                </a>
                <button class="copy-btn" data-url="${leads[i].url}">Copy</button>
                <button class="delete-btn" data-index="${i}">X</button>
            </li>
        `;
    }
    ulEl.innerHTML = listItems;

    // Attach a click event listener to each copy button to copy the URL to the clipboard
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(copyButton => {
        copyButton.addEventListener('click', function () {
            const urlToCopy = this.getAttribute('data-url');
            copyToClipboard(urlToCopy);
        });
    });

    // Attach a click event listener to each delete button to delete the corresponding item
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener('click', function () {
            const indexToDelete = this.getAttribute('data-index');
            myLeads.splice(indexToDelete, 1);
            localStorage.setItem("myLeads", JSON.stringify(myLeads));
            render(myLeads);
        });
    });
}

// Function to copy text to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}


deleteBtn.addEventListener("dblclick", function () {
    localStorage.clear();
    myLeads = [];
    render(myLeads);
});

inputBtn.addEventListener("click", function () {
    const name = prompt("Enter a name for the URL:");
    if (name) {
        myLeads.push({ name, url: inputEl.value });
        inputEl.value = "";
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        render(myLeads);
    }
});
