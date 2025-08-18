// trainings.js — логика расписания и статуса тренировок
// Дни недели: 0=вс, 1=пн, 2=вт, 3=ср, 4=чт, 5=пт, 6=сб
const TRAINING_DAYS = [2, 4, 6]; // вторник, четверг, суббота
const TRAINING_START = { h: 19, m: 30 };
const TRAINING_END = { h: 21, m: 0 };

function getStatus(now = new Date()) {
  const day = now.getDay();
  const hour = now.getHours();
  const min = now.getMinutes();
  const time = hour * 60 + min;
  const start = TRAINING_START.h * 60 + TRAINING_START.m;
  const end = TRAINING_END.h * 60 + TRAINING_END.m;
  const todayHas = TRAINING_DAYS.includes(day);
  if (todayHas && time >= start && time < end) {
    return { status: "active", text: "Идет тренировка" };
  }
  // Следующая тренировка (или сегодняшняя, если еще не началась)
  let nextDay = day;
  let nextTime = TRAINING_START;
  if (!todayHas || (todayHas && time >= end)) {
    nextDay = getNextTrainingDayIndex(day);
  } else if (todayHas && time < start) {
    nextDay = day;
  }
  const dayName = getDayNameShort(nextDay);
  const timeStr = `${pad2(TRAINING_START.h)}:${pad2(TRAINING_START.m)}`;
  return {
    status: "next",
    text: `<span class="training-status-day">${dayName}</span><span class="training-status-time">${timeStr}</span>`,
  };
}

function getNextTrainingDayIndex(currentDay) {
  for (let i = 1; i <= 7; i++) {
    const d = (currentDay + i) % 7;
    if (TRAINING_DAYS.includes(d)) {
      return d;
    }
  }
  return currentDay;
}

function getDayNameShort(d) {
  return [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ][d];
}

function pad2(n) {
  return n < 10 ? "0" + n : n;
}

function renderSchedule() {
  const now = new Date();
  const status = getStatus(now);
  const days = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
  const schedule = document.querySelector(".training-schedule");
  schedule.innerHTML = "";
  days.forEach((name, i) => {
    const has = TRAINING_DAYS.includes((i + 1) % 7);
    const row = document.createElement("div");
    row.className = "schedule-row";
    const dayCell = document.createElement("div");
    dayCell.className = "schedule-day";
    dayCell.textContent = name;
    row.appendChild(dayCell);
    if (has) {
      const circle = document.createElement("span");
      circle.className = "schedule-dot";
      if ((i + 1) % 7 === now.getDay() && status.status === "active") {
        circle.classList.add("pulse");
      }
      row.appendChild(circle);
    }
    schedule.appendChild(row);
  });
  const statusEl = document.querySelector(".training-status");
  if (status.status === "active") {
    statusEl.textContent = status.text;
  } else {
    statusEl.innerHTML = status.text;
  }
}

document.addEventListener("DOMContentLoaded", renderSchedule);
setInterval(renderSchedule, 30000); // обновлять статус каждые 30 сек
// trainings.js — только для trainings.html
// Здесь могут быть скрипты, уникальные для страницы "Тренировки"
