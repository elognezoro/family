// Notation multi-types des questions de la Préparation aux concours.
// Types : single (qcm / vrai_faux / trous / cas — un seul choix), multi
// (plusieurs bonnes réponses), association (appariement gauche→droite),
// classement (ordre correct). Les questions psychotechniques historiques
// n'ont pas de champ `type` : elles sont traitées comme un choix unique.

function typeDe(q) { return q.type || 'qcm'; }
function estMulti(q) { return typeDe(q) === 'multi'; }
function estAssociation(q) { return typeDe(q) === 'association'; }
function estClassement(q) { return typeDe(q) === 'classement'; }
function estSimple(q) { return !estMulti(q) && !estAssociation(q) && !estClassement(q); }

// Normalise et valide la réponse reçue du client. Retourne la réponse
// normalisée, `null` (question passée volontairement) ou `undefined` (invalide).
function validerReponse(q, rep) {
  if (rep === null || rep === undefined) return null;
  const entiers = (arr, max) => Array.isArray(arr)
    && arr.every((x) => Number.isInteger(x) && x >= 0 && x < max);

  if (estSimple(q)) {
    const n = Number(rep);
    return Number.isInteger(n) && n >= 0 && n < q.options.length ? n : undefined;
  }
  if (estMulti(q)) {
    if (!entiers(rep, q.options.length)) return undefined;
    return [...new Set(rep.map(Number))].sort((a, b) => a - b);
  }
  if (estAssociation(q)) {
    if (!entiers(rep, q.droite.length) || rep.length !== q.gauche.length) return undefined;
    return rep.map(Number);
  }
  if (estClassement(q)) {
    if (!entiers(rep, q.items.length) || rep.length !== q.items.length) return undefined;
    if (new Set(rep).size !== q.items.length) return undefined; // permutation stricte
    return rep.map(Number);
  }
  return undefined;
}

function estCorrect(q, rep) {
  if (rep === null || rep === undefined) return false;
  if (estSimple(q)) return rep === q.bonneReponse;
  if (estMulti(q)) {
    const bonnes = [...q.bonnesReponses].sort((a, b) => a - b);
    return Array.isArray(rep) && rep.length === bonnes.length && rep.every((v, i) => v === bonnes[i]);
  }
  if (estAssociation(q)) return Array.isArray(rep) && rep.length === q.appariement.length && rep.every((v, i) => v === q.appariement[i]);
  if (estClassement(q)) return Array.isArray(rep) && rep.length === q.ordre.length && rep.every((v, i) => v === q.ordre[i]);
  return false;
}

// La correction à renvoyer au client (entraînement) ou à afficher (résultat)
function correctionDe(q) {
  if (estMulti(q)) return { bonnesReponses: q.bonnesReponses };
  if (estAssociation(q)) return { appariement: q.appariement };
  if (estClassement(q)) return { ordre: q.ordre };
  return { bonneReponse: q.bonneReponse };
}

module.exports = { typeDe, estSimple, estMulti, estAssociation, estClassement, validerReponse, estCorrect, correctionDe };
