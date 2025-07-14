const videoElement = document.querySelector("video");
const canvasElement = document.querySelector("canvas");
const canvasCtx = canvasElement.getContext("2d");
const emojiDisplay = document.getElementById("emojiDisplay");

let lastGesture = null;
let gestureFrameCount = 0;
const GESTURE_HOLD_FRAMES = 5;
const MIN_FRAME_INTERVAL = 33;
let lastProcessTime = 0;

const CURL_OPEN_THRESHOLD = 140;
const CURL_CLOSED_THRESHOLD = 100;
const OK_SIGN_DIST_THRESHOLD = 0.07;

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function angleBetweenPoints(a, b, c) {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
  const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);
  const cosine = dot / (magAB * magCB);
  const angleRad = Math.acos(Math.min(Math.max(cosine, -1), 1));
  return (angleRad * 180) / Math.PI;
}

function getFingerCurl(landmarks, mcp, pip, dip, tip) {
  const angle1 = angleBetweenPoints(landmarks[mcp], landmarks[pip], landmarks[dip]);
  const angle2 = angleBetweenPoints(landmarks[pip], landmarks[dip], landmarks[tip]);
  return (angle1 + angle2) / 2;
}

function showHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = "❤️";
  heart.style.left = "50%";
  heart.style.top = "50%";
  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 1000);
}

function setEmoji(emoji) {
  emojiDisplay.textContent = emoji;

  // Only show heart when 👍 gesture
  if (emoji === "👍") {
    showHeart();
  }
}

function onResults(results) {
  const now = performance.now();
  if (now - lastProcessTime < MIN_FRAME_INTERVAL) return;
  lastProcessTime = now;

  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    gestureFrameCount++;
    if (gestureFrameCount > GESTURE_HOLD_FRAMES) {
      setEmoji("😊");
      lastGesture = null;
      gestureFrameCount = 0;
    }
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    return;
  }

  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  const landmarks = results.multiHandLandmarks[0];

  drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 3 });
  drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

  const thumbCurl = getFingerCurl(landmarks, 1, 2, 3, 4);
  const indexCurl = getFingerCurl(landmarks, 5, 6, 7, 8);
  const middleCurl = getFingerCurl(landmarks, 9, 10, 11, 12);
  const ringCurl = getFingerCurl(landmarks, 13, 14, 15, 16);
  const pinkyCurl = getFingerCurl(landmarks, 17, 18, 19, 20);
  const thumbIndexDist = distance(landmarks[4], landmarks[8]);

  let detectedGesture = null;

  if (
    thumbIndexDist < OK_SIGN_DIST_THRESHOLD &&
    middleCurl < CURL_CLOSED_THRESHOLD &&
    ringCurl < CURL_CLOSED_THRESHOLD &&
    pinkyCurl < CURL_CLOSED_THRESHOLD
  ) {
    detectedGesture = "👌";
  }
  else if (
    indexCurl > CURL_OPEN_THRESHOLD &&
    middleCurl > CURL_OPEN_THRESHOLD &&
    ringCurl < CURL_CLOSED_THRESHOLD &&
    pinkyCurl < CURL_CLOSED_THRESHOLD
  ) {
    detectedGesture = "✌️";
  }
  else if (
    thumbCurl > CURL_OPEN_THRESHOLD &&
    indexCurl < CURL_CLOSED_THRESHOLD &&
    middleCurl < CURL_CLOSED_THRESHOLD &&
    ringCurl < CURL_CLOSED_THRESHOLD &&
    pinkyCurl < CURL_CLOSED_THRESHOLD
  ) {
    detectedGesture = "👍";
  }
  else if (
    thumbCurl < CURL_CLOSED_THRESHOLD &&
    indexCurl < CURL_CLOSED_THRESHOLD &&
    middleCurl < CURL_CLOSED_THRESHOLD &&
    ringCurl < CURL_CLOSED_THRESHOLD &&
    pinkyCurl < CURL_CLOSED_THRESHOLD
  ) {
    detectedGesture = "✊";
  }
  else if (
    thumbCurl > CURL_OPEN_THRESHOLD &&
    indexCurl > CURL_OPEN_THRESHOLD &&
    middleCurl > CURL_OPEN_THRESHOLD &&
    ringCurl > CURL_OPEN_THRESHOLD &&
    pinkyCurl > CURL_OPEN_THRESHOLD
  ) {
    detectedGesture = "👋";
  }
  else {
    detectedGesture = "😊";
  }

  if (detectedGesture === lastGesture) {
    gestureFrameCount++;
  } else {
    lastGesture = detectedGesture;
    gestureFrameCount = 1;
  }

  if (gestureFrameCount >= GESTURE_HOLD_FRAMES) {
    setEmoji(detectedGesture);
  }

  canvasCtx.restore();
}

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480,
});

camera.start();
