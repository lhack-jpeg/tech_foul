const images = document.getElementsByTagName('img');
for (const img of images) {
  img.addEventListener('error', function (event) {
    event.target.src = '/images/Dota-2-Logo.png';
    event.onerror = null;
  });
}
