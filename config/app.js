// Configuration globale de l'application EduWeb

// Taux de change (optionnel) pour un EUR_RATE dynamique
let _fx = null;
try { _fx = require('../services/fxrates'); } catch (e) { /* repli statique */ }
const EUR_RATE_FALLBACK = 656; // 1 € = 656 FCFA (parité de secours)

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
  // Taux de conversion EUR↔FCFA — DYNAMIQUE (taux XOF en direct), repli 656
  get EUR_RATE() {
    if (_fx) {
      _fx.ensureFresh(); // rafraîchit si nécessaire (non bloquant)
      const r = _fx.getRate('XOF');
      if (r) return Math.round(r * 100) / 100; // ex. 655.96
    }
    return EUR_RATE_FALLBACK;
  },

  // ─── Modèle de tarification (marketplace horaire) ───
  // Le coach fixe librement son tarif HORAIRE (FCFA/heure), au-dessus d'un minimum.
  // La facture mensuelle du parent = tarif horaire × engagement mensuel minimum.
  // La plateforme reverse coachSharePct % au coach.
  pricing: {
    minHoraire: { prescolaire: 2500, primaire: 2500, secondaire: 5000, connaissances: 2500 }, // FCFA/h minimum
    engagementMensuel: { prescolaire: 12, primaire: 12, secondaire: 16, connaissances: 8 }, // heures/mois minimum
    coachSharePct: 80, // % reversé au coach (plateforme : 20 %)
  },

  // Famille de cycle : 'prescolaire' | 'primaire' | 'secondaire' | 'connaissances'
  cycleFamily(cycleId) {
    if (cycleId === 'prescolaire') return 'prescolaire';
    if (cycleId === 'primaire') return 'primaire';
    if (cycleId === 'connaissances_generales') return 'connaissances';
    return 'secondaire'; // secondaire1, secondaire2_general, secondaire2_technique
  },
  minHoraire(cycleId) { return this.pricing.minHoraire[this.cycleFamily(cycleId)]; },
  engagementMensuel(cycleId) { return this.pricing.engagementMensuel[this.cycleFamily(cycleId)]; },
  // Facture mensuelle = tarif horaire × engagement mensuel du cycle
  factureMensuelle(tarifHoraire, cycleId) {
    return Math.round((tarifHoraire || 0) * this.engagementMensuel(cycleId));
  },
  // Part reversée au coach
  partCoach(montant) {
    return Math.round((montant || 0) * this.pricing.coachSharePct / 100);
  },
  // Part de la plateforme (EduWeb)
  partPlateforme(montant) {
    return (montant || 0) - this.partCoach(montant);
  },
  // Commission du parrain : referralPct % de la part plateforme
  referralPct: 10,
  partCommercial(montant) {
    return Math.round(this.partPlateforme(montant) * this.referralPct / 100);
  },

  // ─── Conversions multi-devises (base FCFA / XOF) ───
  // local → FCFA : local / perEUR * 656
  fcfaFromLocal(local, perEUR) {
    return Math.round((Number(local || 0) / (perEUR || this.EUR_RATE)) * this.EUR_RATE);
  },
  // FCFA → devise locale
  localFromFcfa(fcfa, perEUR) {
    return Math.round((Number(fcfa || 0) / this.EUR_RATE) * (perEUR || this.EUR_RATE));
  },
  // Formatage dans une devise donnée (symbole)
  formatLocal(amount, symbol) {
    return Number(amount || 0).toLocaleString('fr-FR') + ' ' + (symbol || 'FCFA');
  },

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

  // Équivalent en euros formaté (ex. "9,1 €")
  formatEUR(fcfa) {
    return this.toEUR(fcfa).toLocaleString('fr-FR') + ' €';
  },

  // Montant FCFA + équivalent euro (ex. "6 000 FCFA (≈ 9,1 €)")
  money(fcfa) {
    return this.formatFCFA(fcfa) + ' (≈ ' + this.formatEUR(fcfa) + ')';
  },

  // ─── Hiérarchie d'administration ───
  // Permissions attribuables aux admins (le super-admin les a toutes).
  adminPermissions: [
    { key: 'users', label: 'Gestion des utilisateurs', icon: 'users' },
    { key: 'coaches', label: 'Validation des coachs', icon: 'graduation' },
    { key: 'finance', label: 'Finances & statistiques', icon: 'cash' },
  ],
  permList(user) {
    return ((user && user.permissions) || '').split(',').map((s) => s.trim()).filter(Boolean);
  },
  // L'utilisateur a-t-il la permission ? (super-admin = toutes)
  hasPerm(user, perm) {
    if (!user) return false;
    if (user.isSuperAdmin) return true;
    if (user.role !== 'admin') return false;
    if (!perm) return true; // accès admin général
    return this.permList(user).includes(perm);
  },

  formatFCFA(n) {
    if (n == null) return '0 FCFA';
    return Number(n).toLocaleString('fr-FR').replace(/ /g, ' ') + ' FCFA';
  },
};
