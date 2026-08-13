// Jeux d'apprentissage « Fonction Publique » (§9 de la spécification).
// Jeux de données FIDÈLES au Statut général (loi n° 2023-892) — chaque item
// cite son article. Les jeux « Qui suis-je ? », « Millionnaire » et « Boss
// final » tirent leurs questions du cours et de la banque (dynamique).

const JEUX = [
  { id: 'quisuisje', titre: 'Qui suis-je ?', emoji: '🕵️', desc: 'Une règle apparaît : retrouvez son article. LA compétence de concours.', xpMax: 60 },
  { id: 'categories', titre: 'Bataille des catégories', emoji: '🏛️', desc: 'Classez les missions dans les catégories A, B ou C/D (art. 7-8).', xpMax: 50 },
  { id: 'adds', titre: 'ADDS Express', emoji: '🔀', desc: 'Activité, Détachement, Disponibilité, Sous les drapeaux : classez vite chaque situation (art. 53-67).', xpMax: 60 },
  { id: 'chrono', titre: 'Chrono 30-6-36-60', emoji: '⏰', desc: 'Retrouvez les durées légales : congés, sanctions, contrats.', xpMax: 50 },
  { id: 'conseil', titre: 'Conseil ou Commission ?', emoji: '⚖️', desc: 'Associez chaque compétence à son organisme consultatif (art. 39-45).', xpMax: 50 },
  { id: 'echelle', titre: 'Échelle disciplinaire', emoji: '📏', desc: 'Premier ou second degré ? Classez chaque sanction (art. 100).', xpMax: 50 },
  { id: 'millionnaire', titre: 'Millionnaire Fonction Publique', emoji: '💎', desc: '15 questions de difficulté croissante, 3 jokers. Jusqu’où irez-vous ?', xpMax: 100 },
  { id: 'boss', titre: 'Boss final', emoji: '🐉', desc: '20 questions, 3 vies. Une erreur coûte une vie — survivez !', xpMax: 120 },
];

// ─── Classement en catégories (art. 7-8) ───
const CATEGORIES = {
  colonnes: ['Catégorie A', 'Catégorie B', 'Catégories C ou D'],
  reference: 'Art. 7-8',
  items: [
    { texte: 'Concevoir un programme national', bonne: 0, ref: 'Art. 8' },
    { texte: 'Mener des études préalables à une réforme', bonne: 0, ref: 'Art. 8' },
    { texte: 'Diriger une structure administrative', bonne: 0, ref: 'Art. 8' },
    { texte: 'Superviser les services', bonne: 0, ref: 'Art. 8' },
    { texte: 'Appliquer la réglementation aux dossiers', bonne: 1, ref: 'Art. 8' },
    { texte: 'Mettre en application les directives reçues', bonne: 1, ref: 'Art. 8' },
    { texte: 'Exécuter les tâches courantes du service', bonne: 2, ref: 'Art. 8' },
    { texte: 'Réaliser des travaux d’exécution simples', bonne: 2, ref: 'Art. 8' },
  ],
};

// ─── ADDS Express (art. 53-67) ───
const ADDS = {
  colonnes: ['Activité', 'Détachement', 'Disponibilité', 'Sous les drapeaux'],
  reference: 'Art. 53-67',
  items: [
    { texte: 'Occupe effectivement son emploi après titularisation', bonne: 0, ref: 'Art. 54' },
    { texte: 'Est en congé annuel', bonne: 0, ref: 'Art. 54' },
    { texte: 'Suit un stage ou une formation', bonne: 0, ref: 'Art. 54' },
    { texte: 'En période d’instruction militaire, avec son traitement d’activité', bonne: 0, ref: 'Art. 67' },
    { texte: 'Interrompt temporairement ses fonctions pour exercer certains emplois ou mandats', bonne: 1, ref: 'Art. 55' },
    { texte: 'Est rémunéré par l’organisme d’accueil', bonne: 1, ref: 'Art. 59' },
    { texte: 'Conserve ses droits à avancement, promotion et retraite hors de son administration', bonne: 1, ref: 'Art. 55' },
    { texte: 'Suspend son activité à sa demande pour raisons personnelles', bonne: 2, ref: 'Art. 61' },
    { texte: 'Ne perçoit aucune rémunération, droits à avancement et retraite cessés', bonne: 2, ref: 'Art. 62' },
    { texte: 'Suit son conjoint fonctionnaire en poste à l’étranger (1 an renouvelable)', bonne: 2, ref: 'Art. 63' },
    { texte: 'S’occupe de son enfant victime d’un accident ou d’une maladie grave', bonne: 2, ref: 'Art. 63' },
    { texte: 'Incorporé pour accomplir le service légal, perçoit la solde militaire', bonne: 3, ref: 'Art. 66' },
  ],
};

// ─── Chrono des durées légales ───
const CHRONO = {
  reference: 'Art. 18, 89-92, 100',
  items: [
    { question: 'Durée du congé annuel rémunéré', options: ['20 jours', '30 jours', '45 jours', '60 jours'], bonne: 1, ref: 'Art. 89' },
    { question: 'Durée maximale du congé maladie de courte durée (sur 12 mois consécutifs)', options: ['3 mois', '6 mois', '9 mois', '12 mois'], bonne: 1, ref: 'Art. 90' },
    { question: 'Durée maximale du congé maladie de longue durée (y compris les 6 premiers mois)', options: ['12 mois', '24 mois', '36 mois', '48 mois'], bonne: 2, ref: 'Art. 91' },
    { question: 'Rémunération intégrale pendant le congé de longue durée : combien de mois ?', options: ['Les 6 premiers mois', 'Les 12 premiers mois', 'Les 24 premiers mois', 'Toute la durée'], bonne: 1, ref: 'Art. 91' },
    { question: 'Congé exceptionnel pour accident ou maladie professionnelle : durée maximale', options: ['24 mois', '36 mois', '48 mois', '60 mois'], bonne: 3, ref: 'Art. 92' },
    { question: 'Réduction de traitement (sanction du 1er degré) : maximum', options: ['25 % pendant 30 jours max', '50 % pendant 3 mois max', '25 % pendant 3 mois max', '10 % pendant 60 jours max'], bonne: 0, ref: 'Art. 100' },
    { question: 'Réduction de traitement (sanction du 2nd degré) : maximum', options: ['25 % pendant 30 jours max', '50 % pendant 3 mois max', '75 % pendant 1 mois max', '50 % pendant 6 mois max'], bonne: 1, ref: 'Art. 100' },
    { question: 'Exclusion temporaire (2nd degré) : durée maximale', options: ['3 mois', '6 mois', '12 mois', '24 mois'], bonne: 1, ref: 'Art. 100' },
    { question: 'Contrat de certains agents contractuels sur emplois A : durée et renouvellement', options: ['2 ans max, renouvelable une seule fois', '1 an max, renouvelable deux fois', '3 ans max, non renouvelable', 'Durée libre'], bonne: 0, ref: 'Art. 18' },
    { question: 'Disponibilité pour suivre son conjoint fonctionnaire à l’étranger', options: ['6 mois non renouvelables', '1 an renouvelable', '2 ans non renouvelables', '3 ans renouvelables'], bonne: 1, ref: 'Art. 63' },
  ],
};

// ─── Conseil ou Commission ? (art. 39-45) ───
const CONSEIL = {
  organismes: ['Comité Consultatif', 'Commission de Réforme', 'Commission Administrative de Recours', 'Conseil de Santé et Sécurité au Travail', 'Conseil de Discipline'],
  reference: 'Art. 39-45',
  items: [
    { texte: 'Questions d’ordre général intéressant les fonctionnaires', bonne: 0, ref: 'Art. 40' },
    { texte: 'Allocations temporaires d’invalidité', bonne: 1, ref: 'Art. 41' },
    { texte: 'Rentes pour accident ou maladie professionnelle', bonne: 1, ref: 'Art. 41' },
    { texte: 'Retraite pour invalidité', bonne: 1, ref: 'Art. 41' },
    { texte: 'Tableau annuel d’avancement de classe', bonne: 2, ref: 'Art. 42' },
    { texte: 'Licenciement pour insuffisance professionnelle', bonne: 2, ref: 'Art. 42' },
    { texte: 'Congés maladie et inaptitude physique ou mentale', bonne: 3, ref: 'Art. 43' },
    { texte: 'Reprise du travail après congé maladie', bonne: 3, ref: 'Art. 43' },
    { texte: 'Sanctions disciplinaires du second degré', bonne: 4, ref: 'Art. 44' },
    { texte: 'Demandes de retrait de sanctions disciplinaires', bonne: 4, ref: 'Art. 44' },
  ],
};

// ─── Échelle disciplinaire (art. 100) ───
const ECHELLE = {
  colonnes: ['Sanction du 1er degré', 'Sanction du 2nd degré'],
  reference: 'Art. 100',
  items: [
    { texte: 'Avertissement', bonne: 0, ref: 'Art. 100' },
    { texte: 'Blâme', bonne: 0, ref: 'Art. 100' },
    { texte: 'Déplacement d’office', bonne: 0, ref: 'Art. 100' },
    { texte: 'Radiation du tableau d’avancement (période de référence)', bonne: 0, ref: 'Art. 100' },
    { texte: 'Réduction de traitement de 25 % max pendant 30 jours max', bonne: 0, ref: 'Art. 100' },
    { texte: 'Réduction de traitement de 50 % max pendant 3 mois max', bonne: 1, ref: 'Art. 100' },
    { texte: 'Exclusion temporaire de 6 mois max', bonne: 1, ref: 'Art. 100' },
    { texte: 'Abaissement d’échelon', bonne: 1, ref: 'Art. 100' },
    { texte: 'Abaissement de classe', bonne: 1, ref: 'Art. 100' },
    { texte: 'Rétrogradation', bonne: 1, ref: 'Art. 100' },
    { texte: 'Révocation (avec ou sans suspension des droits à pension)', bonne: 1, ref: 'Art. 100' },
  ],
};

module.exports = { JEUX, CATEGORIES, ADDS, CHRONO, CONSEIL, ECHELLE };
