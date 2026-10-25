const ticketForm = document.getElementById("ticketForm");
const ticketTitle = document.getElementById("ticketTitle");
const ticketList = document.querySelector(".ticket-list");
const statusFilter = document.getElementById("statusFilter");
const ticketSearch = document.getElementById("ticketSearch");


function createTicketCard(issue, status = "Open", storageIndex = null) {


    const newTicket = document.createElement("article");
    newTicket.classList.add("ticket-card");
    const newTitle = document.createElement("h3");
    newTitle.textContent = issue;
    const newStatus = document.createElement("p");
    newStatus.textContent = "Status: " + status;
    newStatus.classList.add("status-text");
    newTicket.appendChild(newTitle);
    newTicket.appendChild(newStatus);

    const newDropdown = document.createElement("select");
newDropdown.classList.add("ticket-status");
newDropdown.setAttribute(
    "aria-label",
    "Update status for " + issue
);

const openOption = document.createElement("option");

openOption.value = "Open";
openOption.textContent = "Open";

newDropdown.appendChild(openOption);

const progressOption = document.createElement("option");

progressOption.value = "In Progress";
progressOption.textContent = "In Progress";

newDropdown.appendChild(progressOption);

const resolvedOption = document.createElement("option");

resolvedOption.value = "Resolved";
resolvedOption.textContent = "Resolved";

newDropdown.appendChild(resolvedOption);

newDropdown.value = status;

newTicket.appendChild(newDropdown);

const deleteButton = document.createElement("button");
deleteButton.type = "button";
deleteButton.classList.add("delete-ticket");
deleteButton.textContent = "Delete Ticket";

newTicket.appendChild(deleteButton);



    ticketList.appendChild(newTicket);


    updateTicketStats();

    filterTickets();


    if (storageIndex !== null) {
        newTicket.dataset.storageIndex = storageIndex;
    }

}

ticketForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const issue = ticketTitle.value.trim();
    if (issue === "") {
        return;
    }


    const savedTickets = JSON.parse(
        localStorage.getItem("supportTickets") || "[]"
    );
    savedTickets.push({
        issue: issue,
        status: "Open"
    });
    localStorage.setItem(
        "supportTickets",
        JSON.stringify(savedTickets)
    );
    
    ticketTitle.value = "";
    ticketTitle.focus();

    createTicketCard(issue, "Open", savedTickets.length - 1);
   

});



    ticketList.addEventListener("change", function(event) {
    if (event.target.matches(".ticket-status")) {

        const ticket = event.target.closest(".ticket-card");
        const statusText = ticket.querySelector(".status-text");
        statusText.textContent = "Status: " +event.target.value;


    updateTicketStats();

    filterTickets();


        const storageIndex = ticket.dataset.storageIndex
    if (storageIndex !== undefined) {
        const savedTickets = JSON.parse(
            localStorage.getItem("supportTickets") || "[]"
        );
        const ticketToUpdate = savedTickets[Number(storageIndex)];

        if(ticketToUpdate) {
            ticketToUpdate.status = event.target.value;
            localStorage.setItem(
                "supportTickets",
                JSON.stringify(savedTickets)
            );


        }
    
    }

    }

});

const storedTickets = JSON.parse(
    localStorage.getItem("supportTickets") || "[]"
);

storedTickets.forEach(function(ticket, index) {
    createTicketCard(ticket.issue, ticket.status, index);
});


ticketList.addEventListener("click", function(event) {

  if (event.target.matches(".delete-ticket")) {

    const ticket = event.target.closest(".ticket-card");

    const storageIndex = Number(
      ticket.dataset.storageIndex
    );

    const savedTickets = JSON.parse(
      localStorage.getItem("supportTickets") || "[]"
    );

    if (
      Number.isInteger(storageIndex) &&
      storageIndex >= 0 &&
      storageIndex < savedTickets.length
    ) {

      savedTickets.splice(storageIndex, 1);

      localStorage.setItem(
        "supportTickets",
        JSON.stringify(savedTickets)
      );

      ticket.remove();

      updateTicketStats();

      const remainingTickets =
        ticketList.querySelectorAll(
          ".ticket-card[data-storage-index]"
        );

      remainingTickets.forEach(function(card, index) {
        card.dataset.storageIndex = index;
      });

    }

  }

});



function updateTicketStats() {
  const total = ticketList.querySelectorAll(
    ".ticket-card"
  ).length;

  document.getElementById("totalTickets").textContent = total;

  const openTickets = Array.from(
    ticketList.querySelectorAll(".ticket-status")
  ).filter(function(select) {
    return select.value === "Open";
  }).length;

  document.getElementById("openTickets").textContent = openTickets;



const inProgressTickets = Array.from(
  ticketList.querySelectorAll(".ticket-status")
).filter(function(select) {
  return select.value === "In Progress";
}).length;

document.getElementById("inProgressTickets").textContent = inProgressTickets;



const resolvedTickets = Array.from(
  ticketList.querySelectorAll(".ticket-status")
).filter(function(select) {
  return select.value === "Resolved";
}).length;

document.getElementById("resolvedTickets").textContent = resolvedTickets;


}



function filterTickets() {
  const selectedStatus = statusFilter.value;

  const searchText = ticketSearch.value.toLowerCase().trim();

  const tickets = ticketList.querySelectorAll(".ticket-card");

  let visibleCount = 0;


  tickets.forEach(function(ticket) {
    const ticketStatus = ticket.querySelector(".ticket-status").value;

    const ticketTitle = ticket.querySelector("h3").textContent.toLowerCase();

    const matchesStatus =
      selectedStatus === "All" || ticketStatus === selectedStatus;

    const matchesSearch = ticketTitle.includes(searchText);

    
if (matchesStatus && matchesSearch) {
  ticket.style.display = "";
  visibleCount++;
} else {
  ticket.style.display = "none";
}

  });

const noResults = document.getElementById("noResults");

noResults.hidden = visibleCount > 0;


}



statusFilter.addEventListener("change", function() {
  filterTickets();

});

ticketSearch.addEventListener("input", function() {
  filterTickets();
});


updateTicketStats();
