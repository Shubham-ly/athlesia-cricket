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

const strikerElement = document.querySelector("#striker");
const strikerRunElement = document.querySelector("#strikerRun");
const nonStrikerElement = document.querySelector("#nonStriker");
const nonStrikerRunElement = document.querySelector("#nonStrikerRun");
const ballerElement = document.querySelector("#baller");
const totalScoreElement = document.querySelector("#score");
const battingTeamElement = document.querySelector("#battingTeam");
const ballingTeamElement = document.querySelector("#ballingTeam");
const targetScoreElement = document.querySelector("#targetScore");
const overContainerElement = document.querySelector("#overContainer");
const teamAImage = document.querySelector("#teamAImage");
const teamBImage = document.querySelector("#teamBImage");

onValue(ref(db, "cricket_update/current_game"), (snapshot) => {
  const currentGame = snapshot.val();
  onValue(ref(db, `cricket/${currentGame}`), (data) => {
    const gameData = data.val();
    console.log(gameData);
    overContainerElement.innerHTML = "";

    const teamAImageSrc = `${gameData[gameData.batting_team]}.png`;
    const teamBImageSrc = `${gameData[gameData.balling_team]}.png`;
    teamAImage.setAttribute("src", teamAImageSrc);
    teamBImage.setAttribute("src", teamBImageSrc);

    ballingTeamElement.innerHTML = `${gameData[
      gameData.balling_team
    ].toUpperCase()} TEAM - BALLING`;

    battingTeamElement.innerHTML = `${gameData[
      gameData.batting_team
    ].toUpperCase()} TEAM - BATTING`;

    const striker = gameData.striker;
    strikerElement.innerHTML = striker
      ? striker[0].toUpperCase() +
        striker.slice(1, striker.length).replace("-", " ")
      : "";

    const nonStriker = gameData["non-striker"];
    nonStrikerElement.innerHTML = nonStriker
      ? nonStriker[0].toUpperCase() +
        nonStriker.slice(1, nonStriker.length).replace("-", " ")
      : "";

    const baller = gameData.baller;
    ballerElement.innerHTML = baller
      ? baller[0].toUpperCase() +
        baller.slice(1, baller.length).replace("-", " ")
      : "";

    totalScoreElement.innerHTML =
      gameData[`${gameData.batting_team}_runs`] +
        "/" +
        gameData[`${gameData.batting_team}_wickets`] ?? "";

    targetScoreElement.innerHTML =
      gameData[`${gameData.balling_team}_runs`] + 1;

    const overs = gameData[`${gameData.batting_team}_over`];
    overs[overs.length - 1]?.forEach((ball) => {
      let d = ball.toString();
      let ballElement = null;
      if (d.length > 1) {
        console.log("running");
        d = d.replace("+", " ");
        ballElement = createBall(
          `<span>${d[d.length - 1]}</span>
          <span class="belowSpan">${d.slice(0, 2)}</span>`,
          ["whiteCircle"]
        );
      } else {
        ballElement = createBall(d, ["whiteCircle", ball === "W" && "wicket"]);
      }
      ballElement && overContainerElement.appendChild(ballElement);
    });

    onValue(ref(db, `players/${gameData.striker}/${currentGame}`), (snap) => {
      strikerRunElement.innerHTML = snap.val()?.runs || 0;
    });
    onValue(
      ref(db, `players/${gameData["non-striker"]}/${currentGame}`),
      (snap) => {
        nonStrikerRunElement.innerHTML = snap.val()?.runs || 0;
      }
    );
  });
});
onValue(ref(db, "cricket_update/update"), (data) => {
  const d = data.val();
  if (d == "Wide ball") {
    console.log("a wide ball");
    overContainerElement.appendChild(createBall("WD", ["whiteCircle"]));
  }
});
function createBall(data, classes) {
  const ballElement = document.createElement("div");
  for (const c of classes) {
    ballElement.classList.add(c);
  }
  ballElement.innerHTML = data;
  return ballElement;
}
