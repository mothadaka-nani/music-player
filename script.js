document.addEventListener("DOMContentLoaded", () => {
    const playPauseBtn = document.getElementById("play-pause");
    const playPauseIcon = document.getElementById("play-pause-icon");
    const albumArt = document.querySelector(".album-art img");
    const songTitle = document.getElementById("song-title");
    const progressBar = document.getElementById("progress-bar");
    const progressContainer = document.getElementById("progress-container");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const forwardBtn = document.getElementById("forward");
    const backwardBtn = document.getElementById("backward");

    // Song List Object
    const songs = [
        { title: "Lovely", src: "music/lovely.mp3", image: "images/a1.jpg" },
        { title: "Blinding Lights", src: "music/Blinding_Lights.mp3", image: "images/bhag.jpeg" },
        { title: "Bones - Imagine Dragons", src: "music/Bones.mp3", image: "images/a3.jpg" }
    ];

    // Get last played song index from localStorage (default to 0 if not found)
    let songIndex = parseInt(localStorage.getItem("lastSongIndex")) || 0;
    let isPlaying = false;
    let audio = new Audio(songs[songIndex].src);

    // 🎵 Load Song Details
    function loadSong(index) {
        const song = songs[index];
        songTitle.innerText = song.title;
        albumArt.src = song.image;
        audio.src = song.src;

        if (isPlaying) {
            audio.play();
            restartRotation(); // Restart rotation when a new song loads
        }

        // Save current song index to localStorage
        localStorage.setItem("lastSongIndex", index);
    }

    // 🔄 Restart Rotation
    function restartRotation() {
        albumArt.style.animation = "none"; // Reset animation
        setTimeout(() => {
            albumArt.style.animation = "rotate 10s linear infinite";
        }, 10);
    }

    // 🎵 Play/Pause Toggle
    playPauseBtn.addEventListener("click", () => {
        if (isPlaying) {
            audio.pause();
            playPauseIcon.innerText = "▶️"; // Change to play icon
            albumArt.style.animationPlayState = "paused"; // Pause rotation
        } else {
            audio.play();
            playPauseIcon.innerText = "⏸️"; // Change to pause icon
            albumArt.style.animationPlayState = "running"; // Resume rotation
            restartRotation(); // Restart rotation when resuming play
        }
        isPlaying = !isPlaying;
    });

    // 🎼 Update Progress Bar
    audio.addEventListener("timeupdate", () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
    });

    // 📍 Seek in Song
    progressContainer.addEventListener("click", (e) => {
        const clickX = e.offsetX;
        const width = progressContainer.clientWidth;
        audio.currentTime = (clickX / width) * audio.duration;
    });

    // 🎵 Reset Play Button When Song Ends
    audio.addEventListener("ended", () => {
        playPauseIcon.innerText = "▶️";
        albumArt.style.animationPlayState = "paused"; // Stop rotation
        isPlaying = false;
        nextSong();
    });

    // ⏭️ Next Song
    nextBtn.addEventListener("click", nextSong);

    function nextSong() {
        songIndex = (songIndex + 1) % songs.length;
        loadSong(songIndex);
        if (isPlaying) {
            audio.play();
        }
    }

    // ⏮️ Previous Song
    prevBtn.addEventListener("click", prevSong);

    function prevSong() {
        songIndex = (songIndex - 1 + songs.length) % songs.length;
        loadSong(songIndex);
        if (isPlaying) {
            audio.play();
        }
    }

    // ⏩ 10 Seconds Forward
    forwardBtn.addEventListener("click", () => {
        audio.currentTime += 10;
    });

    // ⏪ 10 Seconds Backward
    backwardBtn.addEventListener("click", () => {
        audio.currentTime -= 10;
    });

    // Load the last played song when the page is refreshed
    loadSong(songIndex);
});