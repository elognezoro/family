/*
 * Génère le SUPPORT DE FORMATION EduWeb (PDF académique) à partir du contenu
 * pédagogique JSON (scripts/formation-content.json), produit par le workflow
 * « support-formation-eduweb ».
 *
 * Dépendances (à installer ad hoc) : npm i pdfkit
 * Usage : node scripts/build-formation.js
 */
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'guides');
const CONTENT = path.join(__dirname, 'formation-content.json');
const ARIAL = 'C:/Windows/Fonts/arial.ttf';
const ARIALB = 'C:/Windows/Fonts/arialbd.ttf';
const ARIALI = 'C:/Windows/Fonts/ariali.ttf';
const DATE = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

const GREEN = '#0E6B3A';
const GREEN2 = '#1E9E57';
const GREEN_LIGHT = '#EEF8F1';
const INK = '#2A2A2A';
const MUTED = '#8A8A8A';
const RULE = '#E2E6E3';

const CALLOUTS = {
  note: { label: 'À noter', bg: '#EEF8F1', bar: '#1E9E57', fg: '#214634' },
  astuce: { label: 'Astuce', bg: '#EAF3FB', bar: '#2A77C6', fg: '#1B3A57' },
  attention: { label: 'Attention', bg: '#FDF3E6', bar: '#C9871C', fg: '#5A3D12' },
};

function buildFormation(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 80, bottom: 66, left: 64, right: 64 }, bufferPages: true });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.registerFont('AR', ARIAL);
    doc.registerFont('ARB', ARIALB);
    try { doc.registerFont('ARI', ARIALI); } catch (e) { doc.registerFont('ARI', ARIAL); }

    const W = doc.page.width, H = doc.page.height;
    const ML = doc.page.margins.left, MR = doc.page.margins.right, MT = doc.page.margins.top;
    const CW = W - ML - MR;
    const cBottom = () => H - doc.page.margins.bottom;
    const ensure = (h) => { if (doc.y + h > cBottom()) doc.addPage(); };
    const pageNo = () => doc.bufferedPageRange().count; // n° (1-based) de la page courante

    /* ---------- primitives de texte ---------- */
    function para(text, opt) {
      opt = opt || {};
      const size = opt.size || 10.5;
      doc.font(opt.font || 'AR').fontSize(size).fillColor(opt.color || INK);
      const h = doc.heightOfString(text, { width: CW, lineGap: opt.lineGap == null ? 2.5 : opt.lineGap });
      ensure(h + 2);
      doc.text(text, ML, doc.y, { width: CW, align: opt.align || 'left', lineGap: opt.lineGap == null ? 2.5 : opt.lineGap });
      doc.moveDown(opt.after == null ? 0.5 : opt.after);
      doc.x = ML;
    }

    function h3(text) {
      ensure(26);
      doc.moveDown(0.2);
      const y0 = doc.y;
      doc.save();
      doc.rect(ML, y0 + 1.5, 3, 12).fill(GREEN2);
      doc.restore();
      doc.font('ARB').fontSize(11).fillColor(GREEN).text(text, ML + 10, y0, { width: CW - 10 });
      doc.moveDown(0.3);
      doc.x = ML;
    }

    function bullets(items) {
      items.forEach((it) => {
        doc.font('AR').fontSize(10.5).fillColor(INK);
        const tw = CW - 16;
        const th = doc.heightOfString(it, { width: tw, lineGap: 2.5 });
        ensure(th + 5);
        const y0 = doc.y;
        doc.save();
        doc.rect(ML + 2, y0 + 4.5, 4, 4).fill(GREEN2);
        doc.restore();
        doc.font('AR').fontSize(10.5).fillColor(INK).text(it, ML + 16, y0, { width: tw, lineGap: 2.5 });
        doc.y = Math.max(doc.y, y0 + th);
        doc.moveDown(0.28);
        doc.x = ML;
      });
      doc.moveDown(0.15);
    }

    function steps(items) {
      items.forEach((it, i) => {
        const d = 17;
        doc.font('AR').fontSize(10.5).fillColor(INK);
        const tw = CW - d - 12;
        const th = doc.heightOfString(it, { width: tw, lineGap: 2.5 });
        const rowH = Math.max(d, th);
        ensure(rowH + 7);
        const y0 = doc.y;
        doc.save();
        doc.circle(ML + d / 2, y0 + d / 2, d / 2).fill(GREEN2);
        doc.fillColor('#FFFFFF').font('ARB').fontSize(9.5).text(String(i + 1), ML, y0 + (d - 9.5) / 2 - 0.5, { width: d, align: 'center' });
        doc.restore();
        doc.font('AR').fontSize(10.5).fillColor(INK).text(it, ML + d + 12, y0 + Math.max(0, (d - th) / 2 > 0 ? 0 : 0), { width: tw, lineGap: 2.5 });
        doc.y = y0 + rowH + 6;
        doc.x = ML;
      });
      doc.moveDown(0.15);
    }

    function callout(kind, text) {
      const c = CALLOUTS[kind] || CALLOUTS.note;
      const pad = 11, barW = 4, lead = 16;
      const innerX = ML + pad + barW, innerW = CW - 2 * pad - barW;
      doc.font('ARB').fontSize(9.7);
      const labelH = doc.heightOfString(c.label, { width: innerW });
      doc.font('AR').fontSize(9.7);
      const bodyH = doc.heightOfString(text, { width: innerW, lineGap: 2.5 });
      const boxH = pad + labelH + 3 + bodyH + pad;
      ensure(boxH + 8);
      const y0 = doc.y;
      doc.save();
      doc.roundedRect(ML, y0, CW, boxH, 7).fill(c.bg);
      doc.rect(ML, y0, barW, boxH).fill(c.bar);
      doc.restore();
      doc.fillColor(c.bar).font('ARB').fontSize(9.7).text(c.label, innerX + 8, y0 + pad, { width: innerW - 8 });
      doc.fillColor(c.fg).font('AR').fontSize(9.7).text(text, innerX + 8, y0 + pad + labelH + 3, { width: innerW - 8, lineGap: 2.5 });
      doc.y = y0 + boxH + 9;
      doc.x = ML;
    }

    function renderBlocks(blocks) {
      (blocks || []).forEach((b) => {
        if (!b || !b.type) return;
        if (b.type === 'p') para(b.text || '');
        else if (b.type === 'h3') h3(b.text || '');
        else if (b.type === 'ul') bullets(b.items || []);
        else if (b.type === 'ol') steps(b.items || []);
        else if (b.type === 'note' || b.type === 'astuce' || b.type === 'attention') callout(b.type, b.text || '');
      });
    }

    /* ---------- tableau simple ---------- */
    function table(headers, rows, widths) {
      const totalW = widths.reduce((a, b) => a + b, 0);
      const scale = CW / totalW;
      const w = widths.map((x) => x * scale);
      const cellPad = 6;
      const drawRow = (cells, isHead) => {
        doc.font(isHead ? 'ARB' : 'AR').fontSize(9.5);
        let maxH = 0;
        cells.forEach((c, i) => { const hh = doc.heightOfString(String(c), { width: w[i] - 2 * cellPad, lineGap: 1.5 }); if (hh > maxH) maxH = hh; });
        const rowH = maxH + 2 * cellPad;
        ensure(rowH);
        const y0 = doc.y;
        let x = ML;
        cells.forEach((c, i) => {
          doc.save();
          if (isHead) doc.rect(x, y0, w[i], rowH).fill(GREEN);
          else { doc.rect(x, y0, w[i], rowH).fillOpacity(1).fill('#FFFFFF'); }
          doc.restore();
          doc.save();
          doc.rect(x, y0, w[i], rowH).lineWidth(0.6).strokeColor(RULE).stroke();
          doc.restore();
          doc.font(isHead ? 'ARB' : 'AR').fontSize(9.5).fillColor(isHead ? '#FFFFFF' : INK)
            .text(String(c), x + cellPad, y0 + cellPad, { width: w[i] - 2 * cellPad, lineGap: 1.5 });
          x += w[i];
        });
        doc.y = y0 + rowH;
        doc.x = ML;
      };
      drawRow(headers, true);
      rows.forEach((r) => drawRow(r, false));
      doc.moveDown(0.5);
    }

    /* ---------- en-têtes de partie ---------- */
    const toc = [];
    let firstPartie = true;
    function newPartie() { if (firstPartie) { firstPartie = false; } else { doc.addPage(); } }

    function partieHeader(tocLabel, eyebrow, title) {
      newPartie();
      toc.push({ label: tocLabel, page: pageNo() });
      const y0 = doc.y;
      // bande verte
      const bandH = 50;
      doc.save();
      doc.roundedRect(ML, y0, CW, bandH, 8).fill(GREEN);
      doc.restore();
      if (eyebrow) {
        doc.fillColor('#BFE6CE').font('ARB').fontSize(8.5).text(eyebrow.toUpperCase(), ML + 16, y0 + 9, { width: CW - 32, characterSpacing: 1.5 });
        doc.fillColor('#FFFFFF').font('ARB').fontSize(15).text(title, ML + 16, y0 + 23, { width: CW - 32 });
      } else {
        doc.fillColor('#FFFFFF').font('ARB').fontSize(16).text(title, ML + 16, y0 + (bandH - 16) / 2 - 1, { width: CW - 32 });
      }
      doc.y = y0 + bandH + 14;
      doc.x = ML;
    }

    /* ---------- fiche module ---------- */
    function ficheModule(m) {
      const pad = 12;
      const meta = (label, value, x, w) => {
        doc.fillColor(GREEN2).font('ARB').fontSize(8).text(label.toUpperCase(), x, doc._fy, { width: w, characterSpacing: 0.8 });
        doc.fillColor(INK).font('AR').fontSize(9.5).text(value, x, doc._fy + 12, { width: w, lineGap: 1.5 });
      };
      const colW = (CW - 2 * pad) / 2 - 8;
      doc.font('AR').fontSize(9.5);
      const pubH = Math.max(doc.heightOfString(m.public || '—', { width: colW, lineGap: 1.5 }), doc.heightOfString(m.duree || '—', { width: colW, lineGap: 1.5 }));
      const preH = doc.heightOfString(m.prerequis || 'Aucun', { width: CW - 2 * pad, lineGap: 1.5 });
      const rowA = 12 + pubH;
      const rowB = 12 + preH;
      const boxH = pad + rowA + 10 + rowB + pad;
      ensure(boxH + 10);
      const y0 = doc.y;
      doc.save();
      doc.roundedRect(ML, y0, CW, boxH, 7).fill(GREEN_LIGHT);
      doc.restore();
      doc._fy = y0 + pad;
      meta('Public', m.public || '—', ML + pad, colW);
      doc.save(); doc.rect(ML + pad + colW + 6, y0 + pad, 0.8, rowA).fill('#C9E6D5'); doc.restore();
      meta('Durée estimée', m.duree || '—', ML + pad + colW + 14, colW);
      doc._fy = y0 + pad + rowA + 10;
      doc.save(); doc.moveTo(ML + pad, doc._fy - 5).lineTo(ML + CW - pad, doc._fy - 5).lineWidth(0.6).strokeColor('#C9E6D5').stroke(); doc.restore();
      meta('Prérequis', m.prerequis || 'Aucun', ML + pad, CW - 2 * pad);
      doc.y = y0 + boxH + 12;
      doc.x = ML;
      // objectifs
      if (m.objectifs && m.objectifs.length) {
        sectionLabel('Objectifs pédagogiques');
        para('À l’issue de ce module, l’apprenant sera capable de :', { after: 0.3, color: MUTED, size: 9.8 });
        checks(m.objectifs);
      }
      // plan du module
      if (m.sequences && m.sequences.length) {
        sectionLabel('Plan du module');
        const plan = m.sequences.map((s) => s.titre);
        if (m.tp && m.tp.length) plan.push('Travaux pratiques');
        plan.push('À retenir', 'Auto-évaluation');
        bullets(plan);
      }
    }

    function sectionLabel(text) {
      ensure(22);
      doc.moveDown(0.2);
      doc.font('ARB').fontSize(11.5).fillColor(GREEN).text(text, ML, doc.y, { width: CW });
      const ly = doc.y + 2;
      doc.save();
      doc.moveTo(ML, ly).lineTo(ML + 46, ly).lineWidth(1.5).strokeColor(GREEN2).stroke();
      doc.restore();
      doc.moveDown(0.45);
      doc.x = ML;
    }

    function checks(items) {
      items.forEach((it) => {
        doc.font('AR').fontSize(10.3).fillColor(INK);
        const tw = CW - 20;
        const th = doc.heightOfString(it, { width: tw, lineGap: 2.5 });
        ensure(th + 5);
        const y0 = doc.y;
        // coche verte
        doc.save();
        doc.lineWidth(1.6).strokeColor(GREEN2);
        doc.moveTo(ML + 1, y0 + 6).lineTo(ML + 4.5, y0 + 9.5).lineTo(ML + 10, y0 + 2.5).stroke();
        doc.restore();
        doc.font('AR').fontSize(10.3).fillColor(INK).text(it, ML + 20, y0, { width: tw, lineGap: 2.5 });
        doc.y = Math.max(doc.y, y0 + th);
        doc.moveDown(0.28);
        doc.x = ML;
      });
      doc.moveDown(0.15);
    }

    /* ---------- séquence ---------- */
    function sequence(s, idx) {
      ensure(30);
      doc.moveDown(0.3);
      const y0 = doc.y;
      const numTxt = String(idx);
      doc.font('ARB').fontSize(13);
      const badge = 22;
      doc.save();
      doc.roundedRect(ML, y0, badge, badge, 5).fill(GREEN2);
      doc.fillColor('#FFFFFF').font('ARB').fontSize(11).text(numTxt, ML, y0 + (badge - 11) / 2 - 0.5, { width: badge, align: 'center' });
      doc.restore();
      const tx = ML + badge + 10;
      doc.font('ARB').fontSize(12.5).fillColor(GREEN).text(s.titre, tx, y0 + 2, { width: CW - badge - 10 - 60 });
      if (s.duree) { doc.font('AR').fontSize(8.5).fillColor(MUTED).text('⏱ ' + s.duree, ML + CW - 60, y0 + 5, { width: 60, align: 'right' }); }
      doc.y = Math.max(doc.y, y0 + badge) + 8;
      doc.x = ML;
      renderBlocks(s.blocks);
    }

    /* ---------- travaux pratiques ---------- */
    function travauxPratiques(tps) {
      sectionLabel('Travaux pratiques');
      tps.forEach((tp, i) => {
        doc.font('ARB').fontSize(10.5).fillColor(GREEN);
        const head = 'TP ' + (i + 1) + ' — ' + tp.titre;
        const hh = doc.heightOfString(head, { width: CW });
        ensure(hh + 6);
        doc.text(head, ML, doc.y, { width: CW });
        doc.moveDown(0.2);
        if (tp.consigne) para(tp.consigne, { after: 0.3, size: 10.2 });
        if (tp.etapes && tp.etapes.length) steps(tp.etapes);
        doc.moveDown(0.2);
      });
    }

    /* ---------- à retenir ---------- */
    function aRetenir(items) {
      const pad = 12, barW = 4;
      const innerW = CW - 2 * pad - barW;
      doc.font('ARB').fontSize(10.5);
      const labelH = 14;
      let bodyH = 0;
      doc.font('AR').fontSize(10);
      items.forEach((it) => { bodyH += doc.heightOfString(it, { width: innerW - 16, lineGap: 2.5 }) + 6; });
      const boxH = pad + labelH + 4 + bodyH + pad - 2;
      ensure(boxH + 10);
      const y0 = doc.y;
      doc.save();
      doc.roundedRect(ML, y0, CW, boxH, 8).fill(GREEN_LIGHT);
      doc.rect(ML, y0, barW, boxH).fill(GREEN);
      doc.restore();
      doc.fillColor(GREEN).font('ARB').fontSize(10.8).text('À retenir', ML + pad + barW + 4, y0 + pad, { width: innerW });
      let yy = y0 + pad + labelH + 4;
      doc.font('AR').fontSize(10).fillColor('#214634');
      items.forEach((it) => {
        const tw = innerW - 16;
        const th = doc.heightOfString(it, { width: tw, lineGap: 2.5 });
        doc.save();
        doc.circle(ML + pad + barW + 6, yy + 5.5, 2.2).fill(GREEN2);
        doc.restore();
        doc.fillColor('#214634').font('AR').fontSize(10).text(it, ML + pad + barW + 16, yy, { width: tw, lineGap: 2.5 });
        yy += th + 6;
      });
      doc.y = y0 + boxH + 12;
      doc.x = ML;
    }

    /* ---------- quiz ---------- */
    function quiz(questions, title) {
      sectionLabel(title || 'Auto-évaluation');
      const letters = ['a', 'b', 'c', 'd', 'e', 'f'];
      questions.forEach((q, qi) => {
        doc.font('ARB').fontSize(10.3).fillColor(INK);
        const head = 'Q' + (qi + 1) + '. ' + q.question;
        const hh = doc.heightOfString(head, { width: CW });
        ensure(hh + 8 + (q.choix.length * 14));
        doc.text(head, ML, doc.y, { width: CW, lineGap: 2 });
        doc.moveDown(0.2);
        q.choix.forEach((c, ci) => {
          doc.font('AR').fontSize(10).fillColor(INK);
          const tw = CW - 26;
          const th = doc.heightOfString(c, { width: tw, lineGap: 1.5 });
          ensure(th + 3);
          const y0 = doc.y;
          doc.font('ARB').fontSize(10).fillColor(GREEN2).text(letters[ci] + ')', ML + 8, y0, { width: 16, lineBreak: false });
          doc.font('AR').fontSize(10).fillColor(INK).text(c, ML + 26, y0, { width: tw, lineGap: 1.5 });
          doc.y = Math.max(doc.y, y0 + th);
          doc.moveDown(0.12);
        });
        doc.moveDown(0.35);
        doc.x = ML;
      });
      // corrigé
      doc.moveDown(0.1);
      const lines = questions.map((q, qi) => 'Q' + (qi + 1) + ' : ' + letters[q.bonneReponse] + ') — ' + (q.explication || ''));
      const pad = 10, barW = 3;
      const innerW = CW - 2 * pad - barW;
      doc.font('ARB').fontSize(9.5);
      let bodyH = 0;
      doc.font('AR').fontSize(9);
      lines.forEach((l) => { bodyH += doc.heightOfString(l, { width: innerW, lineGap: 1.8 }) + 4; });
      const boxH = pad + 13 + bodyH + pad - 2;
      ensure(boxH + 8);
      const y0 = doc.y;
      doc.save();
      doc.roundedRect(ML, y0, CW, boxH, 6).fill('#F5F6F7');
      doc.rect(ML, y0, barW, boxH).fill(MUTED);
      doc.restore();
      doc.fillColor('#555555').font('ARB').fontSize(9.5).text('Corrigé', ML + pad + barW, y0 + pad, { width: innerW });
      let yy = y0 + pad + 13;
      doc.font('AR').fontSize(9).fillColor('#555555');
      lines.forEach((l) => { const th = doc.heightOfString(l, { width: innerW, lineGap: 1.8 }); doc.text(l, ML + pad + barW, yy, { width: innerW, lineGap: 1.8 }); yy += th + 4; });
      doc.y = y0 + boxH + 10;
      doc.x = ML;
    }

    /* ===================== PAGE DE COUVERTURE ===================== */
    (function cover() {
      const bandH = 168;
      doc.save();
      doc.rect(0, 0, W, bandH).fill(GREEN);
      doc.rect(0, bandH, W, 5).fill(GREEN2);
      doc.fillColor('#FFFFFF').font('ARB').fontSize(34).text('EduWeb', 0, 54, { width: W, align: 'center' });
      doc.fillColor('#CDEBD8').font('AR').fontSize(9).text('F A M I L Y   &   C O A C H I N G', 0, 100, { width: W, align: 'center', characterSpacing: 2 });
      doc.restore();

      let y = bandH + 78;
      doc.fillColor(GREEN2).font('ARB').fontSize(10).text('PROGRAMME DE FORMATION', 0, y, { width: W, align: 'center', characterSpacing: 2.5 });
      y += 40;
      doc.fillColor('#1E1E1E').font('ARB').fontSize(30).text('Support de formation', 0, y, { width: W, align: 'center' });
      y += 40;
      doc.fillColor('#1E1E1E').font('ARB').fontSize(30).text('des utilisateurs', 0, y, { width: W, align: 'center' });
      y += 54;
      doc.fillColor('#555555').font('ARI').fontSize(13).text('Manuel de l’apprenant — Syllabus, modules par rôle, exercices et évaluation', ML, y, { width: CW, align: 'center' });
      y = doc.y + 26;
      const dW = 110;
      doc.save();
      doc.moveTo((W - dW) / 2, y).lineTo((W + dW) / 2, y).lineWidth(2).strokeColor(GREEN2).stroke();
      doc.restore();
      y += 22;
      doc.fillColor('#777777').font('AR').fontSize(10.5).text('Parent · Coach · Commercial · Administrateur · Super-Administrateur', ML, y, { width: CW, align: 'center' });

      const by = H - 96;
      doc.fillColor('#222222').font('ARB').fontSize(11).text('family.eduweb.ci', 0, by, { width: W, align: 'center' });
      doc.fillColor(MUTED).font('AR').fontSize(9).text('Version du ' + DATE, 0, by + 18, { width: W, align: 'center' });
      doc.save();
      doc.rect(0, H - 10, W, 10).fill(GREEN);
      doc.restore();
    })();

    /* ===================== SOMMAIRE (réservé) ===================== */
    doc.addPage();
    const tocPageIndex = doc.bufferedPageRange().count - 1;

    /* ===================== CONTENU ===================== */
    doc.addPage(); // première page de contenu

    const s = data.syllabus || {};
    const mods = data.modules || [];
    const back = data.backmatter || {};

    // --- Avant-propos / mode d'emploi ---
    partieHeader('Avant-propos', null, 'Avant-propos — Comment utiliser ce support');
    renderBlocks((s.avantPropos || []).map((t) => ({ type: 'p', text: t })));
    h3('Légende des encadrés');
    callout('note', 'Information importante à connaître ou à mémoriser.');
    callout('astuce', 'Conseil pratique pour gagner du temps ou mieux faire.');
    callout('attention', 'Point de vigilance : risque d’erreur ou action irréversible.');
    para('Chaque module se termine par des travaux pratiques, une synthèse « À retenir » et un quiz d’auto-évaluation (avec corrigé). Une évaluation finale et un glossaire figurent à la fin du support.', { color: MUTED, size: 9.8 });

    // --- Syllabus ---
    partieHeader('Syllabus (programme)', 'Cadre pédagogique', 'Syllabus — Programme de formation');
    if (s.presentation && s.presentation.length) { sectionLabel('Présentation du programme'); renderBlocks(s.presentation.map((t) => ({ type: 'p', text: t }))); }
    if (s.publicCible && s.publicCible.length) { sectionLabel('Public cible'); table(['Rôle', 'Description'], s.publicCible.map((p) => [p.role, p.description]), [22, 78]); }
    if (s.objectifsGeneraux && s.objectifsGeneraux.length) { sectionLabel('Objectifs généraux'); checks(s.objectifsGeneraux); }
    if (s.prerequis && s.prerequis.length) { sectionLabel('Prérequis'); bullets(s.prerequis); }
    if (s.organisation && s.organisation.length) { sectionLabel('Organisation & volume horaire'); renderBlocks(s.organisation.map((t) => ({ type: 'p', text: t }))); }
    if (s.methodes && s.methodes.length) { sectionLabel('Méthodes pédagogiques'); bullets(s.methodes); }
    if (s.evaluation && s.evaluation.length) { sectionLabel('Modalités d’évaluation'); renderBlocks(s.evaluation.map((t) => ({ type: 'p', text: t }))); }
    if (s.parcours && s.parcours.length) { sectionLabel('Parcours recommandés par rôle'); table(['Rôle', 'Modules à suivre', 'Durée'], s.parcours.map((p) => [p.role, p.parcours, p.duree]), [26, 54, 20]); }

    // --- Modules ---
    mods.forEach((m, mi) => {
      partieHeader(m.titre, 'Module ' + (m.code ? m.code.replace(/^M/, '') : (mi)), m.titre.replace(/^Module\s+\S+\s+—\s+/, ''));
      ficheModule(m);
      (m.sequences || []).forEach((seq, si) => sequence(seq, si + 1));
      if (m.tp && m.tp.length) travauxPratiques(m.tp);
      if (m.aRetenir && m.aRetenir.length) aRetenir(m.aRetenir);
      if (m.quiz && m.quiz.length) quiz(m.quiz, 'Auto-évaluation');
    });

    // --- Évaluation finale ---
    if (back.evaluationFinale && back.evaluationFinale.length) {
      partieHeader('Évaluation finale', 'Validation des acquis', 'Évaluation finale');
      para('Ce questionnaire transversal couvre l’ensemble des rôles. Répondez sans consulter les modules, puis vérifiez vos réponses dans le corrigé.', { color: MUTED, size: 9.8 });
      quiz(back.evaluationFinale, 'Questionnaire');
    }

    // --- Glossaire ---
    if (back.glossaire && back.glossaire.length) {
      partieHeader('Glossaire', 'Annexe', 'Glossaire');
      back.glossaire.forEach((g) => {
        doc.font('ARB').fontSize(10.3).fillColor(GREEN);
        const th = doc.heightOfString(g.terme, { width: CW });
        const dh = doc.font('AR').fontSize(10).heightOfString(g.definition, { width: CW, lineGap: 2 });
        ensure(th + dh + 8);
        doc.font('ARB').fontSize(10.3).fillColor(GREEN).text(g.terme, ML, doc.y, { width: CW });
        doc.font('AR').fontSize(10).fillColor(INK).text(g.definition, ML, doc.y, { width: CW, lineGap: 2 });
        doc.moveDown(0.45);
        doc.x = ML;
      });
    }

    // --- FAQ ---
    if (back.faq && back.faq.length) {
      partieHeader('FAQ & dépannage', 'Annexe', 'FAQ & dépannage');
      back.faq.forEach((f) => {
        doc.font('ARB').fontSize(10.3).fillColor(INK);
        const qh = doc.heightOfString('Q. ' + f.question, { width: CW });
        ensure(qh + 20);
        doc.font('ARB').fontSize(10.3).fillColor(GREEN).text('Q. ' + f.question, ML, doc.y, { width: CW, lineGap: 2 });
        doc.moveDown(0.15);
        doc.font('AR').fontSize(10).fillColor(INK).text('R. ' + f.reponse, ML, doc.y, { width: CW, lineGap: 2.5 });
        doc.moveDown(0.5);
        doc.x = ML;
      });
    }

    /* ===================== REMPLISSAGE DU SOMMAIRE ===================== */
    doc.switchToPage(tocPageIndex);
    let ty = MT;
    doc.font('ARB').fontSize(20).fillColor(GREEN).text('Sommaire', ML, ty);
    ty = doc.y + 6;
    doc.save();
    doc.moveTo(ML, ty).lineTo(ML + CW, ty).lineWidth(1).strokeColor(GREEN2).stroke();
    doc.restore();
    ty += 18;
    const pageColW = 34;
    toc.forEach((e) => {
      doc.font('AR').fontSize(11).fillColor(INK);
      const titleW = CW - pageColW - 10;
      doc.text(e.label, ML, ty, { width: titleW, lineBreak: false, ellipsis: true });
      const tw = Math.min(doc.widthOfString(e.label), titleW);
      const dotsStart = ML + tw + 6;
      const dotsEnd = ML + CW - pageColW - 4;
      if (dotsEnd > dotsStart) {
        doc.save();
        doc.dash(1, { space: 2.5 }).moveTo(dotsStart, ty + 9).lineTo(dotsEnd, ty + 9).lineWidth(0.6).strokeColor('#CCCCCC').stroke();
        doc.undash();
        doc.restore();
      }
      doc.font('AR').fontSize(11).fillColor(INK).text(String(e.page), ML + CW - pageColW, ty, { width: pageColW, align: 'right', lineBreak: false });
      ty += 23;
    });

    /* ===================== EN-TÊTES / PIEDS DE PAGE ===================== */
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);
      if (i === 0) continue; // pas sur la couverture
      // neutralise le saut de page auto de pdfkit pour le texte hors zone de contenu
      doc.page.margins.top = 0;
      doc.page.margins.bottom = 0;
      // en-tête courant
      doc.font('AR').fontSize(8).fillColor('#AEB4B0');
      doc.text('Support de formation EduWeb', ML, 40, { width: CW / 2, align: 'left', lineBreak: false });
      doc.text('Family & Coaching', ML + CW / 2, 40, { width: CW / 2, align: 'right', lineBreak: false });
      doc.save();
      doc.moveTo(ML, 54).lineTo(ML + CW, 54).lineWidth(0.5).strokeColor(RULE).stroke();
      doc.restore();
      // pied de page
      const fy = H - 46;
      doc.save();
      doc.moveTo(ML, fy).lineTo(ML + CW, fy).lineWidth(0.5).strokeColor(RULE).stroke();
      doc.restore();
      doc.font('AR').fontSize(8).fillColor(MUTED);
      doc.text('EduWeb — Family & Coaching', ML, fy + 6, { width: CW / 2, align: 'left', lineBreak: false });
      doc.text('Page ' + (i + 1) + ' / ' + range.count, ML + CW / 2, fy + 6, { width: CW / 2, align: 'right', lineBreak: false });
    }

    doc.end();
  });
}

(async () => {
  if (!fs.existsSync(CONTENT)) { console.error('Contenu introuvable :', CONTENT); process.exit(1); }
  const data = JSON.parse(fs.readFileSync(CONTENT, 'utf8'));
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  const buf = await buildFormation(data);
  const file = path.join(OUT, 'Support-Formation-EduWeb.pdf');
  fs.writeFileSync(file, buf);
  console.log('OK Support-Formation-EduWeb.pdf (' + buf.length + ' o) — version du ' + DATE);
})().catch((e) => { console.error('ERREUR:', e); process.exit(1); });
