✨ Sign to Emoji Converter 🎥✋➡️😊
This web-based application uses your webcam and AI hand tracking (via MediaPipe Hands) to detect common hand gestures and display matching emojis on the screen — in real time!

It also features animated hearts when a thumbs-up gesture is detected (like "liking" in WhatsApp or Instagram ❤️).

💡 Features
✅ Real-time hand tracking using webcam.
✅ Recognizes multiple gestures:

👌 OK sign
✌️ Peace sign
👍 Thumbs up (triggers heart animation ❤️)
✊ Fist
👋 Wave

😊 Default friendly emoji

✅ Beautiful, large emoji overlay in the center.
✅ Smooth heart animation on thumbs up.
✅ Black background behind video for minimal distraction.

🛠️ Technologies Used

HTML, CSS, JavaScript
MediaPipe Hands
Webcam via getUserMedia
Animated CSS for hearts

📂 Setup Instructions
1️⃣ Clone or download this repository.

git clone https://github.com/your-username/sign-to-emoji-converter.git
cd sign-to-emoji-converter

2️⃣ Serve the project locally.

⚠️ You must use a local server for webcam permissions to work (not just double-clicking the HTML file).

For example, with Python:

# For Python 3.x
python -m http.server 8000
Then open http://localhost:8000 in your browser.

💻 Usage

Allow camera permission when prompted.

Show different hand gestures to the camera.

Corresponding emoji appears on the screen.

Try a thumbs-up to trigger the heart animation! ❤️

🖐️ Supported Gestures
Gesture	Emoji
OK sign	👌
Peace sign	✌️
Thumbs up	👍 (+ heart animation)
Fist	✊
Wave	👋
Default	😊

⚙️ Customization
You can change emoji styles, colors, or add new gestures in app.js.

Adjust animation effects in style.css if desired.

⭐ Credits
MediaPipe by Google for hand tracking.

Inspired by gesture recognition apps and social media emoji interactions.

