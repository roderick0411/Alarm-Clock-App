import { moveClock } from "./clock.js";
import { showHome, deleteAlarm } from "./alarms.js";

function setNewAlarmMode(mode, globalVariables, editAlarmId) {
  document.querySelector(".set-alarm").setAttribute("data-mode", "inactive");
  const rightDiv = document.querySelector(".alarms");
  rightDiv.classList.add("hidden");
  document.querySelector(".alarm-menu").classList.remove("hidden");
  document.querySelector(".zone").classList.remove("hidden");
  document.querySelector(".set-alarm .new-alarm").classList.add("hidden");
  document
    .querySelector(".zone .name.carousel-container input")
    .setAttribute("placeholder", "Alarm Name");
  document.querySelector(".zone .name.carousel-container input").focus();

  document.querySelector(".final .ok");

  if (mode === "new") {
    moveClock({
      hour: 12,
      minute: 0,
      zone: "AM",
    });
    document.querySelector(".zone .name.carousel-container input").value = "";
  } else if (mode === "edit") {
    document.querySelector(".zone .name.carousel-container input").value =
      globalVariables.newAlarmData.name;
  }

  populateButtons(globalVariables);
  populateHourCarousel(globalVariables.newAlarmData);
  const minuteCarouselStart =
    Math.floor(globalVariables.newAlarmData.minute / 15) * 15;
  globalVariables.currentStrip.firstIdx = minuteCarouselStart;
  globalVariables.currentStrip.lastIdx = (minuteCarouselStart + 14) % 60;
  populateMinuteCarousel(minuteCarouselStart, globalVariables);
  setTimeout(() => {
    if (mode === "new") {
      updateAlarmMenu({
        hour: 12,
        minute: 0,
        zone: "AM",
      });
    } else if (mode === "edit") {
      setTimeout(() => {
        updateAlarmMenu({
          hour: globalVariables.newAlarmData.hour,
          minute: globalVariables.newAlarmData.minute,
          zone: globalVariables.newAlarmData.zone,
        });
      });
    }
  });
  setTimeout(() => {
    document.querySelector(".final .ok").addEventListener("click", (event) => {
      addAlarm(mode, globalVariables, editAlarmId);
    });
  });
}

// ---------------------------------------------------------------------------------------------------------------

function addAlarm(mode, globalVariables, editAlarmId) {
  let name = document.querySelector(
    ".zone .name.carousel-container input"
  ).value;
  name = name === "" ? "Alarm" : name;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  const hour = Number(globalVariables.newAlarmData.hour);
  const minute = Number(globalVariables.newAlarmData.minute);
  const zone = globalVariables.newAlarmData.zone;
  const id = zone + hour + minute;
  const alarm = {
    name,
    hour,
    minute,
    zone,
    id,
  };
  //   find if alarm with the same time already exists
  const repeatIdx = globalVariables.alarms.findIndex(
    (element) => element.id === id
  );
  //   if not and mode is New
  if ((repeatIdx === -1) & (mode === "new")) {
    globalVariables.alarms.push(alarm);
    showThumbsUp(globalVariables, "Done");
  } // if does and mode is New
  if ((repeatIdx !== -1) & (mode === "new")) {
    replaceAlarm("new", globalVariables, alarm, repeatIdx);
  }
  //   if not and mode is Edit
  if ((repeatIdx === -1) & (mode === "edit")) {
    // replace the previous alarm with new
    const idx = globalVariables.alarms.findIndex(
      (element) => element.id === editAlarmId
    );
    globalVariables.alarms.splice(idx, 1, alarm);
    showThumbsUp(globalVariables, "Done");
  }
  //   if does and mode is Edit
  if ((repeatIdx != -1) & (mode === "edit")) {
    // check if no change was made to the alarm,
    const repeatAlarm = globalVariables.alarms[repeatIdx];
    if (
      (repeatAlarm.hour === alarm.hour) &
      (repeatAlarm.minute === alarm.minute) &
      (repeatAlarm.zone === alarm.zone) &
      (repeatAlarm.name === alarm.name)
    ) {
      showThumbsUp(globalVariables, "No change");
    } else {
      replaceAlarm("edit", globalVariables, alarm, repeatIdx, editAlarmId);
    }
    // replace the previous alarm with new
    // const idx = alarms.findIndex((element) => element.id === editAlarmId);
    // alarms.splice(idx, 1, alarm);
    // showThumbsUp(alarms, clockIntervalId, currentStrip);
  }
}

// ------------------------------------------------------------------------------------------------------

function replaceAlarm(mode, globalVariables, alarm, repeatIdx, editAlarmId) {
  const dialog = document.createElement("div");
  dialog.classList.add("modal");
  const message = document.createElement("div");
  message.classList.add("message");
  message.textContent = "An alarm set to this time already exists. Replace it?";
  dialog.appendChild(message);
  const buttons = document.createElement("div");
  buttons.classList.add("buttons");
  const no = document.createElement("div");
  no.textContent = "No";
  no.classList.add("no");
  no.addEventListener("click", () => {
    dialog.remove();
    modalBackDrop.remove();
    showThumbsUp(globalVariables, "Done");
  });
  buttons.appendChild(no);
  const yes = document.createElement("div");
  yes.textContent = "Yes";
  yes.classList.add("yes");
  yes.addEventListener("click", () => {
    // replace the previous alarm with the new
    globalVariables.alarms.splice(repeatIdx, 1, alarm);
    if (mode === "edit") {
      // remove the edited item
      const idx = globalVariables.alarms.findIndex(
        (alarm) => alarm.id === editAlarmId
      );
      globalVariables.alarms.splice(idx, 1);
    }
    dialog.remove();
    modalBackDrop.remove();
    showThumbsUp(globalVariables, "Done");
  });
  buttons.appendChild(yes);
  dialog.appendChild(buttons);

  const modalBackDrop = document.createElement("div");
  modalBackDrop.classList.add("modal-back");
  document.querySelector("main").appendChild(modalBackDrop);
  document.querySelector("main").appendChild(dialog);
}

// ----------------------------------------------------------------------------------------------------------

function showThumbsUp(globalVariables, modalMessage) {
  const thumbsUpBox = document.createElement("div");
  thumbsUpBox.classList.add("modal");
  thumbsUpBox.innerHTML = `
  <svg fill="#000000" class="svg" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-1.6 -1.6 19.20 19.20" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(0,0), scale(1)"><rect x="-1.6" y="-1.6" width="19.20" height="19.20" rx="9.6" fill="#7ed0ec" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <g id="Layer_1-2"> <path d="M16,6c0-1.1-0.9-2-2-2H9.1l0.2-0.9c0.2-0.7,0-1.5-0.5-2.1c-0.5-0.6-1.2-1-2-1H6.5C6.3,0,6.1,0.1,6,0.4L5.3,3 C5.2,3.8,4.7,4.5,4.2,5.1L2.3,7H0.5C0.2,7,0,7.2,0,7.5v8C0,15.8,0.2,16,0.5,16h2C2.8,16,3,15.8,3,15.5v-0.6C3.7,15.6,4.6,16,5.5,16 h7c0.8,0,1.5-0.7,1.5-1.5l0,0c0-0.2-0.1-0.5-0.2-0.7c0.7-0.3,1.2-1,1.2-1.8c0-0.4-0.1-0.8-0.3-1.1c0.8-0.3,1.3-1,1.3-1.9 c0-0.6-0.2-1.1-0.7-1.5C15.8,7.1,16,6.6,16,6z M2,15H1V8h1V15z M12.5,8H14c0.6,0,1,0.4,1,1s-0.4,1-1,1h-1.5c-0.3,0-0.5,0.2-0.5,0.5 s0.2,0.5,0.5,0.5H13c0.6,0,1,0.4,1,1s-0.4,1-1,1h-1.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h1c0.3,0,0.5,0.2,0.5,0.5 S12.8,15,12.5,15h-7C4.1,15,3,13.9,3,12.5V7.7l1.9-1.9c0.7-0.7,1.2-1.6,1.5-2.5L6.9,1h0.1c0.5,0,0.9,0.2,1.2,0.6 c0.3,0.4,0.4,0.8,0.3,1.3L8.1,4H7.5C7.2,4,7,4.2,7,4.5S7.2,5,7.5,5H14c0.6,0,1,0.4,1,1s-0.4,1-1,1h-1.5C12.2,7,12,7.2,12,7.5 S12.2,8,12.5,8z"></path> </g> </g></svg>
    `;
  const message = document.createElement("div");
  message.classList.add("message");
  message.textContent = modalMessage;
  thumbsUpBox.appendChild(message);

  const modalBackDrop = document.createElement("div");
  modalBackDrop.classList.add("modal-back");
  document.querySelector("main").appendChild(modalBackDrop);
  document.querySelector("main").appendChild(thumbsUpBox);
  setTimeout(() => thumbsUpBox.classList.add("modal-effects"));
  setTimeout(() => {
    thumbsUpBox.style.opacity = 0;
  }, 1500);
  setTimeout(() => {
    thumbsUpBox.remove();
    modalBackDrop.remove();
  }, 2500);
  setTimeout(() => {
    showHome(globalVariables);
  }, 2600);
}

// ---------------------------------------------------------------------------------------------------------------

function updateAlarmMenu(newAlarmData) {
  const hour =
    newAlarmData.hour < 10 ? "0" + newAlarmData.hour : newAlarmData.hour;
  const minute =
    newAlarmData.minute < 10 ? "0" + newAlarmData.minute : newAlarmData.minute;
  document.querySelector(".zone .time span.hours").textContent = hour;
  document.querySelector(".zone .time span.minutes").textContent = minute;
  document.querySelectorAll(".carousel .hour-li").forEach((li) => {
    li.classList.remove("selected");
    if (li.textContent == newAlarmData.hour) {
      li.classList.add("selected");
    }
  });
  document.querySelectorAll(".carousel .minute-li").forEach((li) => {
    li.classList.remove("selected");
    if (li.textContent == newAlarmData.minute) {
      li.classList.add("selected");
    }
  });
  document.querySelectorAll(".zone .am-pm-zone").forEach((li) => {
    li.classList.remove("selected");
    if (li.textContent == newAlarmData.zone) {
      li.classList.add("selected");
    }
  });
  setTimeout(() => {
    moveClock(newAlarmData);
  });
}

// ---------------------------------------------------------------------------------------------------------------

function populateButtons(globalVariables) {
  const ampm = document.querySelector(".ampm");
  ampm.innerHTML = "";
  setTimeout(() => {
    ampm.innerHTML = `
    <div class="time">
                <span class="hours">12</span><span>:</span
                ><span class="minutes">00</span>
              </div>
              <div class="am am-pm-zone">AM</div>
              <div class="pm am-pm-zone">PM</div>`;
  });
  setTimeout(() => {
    document.querySelectorAll(".am-pm-zone").forEach((zone) =>
      zone.addEventListener("click", (event) => {
        globalVariables.newAlarmData.zone = event.target.textContent;
        updateAlarmMenu(globalVariables.newAlarmData);
      })
    );
  });

  const final = document.querySelector(".final");
  final.innerHTML = "";
  const cancel = document.createElement("div");
  cancel.classList.add("cancel");
  cancel.innerHTML = `
  <svg class="svg" viewBox="0 0 32 28">
                <path
                  d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"
                ></path>
              </svg>`;
  cancel.addEventListener("click", () => {
    showHome(globalVariables);
  });

  const ok = document.createElement("div");
  ok.classList.add("ok");
  ok.innerHTML = `
  <svg class="svg" viewBox="0 0 17.837 15">
                <g>
                  <path
                    d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27
		c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0
		L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
                  />
                </g>
              </svg>`;

  final.appendChild(cancel);
  final.appendChild(ok);
}

function populateHourCarousel(newAlarmData) {
  const hourCarousel = document.querySelector(".alarm-menu .hour .carousel");
  hourCarousel.innerHTML = "";
  for (let i = 1; i <= 12; i++) {
    const element = document.createElement("span");
    element.classList.add("hour-li");
    element.textContent = i;
    element.addEventListener("click", () => {
      newAlarmData.hour = Number(i);
      //   console.log(newAlarmData);
      updateAlarmMenu(newAlarmData);
    });
    hourCarousel.appendChild(element);
  }
}

// ---------------------------------------------------------------------------------------------------------------

function populateMinuteCarousel(startIndex, globalVariables) {
  const minuteCarousel = document.querySelector(
    ".alarm-menu .minute .carousel"
  );
  minuteCarousel.innerHTML = "";
  for (let i = startIndex; i <= startIndex + 14; i++) {
    const element = document.createElement("span");
    element.classList.add("minute-li");
    element.textContent = i % 60;
    element.addEventListener("click", () => {
      globalVariables.newAlarmData.minute = Number(i % 60);
      //   console.log(newAlarmData);
      updateAlarmMenu(globalVariables.newAlarmData);
    });
    minuteCarousel.appendChild(element);
  }
}

// ---------------------------------------------------------------------------------------------------------------

function slideCarouselLeft(globalVariables) {
  const carousel = document.querySelector(".alarm-menu .minute .carousel");
  const carouselContainer = document.querySelector(
    ".alarm-menu .carousel-container.minute"
  );
  carouselContainer.style.width = carouselContainer.offsetWidth + "px";
  const carouselEnvelope = document.querySelector(
    ".alarm-menu .carousel-container.minute .carousel-envelope"
  );
  carouselEnvelope.style.width = carouselEnvelope.offsetWidth + "px";
  const carouselWidth = carousel.offsetWidth;
  const flexItems = document.querySelectorAll(
    ".alarm-menu .minute .carousel span"
  );
  let itemsWidth = 0;
  for (let item of flexItems) {
    itemsWidth += item.offsetWidth;
  }
  const gap = (carouselWidth - itemsWidth) / (flexItems.length - 1);
  carousel.style.width = carouselWidth + carouselWidth + gap + "px";
  carousel.innerHTML = "";
  //   console.log(`carousel width before: ${carouselWidth}`);
  //   console.log(`Gap: ${gap}`);
  //   console.log(`carousel width extended: ${carousel.offsetWidth}`);
  carousel.style.transform = `translateX(-${carouselWidth + gap}px)`;

  for (
    let i = globalVariables.currentStrip.firstIdx - 15;
    i <= globalVariables.currentStrip.firstIdx + 14;
    i++
  ) {
    const element = document.createElement("span");
    element.classList.add("minute-li");
    const minute = (i + 60) % 60;
    element.textContent = minute;
    element.addEventListener("click", () => {});
    carousel.append(element);
  }

  setTimeout(() => {
    carousel.classList.add("transitioned");
  });
  setTimeout(() => {
    carousel.classList.add("translate-initial");
  });

  const startIndex = globalVariables.currentStrip.firstIdx - 15 + 60;
  setTimeout(() => {
    carousel.style.width = carouselWidth + "px";
    carousel.classList.remove("translate-initial");
    carousel.classList.remove("transitioned");
    // console.log(`carousel width after slide: ${carousel.offsetWidth}`);
    populateMinuteCarousel(startIndex, globalVariables);
    carousel.style.transition = "unset";
    carousel.style.transform = `translateX(-0px)`;
    carousel.style.willChange = "transition";
    document.querySelector(
      ".minute.carousel-container .slide-left"
    ).style.pointerEvents = "all";
  }, 1100);
  globalVariables.currentStrip.firstIdx = startIndex;
  globalVariables.currentStrip.lastIdx = (startIndex + 14) % 60;
}

// ---------------------------------------------------------------------------------------------------------------

function slideCarouselRight(globalVariables) {
  const carouselContainer = document.querySelector(
    ".alarm-menu .carousel-container.minute"
  );
  carouselContainer.style.width = carouselContainer.offsetWidth + "px";
  const carouselEnvelope = document.querySelector(
    ".alarm-menu .carousel-container.minute .carousel-envelope"
  );
  carouselEnvelope.style.width = carouselEnvelope.offsetWidth + "px";
  const carousel = document.querySelector(".alarm-menu .minute .carousel");
  const carouselWidth = carousel.offsetWidth;
  const flexItems = document.querySelectorAll(
    ".alarm-menu .minute .carousel span"
  );
  let itemsWidth = 0;
  for (let item of flexItems) {
    itemsWidth += item.offsetWidth;
  }
  const gap = (carouselWidth - itemsWidth) / (flexItems.length - 1);
  carousel.style.width = carouselWidth + carouselWidth + gap + "px";
  //   console.log(`carousel width before: ${carouselWidth}`);
  //   console.log(`Gap: ${gap}`);
  //   console.log(`carousel width extended: ${carousel.offsetWidth}`);
  for (let i = 1; i <= 15; i++) {
    const element = document.createElement("span");
    element.classList.add("minute-li");
    const minute = (i + globalVariables.currentStrip.lastIdx) % 60;
    element.textContent = minute;
    carousel.appendChild(element);
  }
  const startIndex = (globalVariables.currentStrip.lastIdx + 1) % 60;
  carousel.style.transition = "transform .5s ease-out";
  setTimeout(() => {
    carousel.style.transform = `translateX(-${carouselWidth + gap}px)`;
  });
  globalVariables.currentStrip.firstIdx = startIndex;
  globalVariables.currentStrip.lastIdx = (startIndex + 14) % 60;
  setTimeout(() => {
    carousel.style.width = carouselWidth + "px";
    populateMinuteCarousel(startIndex, globalVariables);
    carousel.style.transition = "unset";
    carousel.style.transform = `translateX(-0px)`;
  }, 500);
  //   console.log(`New First idx: ${currentStrip.firstIdx}`);
  //   console.log(`New Last idx: ${currentStrip.lastIdx}`);
}

export { setNewAlarmMode, slideCarouselLeft, slideCarouselRight, showThumbsUp };
