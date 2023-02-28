const images = document.getElementsByTagName('img');
for (const i of images) {
  i.addEventListener('error', function (event) {
    event.target.src = '/images/Dota-2-Logo.png';
    event.onerror = null;
  });
}
