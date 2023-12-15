document.addEventListener("DOMContentLoaded", function () {
  loadDateTimeInfo();

  const settingsButton = document.getElementById("settingsButton");
  const settingsModal = document.getElementById("settingsModal");
  const modalImages = document.getElementsByClassName("modalImage");
  const closeButton = document.querySelector(".close");
  const saveButton = document.getElementById("saveButton");

  settingsButton.onclick = function () {
    selectModalImage(settingsModal, modalImages);
    openModal();
  };
  closeButton.onclick = closeModal;
  saveButton.onclick = function () {
    saveChanges(settingsModal);
  };

  for (const img of modalImages) {
    img.onclick = function () {
      selectImage(this, settingsModal);
    };
  }

  updateBackgroundFromStorage();
});

/////////////////
// DATE TIME INFO
/////////////////
function loadDateTimeInfo() {
  fetch("http://worldtimeapi.org/api/ip")
    .then((response) => response.json())
    .then((data) => {
      const dayOfWeekSpan = document.getElementById("dayOfWeek");
      const dateTimeSpan = document.getElementById("dateTime");
      const topToolBarContainer = document.getElementById("topToolBar");
      const dateTime = new Date(data.datetime);
      dayOfWeekSpan.innerHTML = getWeekDay(dateTime);
      dateTimeSpan.innerHTML = formatDateTime(dateTime);
      topToolBarContainer.style.display = "flex";
    })
    .catch((error) => console.error(error));
}

function getWeekDay(dateTime) {
  const day = new Date(dateTime).getDay();
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return weekDays[day];
}

function formatDateTime(dateTime) {
  return dateTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

////////////////////////////
// BACKGROUND IMAGE HANDLING
////////////////////////////

function selectModalImage(settingsModal, modalImages) {
  const root = document.getElementById("root");

  const currentBg = root.style.backgroundImage.split(/"/)[1];
  for (const img of modalImages) {
    img.classList.remove("selected");
    if ("assets/images/" + img.getAttribute("data-background") === currentBg) {
      img.classList.add("selected");
    }
  }
}

function saveChanges(settingsModal) {
  const selected = settingsModal.querySelector(".modalImage.selected");
  if (selected) {
    const newBg = selected.getAttribute("data-background");
    chrome.storage.local.set({ bg: newBg }, function () {
      updateBackgroundImage(newBg);
      closeModal();
    });
  } else {
    closeModal();
  }
}

function selectImage(clickedImg, settingsModal) {
  const selected = settingsModal.querySelector(".modalImage.selected");
  if (selected) {
    selected.classList.remove("selected");
  }
  clickedImg.classList.add("selected");
}

function updateBackgroundFromStorage() {
  chrome.storage.local.get("bg", function (data) {
    if (data.bg) {
      updateBackgroundImage(data.bg);
    } else {
      updateBackgroundImage("1.jpg");
    }
  });
}

function updateBackgroundImage(filename) {
  const root = document.getElementById("root");

  root.style.backgroundImage = `url(assets/images/${filename})`;
}

function openModal() {
  const modal = document.getElementById("settingsModal");
  const body = document.body;
  modal.style.display = "flex";
  body.style.overflow = "hidden";
  requestAnimationFrame(function () {
    modal.classList.add("show");
  });
}

function closeModal() {
  const modal = document.getElementById("settingsModal");
  const body = document.body;
  modal.classList.remove("show");

  setTimeout(function () {
    modal.style.display = "none";
    body.style.overflow = "auto";
  }, 200);
}
