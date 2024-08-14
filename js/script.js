console.log("Js is  Working Brother");
let currentSong = new Audio();
let song;
let currFolder;
let currentVolume;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let responce = await a.text();
  // console.log(responce);
  let div = document.createElement("div");
  div.innerHTML = responce;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  //listing all the song in library
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
        <img class="listImage" src="assets/svg/music.svg" alt="">
        <div class="info">
        <div> ${song.replaceAll("%20", " ")} </div>
        <div>Susi</div>
        </div>
        <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="assets/svg/play-library.svg" alt="">
        </div>
   </li>`;
  }

  // attach a event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "assets/newsvg/playing.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let responce = await a.text();
  // console.log(responce);
  let div = document.createElement("div");
  div.innerHTML = responce;

  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");

  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0];
      //get the meta data of the folder from info.json and cover.png(img)  file
      let a = await fetch(`/songs/${folder}/info.json`);
      let responce = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `
      <div data-folder="${folder}" class="card">
        <div  class="play">
            <img src="assets/svg/play-main.svg" alt="">
        </div>
        <img src="/songs/${folder}/cover.png" alt="cover">
        <h2>${responce.title}</h2>
        <p>${responce.description}</p>
      </div>`;
    }
  }

  // card click to audio list load
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      // console.log(item,item.currentTarget.dataset)
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  //get the list of all the songs
  await getSongs("songs/ncs");
  playMusic(songs[0], true);

  //display song folders as album
  displayAlbums();

  //play the first song
  //   var audio = new Audio();
  //   audio.play(songs[0]);

  //get duration
  //   audio.addEventListener("onetimeupdate", () => {
  //     console.log(audio.duration, audio.currentSrc, audio.currentTime);
  //   });

  //attach event listener to play next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "assets/newsvg/playing.svg";
    } else {
      currentSong.pause();
      play.src = "assets/svg/play-green.svg";
    }
  });

  // function updatePlayIcon() {
  //   if (currentSong.paused) {
  //       play.src = "assets/svg/play-green.svg"; // SVG for paused state
  //   } else {
  //       play.src = "assets/newsvg/playing.svg"; // SVG for playing state
  //   }
  // }

  // Add event listeners to the audio element
  // currentSong.addEventListener('play', updatePlayIcon);
  // currentSong.addEventListener('pause', updatePlayIcon);

  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime,currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;

    // for moving the seek bar
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
    // console.log( document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%")
  });

  //add an event listener to seek bar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    // percent=percent-1;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (percent * currentSong.duration) / 100;
  });

  //add a event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
  //add a event listener for previous and next
  previous.addEventListener("click", () => {
    // console.log("Previous Click")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // console.log(songs, index)
    if (index - 1 >= 0) {
      // console.log("true");
      playMusic(songs[index - 1]);
    }
    // else{
    //   console.log("false");

    // }
  });
  next.addEventListener("click", () => {
    // console.log("next Click")
    // console.log(currentSong.src.split("/songs/")[1])
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // console.log(songs, index)
    // console.log(index+1 + "  < " + songs.length);
    if (index + 1 < songs.length) {
      // console.log("true");
      playMusic(songs[index + 1]);
    }
    // else{
    //   console.log("false");

    // }
  });

  //volume control bar
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      // console.log(e)
      currentVolume = parseInt(e.target.value) / 100;
      currentSong.volume = currentVolume;
      if (currentSong.volume > 0) {
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace(
          "assets/svg/mute.svg",
          "assets/svg/volume.svg"
        );
      }
      // console.log("from seek bar ", currentVolume);
      // console.log("from seek bar ", parseFloat(currentVolume));
    });

  // for muting the track
  // document.querySelector(".volume>img").addEventListener("click", (e) => {
  //   if (e.target.src.includes("assets/svg/volume.svg")) {
  //     e.target.src = e.target.src.replace(
  //       "assets/svg/volume.svg",
  //       "assets/svg/mute.svg"
  //     );
  //     currentSong.volume = 0;
  //   } else {
  //     e.target.src = e.target.src.replace(
  //       "assets/svg/mute.svg",
  //       "assets/svg/volume.svg"
  //     );
  //     // currentSong.volume = .10;
  //   }
  // })
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    const volumeIcon = e.target;
    if (volumeIcon.src.includes("assets/svg/volume.svg")) {
      volumeIcon.src = volumeIcon.src.replace(
        "assets/svg/volume.svg",
        "assets/svg/mute.svg"
      );
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
      currentSong.volume = 0;
      // currentSong.muted = true; // Setting the muted state
    } else {
      volumeIcon.src = volumeIcon.src.replace(
        "assets/svg/mute.svg",
        "assets/svg/volume.svg"
      );
      // console.log("from 1 mute bar ", currentVolume);
      document.querySelector(".range").getElementsByTagName("input")[0].value =
        currentVolume * 100;
      // console.log("from 2 mute bar ", currentVolume);
      currentSong.volume = currentVolume;
      // currentSong.muted = false; // Unmuting the track
    }

    // Updating UI based on mute state
    // volumeIcon.alt = currentSong.muted ? "Unmute" : "Mute";

    // Adding aria-label for accessibility
    // volumeIcon.setAttribute(
    //   "aria-label",
    //   currentSong.muted ? "Unmute" : "Mute"
    // );
  });
}

main();
