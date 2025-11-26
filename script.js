console.log("Site is loaded");

let currentSong = new Audio();
let currFolder = "";
let allSongs = [];
let currentIndex = 0;

function secToMin(seconds) {
    seconds = Math.floor(seconds);

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    // Add leading zero when needed
    const formatted = `${mins}:${secs < 10 ? "0" + secs : secs}`;

    return formatted;
}

// Detect albums and display them
async function displayAlbums() {
    const album_url = "assets/music/"
    const response = await fetch(album_url);
    let html = await response.text();
    let div = document.createElement("div");
    div.innerHTML = html;

    let paths = div.querySelectorAll("a");
    let cards = document.querySelector(".album-container");

    const path_array = Array.from(paths).map(async unsorted => {
        const href = decodeURI(unsorted.getAttribute("href"))

        if (href.startsWith("\\assets\\music")) {
            let folder_name = href.slice(14, -1)
            try {
                const response = await fetch(`assets/music/${folder_name}/info.json`);
                const info_json = await response.json();

                cards.innerHTML = cards.innerHTML + `<div data-folder="${info_json.title}" class="card">
                        <img src="assets/music/${folder_name}/cover.jpg" alt="cover" srcset="">
                            <h2>${info_json.title}</h2>
                            <p>${info_json.desc}</p>
                    </div>`
            } catch (error) {
                console.log("found error", error)
            }
            return href;
        }
    })
    await Promise.all(path_array);
}

// Loading songs from the folder

async function loadSongsFromFolder(folderUrl) {
    const songs = await getSongs(folderUrl);
    allSongs = songs

    const songList = document.querySelector(".song-list ul");
    songList.innerHTML = "";

    for (const song of songs) {
        if ((song.songurl).endsWith(".mp3")) {
            songList.innerHTML += `
                <li data-url="${song.songurl}" data-name="${song.name}">
                    <h3>${song.name}</h3>
                    <p> added by ${song.author}</p>
                </li>`;
        }
    }
}

// fetching songs

async function getSongs(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        let div = document.createElement("div");
        div.innerHTML = html;
        let songsArray = Array.from(div.querySelectorAll("a"));
        const songs = songsArray
            .map(link => link.getAttribute("href"))
            .filter(href => href.endsWith(".mp3"));


        const songsObj = songs.map(unsorted => {
            const sorted = decodeURIComponent(unsorted);

            const parts = sorted.split(/[/\\]/);
            const name = parts[parts.length - 1];
            const listnames = name.replace(/\[.*?\]/, "").trim();

            return {
                name: listnames.replace("y2mate.com -", "").trim(),
                songurl: url + encodeURIComponent(name),
                author: "owner"
            };
        })
        return songsObj;
    } catch (err) {
        console.error("Error fetching songs:", err);
    }
}

const playMusic = (name, url, pause = false) => {
    const songName = name;
    currentSong.src = url;

    document.querySelectorAll(".song-list li").forEach(li =>
        li.classList.remove("song-active")
    );

    if (!pause) {
        currentSong.play()
        play.src = "assets\\img\\002-pause.png"

        const activeLi = document.querySelector(`.song-list li[data-url="${url}"]`);
        if (activeLi) activeLi.classList.add("song-active");

        document.querySelector(".songinfo").innerHTML = `<div class="scroll-strip">
                        <span>${songName}</span>
                    </div>`
        document.querySelector(".timeinfo").innerHTML = "00:00 / 00:00"
    }
}

async function main() {

    await displayAlbums()

    const url = 'assets/music/Retro/';
    const songs = await getSongs(url);
    allSongs = songs;
    playMusic(songs[0].name, songs[0].songurl, true)

    let songList = document.querySelector(".song-list ul");

    for (const song of songs) {
        if ((song.songurl).endsWith(".mp3")) {
            const songName = song.name;
            const songURL = song.songurl;
            const author = song.author;

            songList.innerHTML += `
                <li data-url="${songURL}" data-name="${songName}">
                    <h3>${songName}</h3>
                    <p>added by ${author || "unknown"}</p>
                </li>`;
        }
    }

    // event for playing music

    songList.addEventListener("click", (e) => {
        const li = e.target.closest("li");
        if (li) {
            const songName = li.dataset.name;
            const songUrl = li.dataset.url;
            playMusic(songName, songUrl);
        } else {
            return;
        }
    });

    // Get folder by click
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async () => {
            currFolder = card.dataset.folder;
            const newUrl = `assets/music/${currFolder}/`;
            console.log("📁 Loading folder:", currFolder);
            loadSongsFromFolder(newUrl)
        })
    })

    // event listener for play pause and next
    play.addEventListener("click", () => {
        const index = allSongs.findIndex(song => currentSong.src.includes(song.songurl));
        if (currentSong.paused) {
            currentSong.play();
            play.src = "assets\\img\\002-pause.png";

            const index = allSongs.findIndex(song => song.songurl === decodeURI(currentSong.src));
            song_name = allSongs[index].name
            document.querySelector(".songinfo").innerHTML = `<div class="scroll-strip">
                        <span>${song_name}</span>
                    </div>`
            if (activeLi) activeLi.classList.add("song-active");

        } else {
            currentSong.pause();
            play.src = "assets\\img\\001-play-buttton.png";

            document.querySelectorAll(".song-list li").forEach(li =>
                li.classList.remove("song-active")
            );
        }
    });

    previous.addEventListener("click", () => {
        let index = allSongs.findIndex(song => currentSong.src.includes(song.songurl));

        if (index > 0) {
            playMusic(allSongs[index - 1].name, allSongs[index - 1].songurl);
        } else {
            playMusic(allSongs[index].name, allSongs[index].songurl);
        }
    })

    next.addEventListener("click", () => {
        let index = allSongs.findIndex(song => currentSong.src.includes(song.songurl));

        if (index < allSongs.length - 1) {
            playMusic(allSongs[index + 1].name, allSongs[index + 1].songurl);
        } else {
            index = 0
            playMusic(allSongs[index].name, allSongs[index].songurl);
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("input", (e) => {

        let v = Number(e.target.value);

        if (isNaN(v)) v = 0;
        currentSong.volume = v / 100

        if (currentSong.volume <= 0) {
            document.querySelector(".volume>img").src = "assets/img/002-volume-mute.png"
        } else {
            document.querySelector(".volume>img").src = "assets/img/001-volume.png"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        const progress =
            (currentSong.currentTime / currentSong.duration) * 100 || 0;

        document.querySelector(".timeinfo").innerHTML =
            `${secToMin(currentSong.currentTime)} / ${secToMin(currentSong.duration)}`;

        document.querySelector(".circle").style.left = progress + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    const menuBtn = document.querySelector(".ham");
    const leftPanel = document.querySelector(".left");

    menuBtn.addEventListener("click", () => {
        const isOpen = leftPanel.classList.contains("open");

        if (!isOpen) {
            leftPanel.style.left = 0;
            leftPanel.classList.add("open");
            menuBtn.src = "assets\\img\\close.png";
            menuBtn.style = "cursor : pointer"
        } else {
            leftPanel.style.left = "-100%";
            leftPanel.classList.remove("open");
            menuBtn.style = "cursor : pointer"
            menuBtn.src = "assets\\img\\hamburger.png";
        }
    });
}

main()