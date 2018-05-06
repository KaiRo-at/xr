window.onload = function() {
  document.querySelector('a-sphere').addEventListener('click', function (event) {
    if (event.target.getAttribute('color') != '#FF6600') {
      event.target.setAttribute('color', '#FF6600');
    }
    else {
      event.target.setAttribute('color', '#EF2D5E');
    }
  });
}
