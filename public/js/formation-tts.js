// EduWeb Formation — lecture audio des consignes et contenus (Web Speech API)
// Boutons : <button class="tts-btn" data-tts-target="#selector"> ou data-tts="texte"
// API globale : window.eduTTS.speak(texte, btn) / stop()

(function () {
  var synth = window.speechSynthesis;
  var current = null; // bouton actif

  function frVoice() {
    if (!synth) return null;
    var voices = synth.getVoices() || [];
    return voices.find(function (v) { return /^fr(-|_)/i.test(v.lang) && /FR/i.test(v.lang); })
        || voices.find(function (v) { return /^fr/i.test(v.lang); })
        || null;
  }

  function stop() {
    if (synth) synth.cancel();
    if (current) { current.classList.remove('tts-btn--on'); current = null; }
  }

  function speak(text, btn) {
    if (!synth) {
      alert('La lecture audio n’est pas disponible sur cet appareil.');
      return;
    }
    if (current === btn) { stop(); return; } // second clic = stop
    stop();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    var v = frVoice();
    if (v) u.voice = v;
    u.rate = 0.95; // léger ralenti : public peu habitué à l'écoute rapide
    u.onend = stop;
    u.onerror = stop;
    current = btn || null;
    if (btn) btn.classList.add('tts-btn--on');
    synth.speak(u);
  }

  function textOf(el) {
    // innerText garde les retours à la ligne visibles (listes, étapes)
    return (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.tts-btn');
    if (!btn) return;
    e.preventDefault();
    var text = btn.getAttribute('data-tts');
    if (!text) {
      var sel = btn.getAttribute('data-tts-target');
      var el = sel && document.querySelector(sel);
      if (el) text = textOf(el);
    }
    if (text) speak(text, btn);
  });

  // Stopper la lecture quand on quitte la page
  window.addEventListener('beforeunload', stop);

  // Chrome charge les voix en différé
  if (synth && synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = function () { /* voix prêtes */ };
  }

  window.eduTTS = { speak: speak, stop: stop };
})();
