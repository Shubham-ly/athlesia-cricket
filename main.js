import "./style.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAgk53Y3_zhKH0UWZdC7Kan9mMHgvviXhw",
  authDomain: "realtime-e7330.firebaseapp.com",
  databaseURL: "https://realtime-e7330-default-rtdb.firebaseio.com",
  projectId: "realtime-e7330",
  storageBucket: "realtime-e7330.appspot.com",
  messagingSenderId: "932852023522",
  appId: "1:932852023522:web:6c2d22cfdf27849aa59ebb",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const striker = document.querySelector("#striker");
const strikerRun = document.querySelector("#strikerRun");
const nonStriker = document.querySelector("#nonStriker");
const nonStrikerRun = document.querySelector("#nonStrikerRun");
const currentMatch = document.querySelector("#currentMatch");
const runs = document.querySelector("#runs");
const overs = document.querySelector("#overs");
const updates = document.querySelector("#updates");
const balls = document.querySelectorAll(".ball");

onValue(ref(db, "cricket_update/current_game"), (snapshot) => {
  const current_game = snapshot.val();

  const game = current_game.split("_").reduce((acc, curr, i) => {
    return `${acc} ${curr[0].toUpperCase() + curr.slice(1, curr.length)}`;
  }, "");
  currentMatch.innerHTML = game;

  onValue(ref(db, `cricket/${current_game}`), (snapshot) => {
    const data = snapshot.val();
    striker.innerHTML =
      data.striker[0].toUpperCase() +
      data.striker.slice(1, data.striker.length) +
      "🏏";
    nonStriker.innerHTML =
      data["non-striker"][0].toUpperCase() +
      data["non-striker"].slice(1, data["non-striker"].length);

    const teamRuns = data[data.batting_team + "_runs"];
    const wickets = data[data.batting_team + "_wickets"];
    runs.innerHTML = `${teamRuns} | ${wickets}`;
    overs.innerHTML = data.overs;
    balls.forEach((ball, index) => {
      if (data.balls) ball.classList.add("is-cleared");
      ball.innerHTML = data.balls[index];
    });

    onValue(ref(db, `players/${data.striker}/runs`), (snapshot) => {
      strikerRun.innerHTML = snapshot.val() ?? 0;
    });
    onValue(ref(db, `players/${data["non-striker"]}/runs`), (snapshot) => {
      nonStrikerRun.innerHTML = snapshot.val() ?? 0;
    });
  });
});

onValue(ref(db, "cricket_update/update"), (snapshot) => {
  const value = snapshot.val();
  if (value) {
    updates.innerHTML = value;
    updates.classList.add("show");
    setTimeout(() => {
      update(ref(db, "cricket_update"), {
        update: null,
      });
      updates.classList.remove("show");
    }, 3000);
  }
});
