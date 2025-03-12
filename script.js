document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("audio-player");
    const playButton = document.querySelector(".play");
    const pauseButton = document.querySelector(".pause");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const songTitle = document.getElementById("song-title");
    const songImage = document.getElementById("song-image");
    const albumArt = document.querySelector(".album-art");

    const songs = [
        { title: "Lovely", src: "music/lovely.mp3", image: "images/a1.jpg" },
        { title: "Blinding Lights", src: "music/Blinding_Lights.mp3", image: "images/bhag.jpeg" },
        { title: "Bones - Imagine Dragons", src: "music/Bones.mp3", image: "images/a3.jpg" }
    ];

    // Get last played song index from localStorage (default to 0 if not found)
    let currentSongIndex = parseInt(localStorage.getItem("lastSongIndex")) || 0;

    function loadSong(index) {
        audio.src = songs[index].src;
        songTitle.textContent = `Now Playing: ${songs[index].title}`;
        songImage.src = songs[index].image;
        albumArt.style.background = `url('${songs[index].image}') center/cover no-repeat`;

        restartRotation(); // Restart rotation when a new song loads

        audio.load();
        audio.play()
            .then(() => console.log("Playing:", songs[index].title))
            .catch((error) => console.error("Error playing audio:", error));

        // Save current song index to localStorage
        localStorage.setItem("lastSongIndex", index);
    }

    // Function to restart rotation
    function restartRotation() {
        albumArt.style.animation = "none"; // Reset animation
        setTimeout(() => {
            albumArt.style.animation = "rotate 10s linear infinite";
        }, 10);
    }

    // Play Button Event
    playButton.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            restartRotation(); // Restart rotation when resuming play
        }
    });

    // Pause Button Event
    pauseButton.addEventListener("click", () => {
        audio.pause();
        albumArt.style.animation = "none"; // Stop rotation on pause
    });

    // Next Button Event
    nextButton.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
    });

    // Previous Button Event
    prevButton.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
    });

    // Automatically Play Next Song When Current One Ends
    audio.addEventListener("ended", () => {
        nextButton.click();
    });

    // Load the last played song when the page is refreshed
    loadSong(currentSongIndex);
});
