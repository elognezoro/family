// Configuration globale de l'application EduWeb

module.exports = {
  appName: 'EduWeb',
  appFullName: 'EduWeb — Family & Coaching',
  slogan: 'Apprendre • Progresser • Réussir ensemble',
  contact: {
    email: 'info@eduweb.ci',
    phone: '+225 01 5263 3030',
    whatsapp: '22552633030', // lien wa.me fourni
    ville: 'Abidjan, Côte d’Ivoire',
  },
  // Taux de conversion (cahier des charges)
  EUR_RATE: 656, // 1 EUR = 656 FCFA

  // ─── Tarifs OFFICIELS facturés aux familles (FCFA) ───
  // Seuls ces prix sont visibles par les parents.
  tarifsOfficiels: [
    {
      id: 'prescolaire',
      label: 'Préscolaire / Maternelle',
      montant: 50000,
      unite: 'par mois / apprenant',
      desc: 'Éveil, prélecture, prémathématiques et activités d’apprentissage.',
    },
    {
      id: 'primaire',
      label: 'Primaire',
      montant: 50000,
      unite: 'par mois / apprenant',
      desc: 'Accompagnement complet du CP1 au CM2, toutes matières.',
    },
    {
      id: 'secondaire',
      label: 'Secondaire',
      montant: 50000,
      unite: 'par discipline / mois',
      desc: 'Du collège au lycée, tarif par discipline choisie.',
    },
  ],

  // Plafond de la prétention salariale d'un coach (FCFA)
  // Primaire/Maternelle : par mois · Secondaire : par discipline / mois
  TARIF_COACH_MAX: 30000,

  // Tarification de référence interne (héritée du cahier des charges)
  tarifs: {
    prescolaire: { montant: 50000, unite: '/mois/apprenant' },
    primaire: { montant: 60000, unite: '/mois/apprenant' },
    secondaire: { min: 15000, max: 30000, unite: '/mois/discipline' },
  },

  operateurs: [
    { id: 'wave', label: 'Wave', color: '#1DC8F2' },
    { id: 'orange', label: 'Orange Money', color: '#FF7900' },
    { id: 'mtn', label: 'MTN MoMo', color: '#FFCC00' },
    { id: 'moov', label: 'Moov Money', color: '#0066B3' },
  ],

  modes: [
    { id: 'presentiel', label: 'Présentiel' },
    { id: 'visio', label: 'Visio' },
    { id: 'hybride', label: 'Hybride (Présentiel et/ou à distance)' },
  ],

  // Conversion FCFA -> EUR arrondie
  toEUR(fcfa) {
    if (!fcfa) return 0;
    return Math.round((fcfa / this.EUR_RATE) * 10) / 10;
  },

  formatFCFA(n) {
    if (n == null) return '0 FCFA';
    return Number(n).toLocaleString('fr-FR').replace(/ /g, ' ') + ' FCFA';
  },
};
