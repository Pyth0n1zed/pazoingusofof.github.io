let triggered = false;

export function checkLarp(url: string) {
  if (triggered || !url.toLowerCase().includes("larp")) return;
  triggered = true;

  const video = document.createElement("video");
  video.src = "https://file.garden/afgYrMB4MBX1SKRv/tiktok_timandmichael4_7636472027775257878.mp4";
  video.autoplay = true;
  video.style.position = "fixed";
  video.style.top = "0";
  video.style.left = "0";
  video.style.width = "100vw";
  video.style.height = "100vh";
  video.style.objectFit = "cover";
  video.style.opacity = "0.25";
  video.style.pointerEvents = "none";
  video.style.zIndex = "999999";
  video.volume = 0.25;

  video.onended = () => {
    video.remove();
  };

  document.body.appendChild(video);
  video.play().catch(err => console.error("Easter egg video failed to play:", err));
}
