// Disciplines — taxonomie hiérarchique { id, cycle, domaine, matiere }
// cycle correspond aux ids de data/niveaux.js

const disciplines = [
  // ─── Préscolaire ───
  { id: 'pre_langage', cycle: 'prescolaire', domaine: 'Éveil', matiere: 'Éveil au langage' },
  { id: 'pre_prelecture', cycle: 'prescolaire', domaine: 'Éveil', matiere: 'Prélecture' },
  { id: 'pre_preecriture', cycle: 'prescolaire', domaine: 'Éveil', matiere: 'Préécriture' },
  { id: 'pre_premaths', cycle: 'prescolaire', domaine: 'Éveil', matiere: 'Prémathématiques' },
  { id: 'pre_motricite', cycle: 'prescolaire', domaine: 'Éveil', matiere: 'Activités motrices' },
  { id: 'pre_artistique', cycle: 'prescolaire', domaine: 'Éveil', matiere: 'Éducation artistique' },
  { id: 'pre_scientifique', cycle: 'prescolaire', domaine: 'Éveil', matiere: 'Éveil scientifique' },

  // ─── Primaire ───
  { id: 'pri_fr_lecture', cycle: 'primaire', domaine: 'Français', matiere: 'Lecture' },
  { id: 'pri_fr_expression', cycle: 'primaire', domaine: 'Français', matiere: 'Expression écrite' },
  { id: 'pri_fr_grammaire', cycle: 'primaire', domaine: 'Français', matiere: 'Grammaire' },
  { id: 'pri_fr_conjugaison', cycle: 'primaire', domaine: 'Français', matiere: 'Conjugaison' },
  { id: 'pri_fr_orthographe', cycle: 'primaire', domaine: 'Français', matiere: 'Orthographe' },
  { id: 'pri_fr_vocabulaire', cycle: 'primaire', domaine: 'Français', matiere: 'Vocabulaire' },
  { id: 'pri_maths', cycle: 'primaire', domaine: 'Mathématiques', matiere: 'Mathématiques' },
  { id: 'pri_edhc', cycle: 'primaire', domaine: 'EDHC', matiere: 'Éducation aux Droits de l’Homme et à la Citoyenneté' },
  { id: 'pri_sciences', cycle: 'primaire', domaine: 'Sciences', matiere: 'Sciences & Technologie' },
  { id: 'pri_histgeo', cycle: 'primaire', domaine: 'Histoire-Géo', matiere: 'Histoire-Géographie' },
  { id: 'pri_anglais', cycle: 'primaire', domaine: 'Langues', matiere: 'Anglais' },
  { id: 'pri_eps', cycle: 'primaire', domaine: 'EPS', matiere: 'Éducation Physique et Sportive' },
  { id: 'pri_aec', cycle: 'primaire', domaine: 'Arts', matiere: 'Activités d’Expression et de Création (AEC)' },

  // ─── Secondaire 1er cycle (Collège) ───
  { id: 's1_francais', cycle: 'secondaire1', domaine: 'Langues', matiere: 'Français' },
  { id: 's1_anglais', cycle: 'secondaire1', domaine: 'Langues', matiere: 'Anglais' },
  { id: 's1_espagnol', cycle: 'secondaire1', domaine: 'Langues', matiere: 'Espagnol' },
  { id: 's1_allemand', cycle: 'secondaire1', domaine: 'Langues', matiere: 'Allemand' },
  { id: 's1_maths', cycle: 'secondaire1', domaine: 'Mathématiques', matiere: 'Mathématiques' },
  { id: 's1_pc', cycle: 'secondaire1', domaine: 'Sciences', matiere: 'Physique-Chimie' },
  { id: 's1_svt', cycle: 'secondaire1', domaine: 'Sciences', matiere: 'SVT' },
  { id: 's1_histgeo', cycle: 'secondaire1', domaine: 'Sciences humaines', matiere: 'Histoire-Géographie' },
  { id: 's1_tic', cycle: 'secondaire1', domaine: 'Technologie', matiere: 'TIC / Informatique' },
  { id: 's1_arts', cycle: 'secondaire1', domaine: 'Arts', matiere: 'Arts plastiques' },
  { id: 's1_musique', cycle: 'secondaire1', domaine: 'Arts', matiere: 'Musique' },
  { id: 's1_eps', cycle: 'secondaire1', domaine: 'EPS', matiere: 'Éducation Physique et Sportive' },

  // ─── Secondaire 2nd cycle — Général (Lycée) ───
  { id: 's2_francais', cycle: 'secondaire2_general', domaine: 'Langues', matiere: 'Français' },
  { id: 's2_anglais', cycle: 'secondaire2_general', domaine: 'Langues', matiere: 'Anglais' },
  { id: 's2_espagnol', cycle: 'secondaire2_general', domaine: 'Langues', matiere: 'Espagnol' },
  { id: 's2_allemand', cycle: 'secondaire2_general', domaine: 'Langues', matiere: 'Allemand' },
  { id: 's2_maths', cycle: 'secondaire2_general', domaine: 'Mathématiques', matiere: 'Mathématiques' },
  { id: 's2_pc', cycle: 'secondaire2_general', domaine: 'Sciences', matiere: 'Physique-Chimie' },
  { id: 's2_svt', cycle: 'secondaire2_general', domaine: 'Sciences', matiere: 'SVT' },
  { id: 's2_histgeo', cycle: 'secondaire2_general', domaine: 'Sciences humaines', matiere: 'Histoire-Géographie' },
  { id: 's2_philo', cycle: 'secondaire2_general', domaine: 'Sciences humaines', matiere: 'Philosophie' },
  { id: 's2_tic', cycle: 'secondaire2_general', domaine: 'Technologie', matiere: 'TIC / Informatique / IA' },
  { id: 's2_arts', cycle: 'secondaire2_general', domaine: 'Arts', matiere: 'Arts' },
  { id: 's2_musique', cycle: 'secondaire2_general', domaine: 'Arts', matiere: 'Musique' },
  { id: 's2_eps', cycle: 'secondaire2_general', domaine: 'EPS', matiere: 'Éducation Physique et Sportive' },

  // ─── Secondaire 2nd cycle — Technique ───
  { id: 'st_maths', cycle: 'secondaire2_technique', domaine: 'Mathématiques', matiere: 'Mathématiques appliquées' },
  { id: 'st_compta', cycle: 'secondaire2_technique', domaine: 'Gestion', matiere: 'Comptabilité' },
  { id: 'st_eco', cycle: 'secondaire2_technique', domaine: 'Gestion', matiere: 'Économie / Droit' },
  { id: 'st_tic', cycle: 'secondaire2_technique', domaine: 'Technologie', matiere: 'Informatique de gestion' },
  { id: 'st_techno', cycle: 'secondaire2_technique', domaine: 'Technologie', matiere: 'Technologie industrielle' },
  { id: 'st_francais', cycle: 'secondaire2_technique', domaine: 'Langues', matiere: 'Français' },
  { id: 'st_anglais', cycle: 'secondaire2_technique', domaine: 'Langues', matiere: 'Anglais' },

  // ─── Connaissances générales (transversal — élèves & parents) ───
  // Spécialités définies dans data/niveaux.js (source unique) : chaque spécialité
  // est aussi une discipline tarifable et recherchable.
  ...require('./niveaux').connaissancesSpecialites.map((s) => ({
    id: 'cgd_' + s.slug, cycle: 'connaissances_generales', domaine: s.domaine, matiere: s.label,
  })),
];

function disciplinesByCycle(cycleId) {
  return disciplines.filter((d) => d.cycle === cycleId);
}

function getDiscipline(id) {
  return disciplines.find((d) => d.id === id);
}

function disciplineLabel(id) {
  const d = getDiscipline(id);
  return d ? d.matiere : id;
}

// Regroupé par cycle puis par domaine (pour les accordéons)
function disciplinesGrouped() {
  const cycles = require('./niveaux').cycles;
  return cycles
    .map((c) => {
      const items = disciplinesByCycle(c.id);
      const domaines = {};
      items.forEach((d) => {
        (domaines[d.domaine] = domaines[d.domaine] || []).push(d);
      });
      return {
        cycle: c.id,
        cycleLabel: c.label,
        domaines: Object.entries(domaines).map(([nom, items]) => ({ nom, items })),
      };
    })
    .filter((g) => g.domaines.length > 0);
}

module.exports = {
  disciplines,
  disciplinesByCycle,
  getDiscipline,
  disciplineLabel,
  disciplinesGrouped,
};
