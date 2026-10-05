/* Bei Ling Temple background music.
 *
 * One audio element per page: <audio id="bgm" loop>.
 * Playback starts only through play(), never through unmuted autoplay.
 *
 * Homepage (index.html) shows #enterGate. This file does not start music
 * there; the gate calls BeiLingBgm.play() on tap, click, Enter, or Space.
 *
 * Content pages under pages/ do not repeat that full-screen gate. Visitors
 * normally arrive after tapping「點擊進入」on the homepage, and Chrome and
 * Firefox then allow sound on later pages of the same site. play() is still
 * attempted on load. If the browser blocks it (a direct visit, or Safari),
 * the next pointer press or Enter/Space on that page starts the loop.
 *
 * pages/p09_videos.html has no #bgm on purpose, so ceremony films are not
 * covered by the temple track. The unused player.html stubs are left alone.
 */
(function () {
  var audio = document.getElementById('bgm');
  if (!audio) return;

  audio.loop = true;

  function play() {
    try {
      audio.muted = false;
      var pending = audio.play();
      if (pending && typeof pending.then === 'function') {
        return pending.then(
          function () { return true; },
          function () { return false; }
        );
      }
      return Promise.resolve(!audio.paused);
    } catch (err) {
      return Promise.resolve(false);
    }
  }

  window.BeiLingBgm = { play: play };

  if (document.getElementById('enterGate')) return;

  var armed = false;

  function disarm() {
    if (!armed) return;
    armed = false;
    window.removeEventListener('pointerdown', onGesture, true);
    window.removeEventListener('keydown', onGesture, true);
  }

  function onGesture(event) {
    if (event.type === 'keydown') {
      var key = event.key;
      if (key !== 'Enter' && key !== ' ' && key !== 'Spacebar') return;
    }
    /* play() must run in this gesture turn; the promise only removes listeners. */
    play().then(function (ok) {
      if (ok) disarm();
    });
  }

  function arm() {
    if (armed) return;
    armed = true;
    window.addEventListener('pointerdown', onGesture, true);
    window.addEventListener('keydown', onGesture, true);
  }

  /* Arm before the first play() settles so an early tap is not missed. */
  arm();
  play().then(function (ok) {
    if (ok) disarm();
  });
})();
