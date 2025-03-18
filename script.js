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
    const playlistBtn = document.getElementById("playlist-btn");
    const playlistSidebar = document.getElementById("playlist-sidebar");
    const playlist = document.getElementById("playlist");

    function updateBackground(imageSrc) {
        document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${imageSrc}') center center / contain repeat fixed`;
    }

    const songs = [
        { title: "Lovely", src: "music/lovely.mp3", image: "images/a1.jpg" },
        { title: "Blinding Lights", src: "music/Blinding_Lights.mp3", image: "images/bhag.jpeg" },
        { title: "Bones - Imagine Dragons", src: "music/Bones.mp3", image: "images/a3.jpg" }
    ];

    let songIndex = parseInt(localStorage.getItem("lastSongIndex")) || 0;
    let isPlaying = false;
    let audio = new Audio(songs[songIndex].src);

    // Load song
    function loadSong(index) {
        const song = songs[index];
        songTitle.innerText = song.title;
        albumArt.src = song.image;
        audio.src = song.src;
        updateBackground(song.image);

        if (isPlaying) {
            audio.play();
            restartRotation();
        }

        // Highlight the currently playing song in the playlist
        updatePlaylistHighlight(index);
        localStorage.setItem("lastSongIndex", index);
    }

    // Update playlist highlight
    function updatePlaylistHighlight(index) {
        const playlistItems = playlist.querySelectorAll("li");
        playlistItems.forEach((item, i) => {
            item.classList.toggle("playing", i === index);
        });
    }

    // Toggle playlist sidebar
    playlistBtn.addEventListener("click", () => {
        playlistSidebar.classList.toggle("active");
    });

    // Populate playlist
    songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.innerText = song.title;
        li.addEventListener("click", () => {
            songIndex = index;
            loadSong(songIndex);
            if (isPlaying) audio.play();
        });
        playlist.appendChild(li);
    });

    // Restart album art rotation
    function restartRotation() {
        albumArt.style.animation = "none";
        setTimeout(() => {
            albumArt.style.animation = "rotate 10s linear infinite";
        }, 10);
    }

    // Play/Pause functionality
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

    // Update progress bar
    audio.addEventListener("timeupdate", () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
    });

    // Seek functionality
    progressContainer.addEventListener("click", (e) => {
        const clickX = e.offsetX;
        const width = progressContainer.clientWidth;
        audio.currentTime = (clickX / width) * audio.duration;
    });

    // Handle song end
    audio.addEventListener("ended", () => {
        playPauseIcon.innerText = "▶";
        albumArt.style.animationPlayState = "paused";
        isPlaying = false;
        nextSong();
    });

    // Next song
    nextBtn.addEventListener("click", nextSong);
    function nextSong() {
        songIndex = (songIndex + 1) % songs.length;
        loadSong(songIndex);
        if (isPlaying) {
            audio.play();
        }
    }

    // Previous song
    prevBtn.addEventListener("click", prevSong);
    function prevSong() {
        songIndex = (songIndex - 1 + songs.length) % songs.length;
        loadSong(songIndex);
        if (isPlaying) {
            audio.play();
        }
    }

    // Forward 10 seconds
    forwardBtn.addEventListener("click", () => {
        audio.currentTime += 10;
    });

    // Backward 10 seconds
    backwardBtn.addEventListener("click", () => {
        audio.currentTime -= 10;
    });

    // Load the initial song
    loadSong(songIndex);
});