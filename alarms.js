import { moveClock, startAlarm } from "./clock.js";
import { setNewAlarmMode, showThumbsUp } from "./new-alarm.js";

function renderAlarms(globalVariables) {
  globalVariables.alarms.sort((a, b) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    const hourA = a.zone === "PM" ? 12 + (a.hour % 12) : a.hour % 12;
    const hourB = b.zone === "PM" ? 12 + (b.hour % 12) : b.hour % 12;
    const dateA = new Date(year, month, date, hourA, a.minute);
    const dateB = new Date(year, month, date, hourB, b.minute);
    if (dateA <= now) {
      dateA.setDate(date + 1);
    }
    if (dateB <= now) {
      dateB.setDate(date + 1);
    }
    return dateA - dateB;
  });
  const alarmsList = document.querySelector(".alarms");
  alarmsList.innerHTML = "";
  const startIdx = globalVariables.alarmsStartIdx;
  for (
    let index = startIdx;
    index < Math.min(startIdx + 5, globalVariables.alarms.length);
    index++
  ) {
    const alarmDiv = returnAlarm(
      globalVariables,
      globalVariables.alarms[index]
    );
    alarmsList.appendChild(alarmDiv);
  }
  if (globalVariables.alarms.length > 5) {
    const slideButtons = document.createElement("div");
    slideButtons.classList.add("slide-buttons");
    const previous = document.createElement("div");
    previous.classList.add(".previous");
    previous.innerHTML = `<img src="./src/Icons/left-arrow-svg.svg" alt="" />`;
    previous.addEventListener("click", () => {
      if (startIdx - 5 >= 0) {
        globalVariables.alarmsStartIdx -= 5;
        renderAlarms(globalVariables);
      }
    });
    const next = document.createElement("div");
    next.classList.add(".next");
    next.innerHTML = `<img src="./src/Icons/right-arrow-svg.svg" alt="" />`;
    next.addEventListener("click", () => {
      if (globalVariables.alarms.length > startIdx + 5) {
        globalVariables.alarmsStartIdx += 5;
        renderAlarms(globalVariables);
      }
    });
    slideButtons.appendChild(previous);
    slideButtons.appendChild(next);
    alarmsList.appendChild(slideButtons);
  }
}

function returnAlarm(globalVariables, alarm) {
  const hour = alarm.hour < 10 ? "0" + alarm.hour : alarm.hour;
  const minute = alarm.minute < 10 ? "0" + alarm.minute : alarm.minute;
  const name =
    alarm.name.length > 20 ? alarm.name.substring(0, 18) + "..." : alarm.name;
  const alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", alarm.id);
  alarmDiv.innerHTML = `
          <span class="name">${name}</span>
          <div class="options">
            <svg class="svg edit" viewBox="-2.4 -2.4 28.8 28.8" fill="none">
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M12 3.99997H6C4.89543 3.99997 4 4.8954 4 5.99997V18C4 19.1045 4.89543 20 6 20H18C19.1046 20 20 19.1045 20 18V12M18.4142 8.41417L19.5 7.32842C20.281 6.54737 20.281 5.28104 19.5 4.5C18.7189 3.71895 17.4526 3.71895 16.6715 4.50001L15.5858 5.58575M18.4142 8.41417L12.3779 14.4505C12.0987 14.7297 11.7431 14.9201 11.356 14.9975L8.41422 15.5858L9.00257 12.6441C9.08001 12.2569 9.27032 11.9013 9.54951 11.6221L15.5858 5.58575M18.4142 8.41417L15.5858 5.58575"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
            <svg class="svg delete" viewBox="-2.4 -2.4 28.8 28.8" fill="none">
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M10 12V17"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M14 12V17"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M4 7H20"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
            <span class="time">${hour}:${minute} ${alarm.zone}</span>
          </div>
    `;

  alarmDiv.querySelector(".edit").addEventListener("click", () => {
    const editAlarmId = alarm.id;
    globalVariables.newAlarmData.hour = alarm.hour;
    globalVariables.newAlarmData.minute = alarm.minute;
    globalVariables.newAlarmData.zone = alarm.zone;
    globalVariables.newAlarmData.name = alarm.name;
    setNewAlarmMode("edit", globalVariables, editAlarmId);
  });

  alarmDiv.querySelector(".delete").addEventListener("click", () => {
    console.log(alarm.id);
    deleteAlarm(alarm.id, globalVariables);
  });
  return alarmDiv;
}

function deleteAlarm(id, globalVariables) {
  const dialog = document.createElement("div");
  dialog.classList.add("modal");
  const message = document.createElement("div");
  message.classList.add("message");
  message.textContent = "Delete Alarm?";
  dialog.appendChild(message);
  const buttons = document.createElement("div");
  buttons.classList.add("buttons");
  const no = document.createElement("div");
  no.textContent = "No";
  no.classList.add("no");

  no.addEventListener("click", () => {
    dialog.remove();
    modalBackDrop.remove();
  });

  buttons.appendChild(no);
  const yes = document.createElement("div");
  yes.textContent = "Yes";
  yes.classList.add("yes");
  yes.addEventListener("click", () => {
    // delete the alarm
    const idx = globalVariables.alarms.findIndex((alarm) => alarm.id === id);
    globalVariables.alarms.splice(idx, 1);
    dialog.remove();
    modalBackDrop.remove();
    showThumbsUp(globalVariables, "Deleted");
  });
  buttons.appendChild(yes);
  dialog.appendChild(buttons);

  const modalBackDrop = document.createElement("div");
  modalBackDrop.classList.add("modal-back");
  document.querySelector("main").appendChild(modalBackDrop);
  setTimeout(() => {
    document.querySelector("main").appendChild(dialog);
  });
}

function ringAlarm(globalVariables, alarm) {
  const dialog = document.createElement("div");
  dialog.classList.add("modal");
  const clockDiv = document.createElement("div");
  clockDiv.classList.add("clock-div");
  clockDiv.innerHTML = `
  <svg id="alarm-clock" viewBox="0 0 146.54 146.54">
  <circle id="alarm-circle" cx="73.27" cy="73.27" r="48" style="fill: #fff;stroke: #231f20;stroke-miterlimit: 10;stroke-width: 10px"/>
  <g id="alarm-bells" transform-origin="73.27 73.27">
    <line x1="17.12" y1="37.1" x2="38.21" y2="16.67" style="fill: none;stroke: #231f20;stroke-linecap: round;stroke-linejoin: round;stroke-width: 10px"/>
    <line id="bell-right" x1="130.04" y1="37.1" x2="108.96" y2="16.67" style="fill: none;stroke: #231f20;stroke-linecap: round;stroke-linejoin: round;stroke-width: 10px"/>
  </g>
  <g id="alarm-hands">
    <line id="alarm-minutes-hand" transform-origin="73.27 73.27" x1="73.27" y1="73.27" x2="73.27" y2="38.8" style="fill: none;stroke: #231f20;stroke-linecap: round;stroke-linejoin: round;stroke-width: 10px"/>
    <line id="alarm-hours-hand" transform-origin="73.27 73.27" x1="73.27" y1="73.27" x2="73.27" y2="38.8" style="fill: none;stroke: #231f20;stroke-linecap: round;stroke-linejoin: round;stroke-width: 10px"/>
  </g> 
</svg>
  `;
  const ring = new Audio("./src/alarm-sound.wav");
  ring.loop = true;
  ring.muted = false;
  console.log(ring);
  ring.play();
  dialog.appendChild(clockDiv);
  const message = document.createElement("div");
  message.classList.add("message");
  let name = alarm.name;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  message.textContent = name;
  dialog.appendChild(message);
  const buttons = document.createElement("div");
  buttons.classList.add("buttons");
  const close = document.createElement("div");
  close.textContent = "Close";
  close.classList.add("close");

  close.addEventListener("click", () => {
    ring.load();
    dialog.remove();
    modalBackDrop.remove();
  });

  buttons.appendChild(close);
  dialog.appendChild(buttons);
  const modalBackDrop = document.createElement("div");
  modalBackDrop.classList.add("modal-back");
  document.querySelector("main").appendChild(modalBackDrop);

  setTimeout(() => {
    document.querySelector("main").appendChild(dialog);
  });
  setTimeout(() => {
    startAlarm(alarm);
  });
}

function showHome(globalVariables) {
  document.querySelector(".set-alarm").setAttribute("data-mode", "active");
  document.querySelector(".alarms").classList.remove("hidden");
  document.querySelector(".alarm-menu").classList.add("hidden");
  document.querySelector(".zone").classList.add("hidden");
  document.querySelector(".set-alarm .new-alarm").classList.remove("hidden");
  renderAlarms(globalVariables);
  // clearInterval(globalVariables.clockIntervalId.id);
}

export { renderAlarms, showHome, deleteAlarm, ringAlarm };
