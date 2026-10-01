let items = JSON.parse(localStorage.getItem("campusItems")) || [];

displayItems();


function addItem() {

    let name = document.getElementById("itemName").value;
    let studentName = document.getElementById("studentName").value;
    let contact = document.getElementById("contact").value;
    let type = document.getElementById("itemType").value;
    let location = document.getElementById("location").value;
    let description = document.getElementById("description").value;

    let imageFile = document.getElementById("itemImage").files[0];

    if (
        name === "" ||
        studentName === "" ||
        contact === "" ||
        location === "" ||
        description===""
    ) {
        alert("Please fill all required details.");
        return;
    }


    // If user selected an image
    if (imageFile) {

        let reader = new FileReader();

        reader.onload = function(event) {

            saveItem(
                name,
                studentName,
                contact,
                type,
                location,
                description,
                event.target.result
            );

        };

        reader.readAsDataURL(imageFile);

    } else {

        saveItem(
            name,
            studentName,
            contact,
            type,
            location,
            description,
            ""
        );
    }
}


function saveItem(
    name,
    studentName,
    contact,
    type,
    location,
    description,
    image
) {

    let item = {

        name: name,
        studentName: studentName,
        contact: contact,
        type: type,
        location: location,
        description: description,
        image: image,
        date: new Date().toLocaleString(),
        status:"Active"

    };


    items.push(item);

    localStorage.setItem(
        "campusItems",
        JSON.stringify(items)
    );


    displayItems();


    // Clear form

    document.getElementById("itemName").value = "";

    document.getElementById("studentName").value = "";

    document.getElementById("contact").value = "";

    document.getElementById("location").value = "";

    document.getElementById("description").value = "";

    document.getElementById("itemImage").value = "";
}


function displayItems() {

    let itemList = document.getElementById("itemList");

    itemList.innerHTML = "";
    let visibleItems = 0;


    items.forEach(function(item, index) {

    // Claimed items active reports mein nahi dikhenge
    if (item.status === "Claimed") {
        return;
    }
    visibleItems++;

        let card = document.createElement("div");

        card.className = "card";

        card.setAttribute(
            "data-type",
            item.type
        );

        card.setAttribute(
            "data-name",
            item.name.toLowerCase()
        );


        card.innerHTML = `

           <h3>${item.name}</h3>

<span class="item-badge ${item.type.toLowerCase()}">
    ${item.type}
</span>

            ${
                item.image
                ? `<img src="${item.image}" 
                     style="width:150px; border-radius:8px;">`
                : ""
            }

            <p>
                <b>Reported by:</b>
                ${item.studentName || "Unknown"}
            </p>

            <p>
    <b>Contact:</b>
    ${item.contact || "Not provided"}
</p>

${
    item.contact
    ? `<button onclick="contactOwner('${item.contact}')">
        Contact Owner
       </button>`
    : ""
}
            <p>
                <b>Location:</b>
                ${item.location}
            </p>

            <p>
                <b>Description:</b>
                ${item.description}
            </p>

            <p>
                <b>Reported on:</b>
                ${item.date || "Earlier report"}
            </p>

            <button onclick="markClaimed(${index})">
                Mark as Claimed
            </button>

        `;


        itemList.appendChild(card);

    });


    filterItems();
}


function markClaimed(index) {

    items[index].status = "Claimed";

    localStorage.setItem(
        "campusItems",
        JSON.stringify(items)
    );

    displayItems();
}



    
       function filterItems() {

    let searchText =
        document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    let filterType =
        document
        .getElementById("filterType")
        .value;

    let cards =
        document.querySelectorAll(".card");

    let visibleCount = 0;


    cards.forEach(function(card) {

        let name =
            card.getAttribute("data-name");

        let type =
            card.getAttribute("data-type");


        let matchesSearch =
            name.includes(searchText);

        let matchesType =
            filterType === "All" ||
            type === filterType;


        if (matchesSearch && matchesType) {

            card.style.display = "block";
            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    let noResults =
        document.querySelector(".no-results");


    if (visibleCount === 0 && cards.length > 0) {

        if (!noResults) {

            let message =
                document.createElement("div");

            message.className = "no-results";

            message.innerHTML = `
                <h3>No reports found</h3>
                <p>Try searching for another item.</p>
            `;

            document
                .getElementById("itemList")
                .appendChild(message);
        }

    } else {

        if (noResults) {
            noResults.remove();
        }

    }

}


document
    .getElementById("searchBox")
    .addEventListener(
        "input",
        filterItems
    );
    function updateDashboard() {

    let total = items.length;

    let lost = items.filter(function(item) {
        return item.type === "Lost" && item.status !== "Claimed";
    }).length;

    let found = items.filter(function(item) {
        return item.type === "Found" && item.status !== "Claimed";
    }).length;

    let claimed = items.filter(function(item) {
        return item.status === "Claimed";
    }).length;


    document.getElementById("totalCount").textContent = total;

    document.getElementById("lostCount").textContent = lost;

    document.getElementById("foundCount").textContent = found;

    document.getElementById("claimedCount").textContent = claimed;
}
updateDashboard();
if (visibleItems === 0) {

    itemList.innerHTML = `
        <div class="no-results">
            <h3>No reports found</h3>
            <p>Try searching for another item.</p>
        </div>
    `;

}
function contactOwner(contact) {

    alert(
        "Please contact the owner using: " + contact
    );

}