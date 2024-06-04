function moveClock(reference) {
  let hours, minutes, seconds;
  const hoursHand = document.querySelector("#hours-hand");
  const minutesHand = document.querySelector("#minutes-hand");
  const secondsHand = document.querySelector("#seconds-hand");
  secondsHand.classList.remove("hidden");
  if (!reference) {
    const date = new Date();
    hours = date.getHours() % 12;
    minutes = date.getMinutes();
    seconds = date.getSeconds();
  } else {
    // console.log(reference);
    hours = reference.hour;
    minutes = reference.minute;
    seconds = 0;
    setTimeout(() => {
      hoursHand.style.transition = "transform .5s ease-out";
    });
    setTimeout(() => {
      minutesHand.style.transition = "transform .5s ease-out";
    });
    secondsHand.classList.add("hidden");
  }
  const hoursDeg = (hours / 12) * 360;
  const minutesDeg = (minutes / 60) * 360;
  const secondsDeg = (seconds / 60) * 360;
  hoursHand.setAttribute("transform", `rotate(${hoursDeg + minutesDeg / 12})`);
  minutesHand.setAttribute("transform", `rotate(${minutesDeg})`);
  secondsHand.setAttribute("transform", `rotate(${secondsDeg})`);
}

function startAlarm(reference) {
  console.log(reference);
  let hours, minutes;
  const hoursHand = document.querySelector("#alarm-hours-hand");
  const minutesHand = document.querySelector("#alarm-minutes-hand");
  const bells = document.querySelector("#alarm-bells");
  bells.classList.add("ring");

  hours = reference.alarmHour % 12;
  minutes = reference.alarmMinute;
  setTimeout(() => {
    hoursHand.style.transition = "transform .5s ease-out";
  });
  setTimeout(() => {
    minutesHand.style.transition = "transform .5s ease-out";
  });

  const hoursDeg = (hours / 12) * 360;
  const minutesDeg = (minutes / 60) * 360;
  console.log(hoursDeg);
  console.log(minutesDeg);
  hoursHand.setAttribute("transform", `rotate(${hoursDeg + minutesDeg / 12})`);
  minutesHand.setAttribute("transform", `rotate(${minutesDeg})`);
}

export { moveClock, startAlarm };
