import { initWebSocket, sendPrediction } from './websocket.js';

const localVideo = document.getElementById("hidden-cam");
let username = "";
let participants = {};

function setupGestureRecognition() {
  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  hands.onResults((results) => {
    if (results.multiHandLandmarks.length > 0) {
      const gesture = "A"; // Mock prediction - replace with real gesture model output
      sendPrediction(username, gesture);
    }
  });

  const camera = new Camera(localVideo, {
    onFrame: async () => {
      await hands.send({ image: localVideo });
    },
    width: 640,
    height: 480,
  });

  camera.start();
}

function joinCall() {
  username = document.getElementById("room-id-input").value.trim();
  if (!username) return;

  document.getElementById("status").textContent = `Connected as ${username}`;
  document.getElementById("leave-btn").disabled = false;

  initWebSocket(handleWebSocketMessage);
  setupGestureRecognition();
}

function handleWebSocketMessage({ username: sender, prediction }) {
  if (!participants[sender]) {
    createVideoBox(sender);
  }

  const label = document.querySelector(`#prediction-${sender}`);
  if (label) {
    label.textContent = `Gesture: ${prediction}`;
  }

  updateParticipantCount();
}

function createVideoBox(user) {
  const grid = document.getElementById("video-grid");
  const box = document.createElement("div");
  box.className = "video-box";
  box.id = `box-${user}`;
  box.innerHTML = `
    <div class="user-name">${user}</div>
    <div class="prediction-label" id="prediction-${user}">Gesture: -</div>
  `;
  grid.appendChild(box);
  participants[user] = true;
}

function updateParticipantCount() {
  const count = Object.keys(participants).length;
  document.getElementById("participant-count").textContent = `Participants: ${count}`;
}

function leaveCall() {
  location.reload();
}

window.joinCall = joinCall;
window.leaveCall = leaveCall;