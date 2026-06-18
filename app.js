const shoppers = [
  {
    name: "Maya Chen",
    initials: "MC",
    rating: "4.98",
    eta: "6 min",
    fee: "$32",
    copy: "Luxury gifting, boutique sourcing, and careful same-day delivery for client-facing requests.",
    tags: ["Gifts", "Fashion", "Same day"]
  },
  {
    name: "Andre Lewis",
    initials: "AL",
    rating: "4.94",
    eta: "11 min",
    fee: "$27",
    copy: "Fast local errands, business supply runs, and clear photo approvals before purchase.",
    tags: ["Business", "Errands", "Delivery"]
  },
  {
    name: "Priya Shah",
    initials: "PS",
    rating: "5.00",
    eta: "14 min",
    fee: "$38",
    copy: "Personal styling, accessories, event shopping, and hard-to-find product searches.",
    tags: ["Styling", "Events", "Premium"]
  }
];

const categoryProfiles = {
  "Fashion and accessories": {
    title: "Style sourcing plus delivery",
    copy: "A verified shopper can pull options by size, style, budget, and occasion before confirming the best purchase.",
    fee: "$28-$46"
  },
  "Gifts and special occasions": {
    title: "Gift sourcing plus delivery",
    copy: "A concierge will compare options, confirm the purchase, and coordinate delivery updates in one tracked request.",
    fee: "$24-$38"
  },
  "Business supplies": {
    title: "Business errand support",
    copy: "Roomwork can handle office supply pickups, client gifts, event needs, and recurring business shopping tasks.",
    fee: "$18-$34"
  },
  "Home and lifestyle": {
    title: "Home shopping assistance",
    copy: "Get help comparing quality, availability, and delivery timing for home, lifestyle, and everyday items.",
    fee: "$22-$40"
  },
  "Special request": {
    title: "Custom concierge request",
    copy: "A human concierge reviews unusual requests, confirms feasibility, and routes the job to a qualified shopper.",
    fee: "$35-$65"
  }
};

const shopperGrid = document.querySelector("#shopperGrid");
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const category = document.querySelector("#category");
const requestForm = document.querySelector("#requestForm");
const serviceTitle = document.querySelector("#serviceTitle");
const serviceCopy = document.querySelector("#serviceCopy");
const feeEstimate = document.querySelector("#feeEstimate");
const openRequests = document.querySelector("#openRequests");
let selectedSpeed = "Same day";

function renderShoppers() {
  shopperGrid.innerHTML = shoppers.map((shopper) => `
    <article class="shopper-card">
      <div class="shopper-head">
        <div class="avatar">${shopper.initials}</div>
        <div>
          <h3>${shopper.name}</h3>
          <span>${shopper.rating} rating · ${shopper.eta} away</span>
        </div>
      </div>
      <p>${shopper.copy}</p>
      <div class="tag-list">
        ${shopper.tags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>
      <button class="ghost-button wide" type="button">Assign shopper · ${shopper.fee}</button>
    </article>
  `).join("");
}

function showView(id) {
  views.forEach((view) => view.classList.toggle("active", view.id === id));
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === id));
}

function updateServiceProfile() {
  const profile = categoryProfiles[category.value];
  serviceTitle.textContent = profile.title;
  serviceCopy.textContent = profile.copy;
  feeEstimate.textContent = selectedSpeed === "Curated list" ? "$12-$24" : profile.fee;
}

navItems.forEach((item) => {
  item.addEventListener("click", () => showView(item.dataset.view));
});

document.querySelectorAll(".option").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".option").forEach((option) => option.classList.remove("active"));
    button.classList.add("active");
    selectedSpeed = button.dataset.speed;
    updateServiceProfile();
  });
});

category.addEventListener("change", updateServiceProfile);

requestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const current = Number(openRequests.textContent);
  openRequests.textContent = current + 1;
  showView("matches");
  document.querySelector("#matches .status-pill").textContent = `${selectedSpeed} request matched`;
});

document.querySelector("#newRequest").addEventListener("click", () => {
  showView("request");
  requestForm.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#businessMode").addEventListener("click", () => {
  category.value = "Business supplies";
  updateServiceProfile();
  showView("request");
});

document.querySelector("#adminAccess").addEventListener("click", () => {
  showView("admin");
  document.querySelector("#adminStatus").textContent = "Admin unlocked";
});

document.querySelector("#approveAll").addEventListener("click", () => {
  document.querySelectorAll(".admin-badge").forEach((badge) => {
    badge.textContent = "Approved";
    badge.className = "admin-badge active";
  });
  document.querySelector("#adminStatus").textContent = "Queue approved";
});

document.querySelectorAll(".admin-table button").forEach((button) => {
  button.addEventListener("click", () => {
    const badge = button.parentElement.querySelector(".admin-badge");
    badge.textContent = button.textContent === "Track" ? "Tracking" : "Assigned";
    badge.className = "admin-badge active";
    document.querySelector("#adminStatus").textContent = `${button.textContent} updated`;
  });
});

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(15, 0, 0, 0);
document.querySelector("#deadline").value = tomorrow.toISOString().slice(0, 16);

renderShoppers();
updateServiceProfile();
