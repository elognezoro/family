// EduWeb Formation — diagnostic de performance par IA
//
// Après chaque tentative : calcule des statistiques détaillées (par difficulté,
// par sous-catégorie, temps), puis produit un diagnostic personnalisé :
//  1. via l'API Claude (si ANTHROPIC_API_KEY est configurée) ;
//  2. sinon, via un moteur pédagogique de repli (règles + gabarits).
// Le diagnostic comprend : bilan, points forts/faibles, plan d'amélioration
// et CONSEILS DE PERSPECTIVES (orientation professionnelle selon le profil).

const meta = require('../data/formation/meta');

let Anthropic = null;
try { Anthropic = require('@anthropic-ai/sdk'); } catch (e) { /* SDK absent : repli */ }

const MODEL = process.env.FORMATION_AI_MODEL || 'claude-opus-5';

// ─── 1. Statistiques d'une tentative ───
// fixed = questions figées (avec bonneReponse), reponses = { index -> choix }
function buildStats(fixed, reponses, dureeSec) {
  const parDiff = {};
  const parSousCat = {};
  let bonnes = 0;
  let sansReponse = 0;

  fixed.forEach((q, i) => {
    const rep = reponses[i];
    const ok = require('../data/formation/scoring').estCorrect(q, rep);
    if (ok) bonnes++;
    if (rep === undefined || rep === null) sansReponse++;

    const d = 'd' + q.difficulte;
    parDiff[d] = parDiff[d] || { total: 0, bonnes: 0 };
    parDiff[d].total++;
    if (ok) parDiff[d].bonnes++;

    const sc = q.sousCategorie || 'autre';
    parSousCat[sc] = parSousCat[sc] || { total: 0, bonnes: 0 };
    parSousCat[sc].total++;
    if (ok) parSousCat[sc].bonnes++;
  });

  return {
    total: fixed.length,
    bonnes,
    sansReponse,
    pct: Math.round((bonnes / fixed.length) * 100),
    dureeSec: dureeSec || null,
    parDifficulte: parDiff,
    parSousCategorie: parSousCat,
  };
}

// Points forts / faibles à partir des sous-catégories (≥ 2 questions)
function forcesFaiblesses(stats) {
  const entries = Object.entries(stats.parSousCategorie)
    .filter(([, v]) => v.total >= 2)
    .map(([k, v]) => ({ nom: k.replace(/-/g, ' '), pct: Math.round((v.bonnes / v.total) * 100) }));
  entries.sort((a, b) => b.pct - a.pct);
  return {
    forts: entries.filter((e) => e.pct >= 70).slice(0, 3),
    faibles: entries.filter((e) => e.pct < 50).slice(-3).reverse(),
  };
}

// ─── 2. Diagnostic de repli (sans IA) ───
// Gabarits pédagogiques : jamais un texte vide, même hors ligne.
const PERSPECTIVES_PAR_CATEGORIE = {
  logique: ['les concours administratifs (rédacteur, adjoint administratif)', 'les métiers d’analyse et de contrôle', 'la police et la gendarmerie'],
  calcul: ['les métiers de la comptabilité et des finances publiques', 'les concours des impôts et du trésor', 'les métiers de la logistique'],
  verbal: ['les concours d’instituteurs adjoints', 'les métiers du secrétariat et de la rédaction administrative', 'les métiers de la communication'],
  attention: ['le personnel de santé (soins, laboratoire, pharmacie)', 'les métiers du contrôle et de la saisie de données', 'la douane et la police'],
  organisation: ['les métiers d’encadrement et de planification', 'les concours administratifs de catégorie B', 'la gestion de projets et d’équipes'],
  memoire: ['le personnel de santé', 'les métiers de l’accueil et du service public', 'les métiers de la sécurité'],
};

function diagnosticDeRepli(stats, categorie, niveau, historique) {
  const cat = meta.categorie(categorie);
  const ff = forcesFaiblesses(stats);
  const p = stats.pct;

  let bilan;
  if (p >= 80) bilan = `Excellent résultat : ${stats.bonnes} bonnes réponses sur ${stats.total} (${p} %). Vous maîtrisez déjà bien la catégorie « ${cat.label} ». Continuez à ce rythme : vous êtes au niveau attendu le jour du concours.`;
  else if (p >= 60) bilan = `Bon résultat : ${stats.bonnes} bonnes réponses sur ${stats.total} (${p} %). Les bases de la catégorie « ${cat.label} » sont acquises. Avec un entraînement régulier, vous pouvez viser plus de 80 %.`;
  else if (p >= 40) bilan = `Résultat encourageant : ${stats.bonnes} bonnes réponses sur ${stats.total} (${p} %). La catégorie « ${cat.label} » demande encore du travail, mais vous avez déjà des acquis solides sur lesquels construire.`;
  else bilan = `Vous avez obtenu ${stats.bonnes} bonnes réponses sur ${stats.total} (${p} %). Ne vous découragez pas : tout le monde commence quelque part. Relisez la fiche de théorie de « ${cat.label} », puis recommencez en mode Entraînement.`;

  // Difficulté : où ça bloque ?
  const d45 = ['d4', 'd5'].reduce((acc, k) => {
    const v = stats.parDifficulte[k];
    if (v) { acc.total += v.total; acc.bonnes += v.bonnes; }
    return acc;
  }, { total: 0, bonnes: 0 });
  const conseils = [];
  if (stats.sansReponse > stats.total / 5) {
    conseils.push(`Vous avez laissé ${stats.sansReponse} questions sans réponse. Au concours, une case vide est toujours perdue : répondez à tout, même en éliminant d’abord les options impossibles.`);
  }
  if (d45.total > 0 && d45.bonnes / d45.total < 0.4) {
    conseils.push('Les questions difficiles (niveaux 4 et 5) vous résistent encore : c’est normal. Travaillez d’abord la méthode sur les questions moyennes, la vitesse viendra ensuite.');
  }
  ff.faibles.forEach((f) => conseils.push(`Revoyez la partie « ${f.nom} » (${f.pct} % de réussite) dans la fiche de théorie, puis refaites un test de 10 questions.`));
  conseils.push('Entraînez-vous un peu chaque jour (20 à 30 minutes) plutôt que beaucoup une seule fois : la régularité fait la différence.');

  const perspectives = [];
  if (p >= 60) {
    perspectives.push(`Votre aptitude en « ${cat.label} » est un vrai atout pour ${(PERSPECTIVES_PAR_CATEGORIE[categorie] || ['les concours de la fonction publique'])[0]}.`);
    perspectives.push(`Profils comme le vôtre réussissent aussi dans ${(PERSPECTIVES_PAR_CATEGORIE[categorie] || []).slice(1).join(' et ') || 'les concours administratifs'}.`);
  } else {
    perspectives.push(`La catégorie « ${cat.label} » compte beaucoup pour ${(PERSPECTIVES_PAR_CATEGORIE[categorie] || ['les concours visés'])[0]} : chaque point gagné à l’entraînement augmente vos chances.`);
  }
  if (historique && historique.length >= 2) {
    const prev = historique[historique.length - 2];
    if (stats.pct > prev) perspectives.push(`Vous progressez : ${prev} % à la tentative précédente, ${stats.pct} % aujourd’hui. Continuez !`);
    else if (stats.pct < prev) perspectives.push(`Petit recul par rapport à la dernière tentative (${prev} %) : cela arrive, souvent par fatigue. Reposez-vous et réessayez demain.`);
  }

  return {
    source: 'regles',
    resume: bilan,
    pointsForts: ff.forts.map((f) => `${f.nom} : ${f.pct} % de réussite`),
    pointsAmeliorer: ff.faibles.map((f) => `${f.nom} : ${f.pct} % de réussite`),
    conseils,
    perspectives,
    encouragement: p >= 60
      ? 'Bravo pour ce travail. La réussite au concours se construit exactement comme cela : un test après l’autre.'
      : 'Chaque tentative vous rend plus fort. Les candidats qui réussissent sont ceux qui persévèrent — vous êtes sur le bon chemin.',
  };
}

// ─── 3. Diagnostic par IA (Claude) ───
const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['resume', 'pointsForts', 'pointsAmeliorer', 'conseils', 'perspectives', 'encouragement'],
  properties: {
    resume: { type: 'string', description: 'Bilan global chaleureux en 2 à 4 phrases simples' },
    pointsForts: { type: 'array', items: { type: 'string' } },
    pointsAmeliorer: { type: 'array', items: { type: 'string' } },
    conseils: { type: 'array', items: { type: 'string' }, description: 'Plan d’amélioration concret et actionnable' },
    perspectives: { type: 'array', items: { type: 'string' }, description: 'Conseils d’orientation professionnelle et de concours selon le profil d’aptitudes' },
    encouragement: { type: 'string' },
  },
};

async function diagnosticIA(stats, contexte) {
  const client = new Anthropic();
  const prompt = `Tu es un conseiller pédagogique expert des concours de la fonction publique en Afrique francophone (Côte d'Ivoire). Tu t'adresses directement au candidat (vouvoiement), avec des phrases courtes et simples : la plupart des candidats ont une culture scolaire et numérique modeste. Ton ton est chaleureux, honnête et encourageant — jamais condescendant.

Voici le résultat d'un test psychotechnique que le candidat vient de terminer :
${JSON.stringify(contexte, null, 2)}

Produis son diagnostic de performance personnalisé :
- "resume" : bilan global (2 à 4 phrases) citant le score réel ;
- "pointsForts" / "pointsAmeliorer" : appuyés sur les statistiques par sous-catégorie et par difficulté (cite les pourcentages) ;
- "conseils" : plan d'amélioration concret (3 à 5 actions précises : quoi réviser, comment s'entraîner, gestion du temps) ;
- "perspectives" : 2 à 4 conseils d'ORIENTATION PROFESSIONNELLE : au vu de ce profil d'aptitudes et de l'objectif visé, quels concours ou métiers correspondent le mieux, et que renforcer pour y arriver. Reste réaliste et bienveillant ;
- "encouragement" : 1 à 2 phrases qui donnent envie de continuer.
Si un historique de tentatives est fourni, commente la progression.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    output_config: { format: { type: 'json_schema', schema: SCHEMA } },
    messages: [{ role: 'user', content: prompt }],
  });
  if (response.stop_reason === 'refusal') throw new Error('refus du modèle');
  const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  const out = JSON.parse(text);
  out.source = 'ia';
  return out;
}

// ─── 4. Point d'entrée ───
// historique = tableau des % des tentatives précédentes (même catégorie)
async function generer(fixed, reponses, { categorie, niveau, objectif, dureeSec, historique }) {
  const stats = buildStats(fixed, reponses, dureeSec);
  const cat = meta.categorie(categorie);
  const niv = meta.niveau(niveau);

  let diag;
  if (Anthropic && process.env.ANTHROPIC_API_KEY) {
    try {
      diag = await diagnosticIA(stats, {
        categorie: cat ? cat.label : categorie,
        niveau: niv ? `${niv.label} (${niv.sousTitre})` : niveau,
        objectifDuCandidat: objectif || 'non précisé',
        score: `${stats.bonnes}/${stats.total} (${stats.pct} %)`,
        questionsSansReponse: stats.sansReponse,
        dureeSecondes: stats.dureeSec,
        parDifficulte: stats.parDifficulte,
        parSousCategorie: stats.parSousCategorie,
        historiquePctTentativesPrecedentes: historique || [],
      });
    } catch (e) {
      console.error('[diagnostic IA] repli sur le moteur de règles :', e && e.message);
      diag = diagnosticDeRepli(stats, categorie, niveau, historique);
    }
  } else {
    diag = diagnosticDeRepli(stats, categorie, niveau, historique);
  }

  return { stats, diagnostic: diag };
}

module.exports = { generer, buildStats };
