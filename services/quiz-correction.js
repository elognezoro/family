// Correction CÔTÉ SERVEUR d'une réponse à une question de chant (data/chants.js).
// Même logique que public/js/chant-quiz.js, mais ici les corrigés ne quittent
// jamais le serveur : c'est ce qui rend le mode compétition équitable.

// Réponses courtes : minuscules, sans accents ni ponctuation
function normaliser(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const enListe = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : [v]);

// `reponse` : valeur brute du formulaire (chaîne ou tableau de chaînes).
// Renvoie true si la réponse est juste, false sinon (vide = faux).
function estJuste(q, reponse) {
  switch (q.type) {
    case 'qcu': {
      const j = parseInt(enListe(reponse)[0], 10);
      return Number.isInteger(j) && j === q.bonne;
    }
    case 'qcm': {
      const choisis = enListe(reponse).map((v) => parseInt(v, 10)).filter(Number.isInteger).sort((a, b) => a - b);
      const bonnes = (q.bonnes || []).slice().sort((a, b) => a - b);
      return choisis.length === bonnes.length && choisis.every((v, k) => v === bonnes[k]);
    }
    case 'vraifaux': {
      const v = enListe(reponse)[0];
      return (v === 'vrai' && q.bonne === true) || (v === 'faux' && q.bonne === false);
    }
    case 'courte': {
      const texte = normaliser(enListe(reponse)[0]);
      if (!texte) return false;
      return (q.motsCles || []).every((groupe) => groupe.some((variante) => texte.indexOf(normaliser(variante)) !== -1));
    }
    case 'classement': {
      // ordre cliqué « 2,0,1,3 » → indices des items dans l'ordre choisi
      const seq = String(enListe(reponse)[0] || '').split(',').map((v) => parseInt(v, 10)).filter(Number.isInteger);
      return seq.length === q.items.length && seq.every((v, k) => v === q.ordre[k]);
    }
    default:
      return false;
  }
}

// Version « sans corrigé » d'une question, à envoyer au navigateur en compétition
function pourCompetiteur(q) {
  return {
    type: q.type,
    question: q.question,
    image: q.image || null,
    imageAlt: q.imageAlt || null,
    options: q.options || null,
    items: q.items || null,
  };
}

module.exports = { normaliser, estJuste, pourCompetiteur };
