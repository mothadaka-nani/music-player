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

    function updateBackground(imageSrc) {
        document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${imageSrc}') center center / contain repeat fixed`;
    }  
    // 🎵 Song List
    const songs = [
        { title: "Lovely", src: "music/lovely.mp3", image: "images/a1.jpg" },
        { title: "Blinding Lights", src: "music/Blinding_Lights.mp3", image: "images/bhag.jpeg" },
        { title: "Bones - Imagine Dragons", src: "music/Bones.mp3", image: "images/a3.jpg" }
    ];

    let songIndex = parseInt(localStorage.getItem("lastSongIndex")) || 0;
    let isPlaying = false;
    let audio = new Audio(songs[songIndex].src);

    // 🎵 Load Song Details
    function loadSong(index) {
        const song = songs[index];
        songTitle.innerText = song.title;
        albumArt.src = song.image;
        audio.src = song.src;

        // 🌟 Update background image dynamically
        updateBackground(song.image);

        if (isPlaying) {
            audio.play();
            restartRotation();
        }

        // Save current song index
        localStorage.setItem("lastSongIndex", index);
    }

    // 🔄 Restart Album Rotation
    function restartRotation() {
        albumArt.style.animation = "none";
        setTimeout(() => {
            albumArt.style.animation = "rotate 10s linear infinite";
        }, 10);
    }

    // 🎵 Play/Pause Toggle
    playPauseBtn.addEventListener("click", () => {
        if (isPlaying) {
            audio.pause();
            playPauseIcon.innerText = "▶";
            albumArt.style.animationPlayState = "paused";
        } else {
            audio.play();
            playPauseIcon.innerText = "⏸";
            albumArt.style.animationPlayState = "running";
            restartRotation();
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

    // 🎵 When Song Ends, Play Next
    audio.addEventListener("ended", () => {
        playPauseIcon.innerText = "▶️";
        albumArt.style.animationPlayState = "paused";
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

    // ⏩ Forward 10 Seconds
    forwardBtn.addEventListener("click", () => {
        audio.currentTime += 10;
    });

    // ⏪ Backward 10 Seconds
    backwardBtn.addEventListener("click", () => {
        audio.currentTime -= 10;
    });

    // 🌟 Load last played song on refresh
    loadSong(songIndex);
});
