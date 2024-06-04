import {
  setNewAlarmMode,
  slideCarouselLeft,
  slideCarouselRight,
} from "./new-alarm.js";
import { renderAlarms, showHome, ringAlarm } from "./alarms.js";
import { moveClock } from "./clock.js";

const globalVariables = {
  alarms: [
    {
      name: "Meditation",
      hour: 6,
      minute: 30,
      zone: "AM",
    },
    {
      name: "Tea break",
      hour: 5,
      minute: 30,
      zone: "PM",
    },
    {
      name: "Cardio",
      hour: 7,
      minute: 0,
      zone: "AM",
    },
    {
      name: "Sleep",
      hour: 3,
      minute: 2,
      zone: "PM",
    },
  ],
  alarmsStartIdx: 0,
  clockIntervalId: {},
  newAlarmData: {
    hour: 12,
    minute: 0,
    zone: "AM",
  },
  currentStrip: {
    firstIdx: 0,
    lastIdx: 14,
  },
  activeAlarm: {},
};

document.querySelector("#alarm-trigger").addEventListener("click", () => {
  ringAlarm(globalVariables, globalVariables.activeAlarm);
});

function findAlarm(globalVariables) {
  // console.log(globalVariables.activeAlarm);
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  if (
    (globalVariables.activeAlarm.alarmHour === hour) &
    (globalVariables.activeAlarm.alarmMinute === minute)
  ) {
    return;
  }
  let alarmFound = false;
  // console.log(`Time: ${hour}:${minute}`);
  globalVariables.alarms.forEach((alarm) => {
    const alarmHour =
      alarm.zone === "PM" ? 12 + (alarm.hour % 12) : alarm.hour % 12;
    const alarmMinute = alarm.minute;
    const name = alarm.name;
    if ((alarmHour === hour) & (alarmMinute === minute)) {
      alarmFound = true;
      globalVariables.activeAlarm = { alarmHour, alarmMinute, name };
      console.log(`Alarm: ${alarmHour}:${alarmMinute}`);
      document.querySelector("#alarm-trigger").click();
      console.log("Alarm triggered");
    }
  });
  if (alarmFound === false) {
    globalVariables.activeAlarm;
  }
}

showHome(globalVariables);

globalVariables.clockIntervalId.id = setInterval(() => {
  if (
    document.querySelector(".set-alarm").getAttribute("data-mode") === "active"
  ) {
    moveClock();
  }
  findAlarm(globalVariables);
}, 1000);

globalVariables.alarms.forEach((alarm) => {
  alarm.id = alarm.zone + alarm.hour + alarm.minute;
});

document
  .querySelector(".set-alarm .new-alarm")
  .addEventListener("click", function () {
    setNewAlarmMode("new", globalVariables);
  });

const slideCarouselRightBtn = document.querySelector(
  ".minute.carousel-container .slide-right"
);

slideCarouselRightBtn.addEventListener("click", () => {
  slideCarouselRight(globalVariables);
});

const slideCarouselLeftBtn = document.querySelector(
  ".minute.carousel-container .slide-left"
);

slideCarouselLeftBtn.addEventListener("click", (event) => {
  event.target.closest("div").style.pointerEvents = "none";
  slideCarouselLeft(globalVariables);
});

// setAlarmName();

// bells.classList.add("ring");
