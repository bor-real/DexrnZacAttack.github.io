const video = document.getElementById("background-video");

video.addEventListener("ended", () => {
  video.style.display = "none";
});
