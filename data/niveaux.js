// Niveaux d'enseignement — système éducatif ivoirien

const cycles = [
  { id: 'prescolaire', label: 'Préscolaire' },
  { id: 'primaire', label: 'Primaire' },
  { id: 'secondaire1', label: 'Secondaire 1er cycle (Collège)' },
  { id: 'secondaire2_general', label: 'Secondaire 2nd cycle — Général (Lycée)' },
  { id: 'secondaire2_technique', label: 'Secondaire 2nd cycle — Technique' },
];

const niveaux = [
  { id: 'prescolaire', cycle: 'prescolaire', label: 'Préscolaire' },

  { id: 'cp1', cycle: 'primaire', label: 'CP1' },
  { id: 'cp2', cycle: 'primaire', label: 'CP2' },
  { id: 'ce1', cycle: 'primaire', label: 'CE1' },
  { id: 'ce2', cycle: 'primaire', label: 'CE2' },
  { id: 'cm1', cycle: 'primaire', label: 'CM1' },
  { id: 'cm2', cycle: 'primaire', label: 'CM2' },

  { id: '6e', cycle: 'secondaire1', label: '6ème' },
  { id: '5e', cycle: 'secondaire1', label: '5ème' },
  { id: '4e', cycle: 'secondaire1', label: '4ème' },
  { id: '3e', cycle: 'secondaire1', label: '3ème' },

  { id: '2nde', cycle: 'secondaire2_general', label: 'Seconde', series: ['A', 'C'] },
  { id: '1ere', cycle: 'secondaire2_general', label: 'Première', series: ['A', 'C', 'D'] },
  { id: 'tle', cycle: 'secondaire2_general', label: 'Terminale', series: ['A', 'C', 'D'] },

  { id: '2nde_tech', cycle: 'secondaire2_technique', label: 'Seconde technique', series: ['G1', 'G2', 'F'] },
  { id: '1ere_tech', cycle: 'secondaire2_technique', label: 'Première technique', series: ['G1', 'G2', 'F'] },
  { id: 'tle_tech', cycle: 'secondaire2_technique', label: 'Terminale technique', series: ['G1', 'G2', 'F'] },
];

function niveauxByCycle(cycleId) {
  return niveaux.filter((n) => n.cycle === cycleId);
}

function getNiveau(id) {
  return niveaux.find((n) => n.id === id);
}

function niveauLabel(id) {
  const n = getNiveau(id);
  return n ? n.label : id;
}

function cycleLabel(id) {
  const c = cycles.find((c) => c.id === id);
  return c ? c.label : id;
}

// Regroupe les niveaux par cycle (pour les accordéons)
function niveauxGrouped() {
  return cycles
    .map((c) => ({ ...c, niveaux: niveauxByCycle(c.id) }))
    .filter((g) => g.niveaux.length > 0);
}

module.exports = {
  cycles,
  niveaux,
  niveauxByCycle,
  getNiveau,
  niveauLabel,
  cycleLabel,
  niveauxGrouped,
};
