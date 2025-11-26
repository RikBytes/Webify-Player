# Webify Player 🎵

A simple Spotify-style web music player built with **HTML, CSS and vanilla JavaScript**.  
It scans your local `assets/music` folders, reads album metadata from `info.json`, and creates a mini music player UI with albums, track list, and a responsive layout.

> Note: The repository does **not** include real MP3 files.  
> Add your own songs locally in the `assets/music` folder (explained below).

---

## 🚀 Features

- 🎧 **Local album browser**
  - Automatically lists albums from `assets/music/<AlbumName>/`
  - Each album has its own `info.json` and `cover.jpg`

- ▶️ **Player controls**
  - Play / Pause
  - Previous / Next track
  - Click a song from the left list to play it
  - Seek bar to jump within the current song
  - Volume slider with mute icon when volume is 0

- 🧾 **Dynamic UI**
  - Current song name shown with scrolling strip
  - Active track highlighted in the song list
  - Time display: `current / total` (mm:ss)

- 📱 **Responsive layout**
  - Sidebar library on the left, albums on the right (desktop)
  - On smaller screens, sidebar slides in/out with a hamburger menu
  - Playbar adapts layout for tablet/mobile widths

---

## 🗂 Folder Structure

```text
.
├─ assets/
│  ├─ img/                 # Icons, logos, UI images, favicon
│  ├─ music/
│  │  └─ Sample/            # Example album folder (you create your own)
│  │     ├─ cover.jpg
│  │     ├─ info.json
│  │     └─ *.mp3          # Your songs 
│  └─ video/               # (if you add videos later)
├─ index.html
├─ style.css
├─ utility.css
├─ script.js
├─ favicon.ico
└─ README.md