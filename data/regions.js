// Découpage administratif officiel de la Côte d'Ivoire
// 14 districts (dont 2 autonomes) → 31 régions → communes principales
//
// Structure : { id, label, regions: [{ id, label, communes: [..] }] }

const districts = [
  {
    id: 'abidjan',
    label: 'District Autonome d’Abidjan',
    regions: [
      {
        id: 'abidjan',
        label: 'Abidjan',
        communes: [
          'Abobo', 'Adjamé', 'Attécoubé', 'Cocody', 'Koumassi', 'Marcory',
          'Plateau', 'Port-Bouët', 'Treichville', 'Yopougon',
          'Anyama', 'Bingerville', 'Songon',
        ],
      },
    ],
  },
  {
    id: 'yamoussoukro',
    label: 'District Autonome de Yamoussoukro',
    regions: [
      {
        id: 'yamoussoukro',
        label: 'Yamoussoukro',
        communes: ['Yamoussoukro', 'Attiégouakro', 'Didiévi', 'Tié-Ndiékro'],
      },
    ],
  },
  {
    id: 'bas-sassandra',
    label: 'Bas-Sassandra',
    regions: [
      { id: 'gboklé', label: 'Gbôklé', communes: ['Sassandra', 'Fresco'] },
      { id: 'nawa', label: 'Nawa', communes: ['Soubré', 'Buyo', 'Méagui', 'Guéyo'] },
      { id: 'san-pedro', label: 'San-Pédro', communes: ['San-Pédro', 'Tabou', 'Grand-Béréby'] },
    ],
  },
  {
    id: 'comoe',
    label: 'Comoé',
    regions: [
      { id: 'indenie-djuablin', label: 'Indénié-Djuablin', communes: ['Abengourou', 'Agnibilékrou', 'Bettié'] },
      { id: 'sud-comoe', label: 'Sud-Comoé', communes: ['Aboisso', 'Adiaké', 'Grand-Bassam', 'Tiapoum'] },
    ],
  },
  {
    id: 'denguele',
    label: 'Denguélé',
    regions: [
      { id: 'folon', label: 'Folon', communes: ['Minignan', 'Kaniasso'] },
      { id: 'kabadougou', label: 'Kabadougou', communes: ['Odienné', 'Madinani', 'Séguélon', 'Gbéléban'] },
    ],
  },
  {
    id: 'goh-djiboua',
    label: 'Gôh-Djiboua',
    regions: [
      { id: 'goh', label: 'Gôh', communes: ['Gagnoa', 'Oumé'] },
      { id: 'loh-djiboua', label: 'Lôh-Djiboua', communes: ['Divo', 'Lakota', 'Guitry'] },
    ],
  },
  {
    id: 'lacs',
    label: 'Lacs',
    regions: [
      { id: 'belier', label: 'Bélier', communes: ['Toumodi', 'Tiébissou', 'Djékanou'] },
      { id: 'iffou', label: 'Iffou', communes: ['Daoukro', 'M’Bahiakro', 'Prikro'] },
      { id: 'moronou', label: 'Moronou', communes: ['Bongouanou', 'Tiémélékro', 'Arrah', 'M’Batto'] },
      { id: 'nzi', label: 'N’Zi', communes: ['Dimbokro', 'Bocanda', 'Kouassi-Kouassikro'] },
    ],
  },
  {
    id: 'lagunes',
    label: 'Lagunes',
    regions: [
      { id: 'agneby-tiassa', label: 'Agnéby-Tiassa', communes: ['Agboville', 'Tiassalé', 'Sikensi', 'Taabo'] },
      { id: 'grands-ponts', label: 'Grands-Ponts', communes: ['Dabou', 'Jacqueville', 'Grand-Lahou'] },
      { id: 'la-me', label: 'La Mé', communes: ['Adzopé', 'Akoupé', 'Yakassé-Attobrou', 'Alépé'] },
    ],
  },
  {
    id: 'montagnes',
    label: 'Montagnes',
    regions: [
      { id: 'cavally', label: 'Cavally', communes: ['Guiglo', 'Bloléquin', 'Toulépleu'] },
      { id: 'guemon', label: 'Guémon', communes: ['Duékoué', 'Bangolo', 'Kouibly', 'Facobly'] },
      { id: 'tonkpi', label: 'Tonkpi', communes: ['Man', 'Danané', 'Biankouma', 'Zouan-Hounien', 'Sipilou'] },
    ],
  },
  {
    id: 'sassandra-marahoue',
    label: 'Sassandra-Marahoué',
    regions: [
      { id: 'haut-sassandra', label: 'Haut-Sassandra', communes: ['Daloa', 'Issia', 'Vavoua', 'Zoukougbeu'] },
      { id: 'marahoue', label: 'Marahoué', communes: ['Bouaflé', 'Sinfra', 'Zuénoula'] },
    ],
  },
  {
    id: 'savanes',
    label: 'Savanes',
    regions: [
      { id: 'bagoue', label: 'Bagoué', communes: ['Boundiali', 'Tengréla', 'Kouto'] },
      { id: 'poro', label: 'Poro', communes: ['Korhogo', 'Sinématiali', 'M’Bengué', 'Dikodougou'] },
      { id: 'tchologo', label: 'Tchologo', communes: ['Ferkessédougou', 'Ouangolodougou', 'Kong'] },
    ],
  },
  {
    id: 'vallee-bandama',
    label: 'Vallée du Bandama',
    regions: [
      { id: 'gbeke', label: 'Gbêkê', communes: ['Bouaké', 'Sakassou', 'Béoumi', 'Botro'] },
      { id: 'hambol', label: 'Hambol', communes: ['Katiola', 'Dabakala', 'Niakaramandougou'] },
    ],
  },
  {
    id: 'woroba',
    label: 'Woroba',
    regions: [
      { id: 'bafing', label: 'Bafing', communes: ['Touba', 'Koro', 'Ouaninou'] },
      { id: 'bere', label: 'Béré', communes: ['Mankono', 'Dianra', 'Kounahiri'] },
      { id: 'worodougou', label: 'Worodougou', communes: ['Séguéla', 'Kani'] },
    ],
  },
  {
    id: 'zanzan',
    label: 'Zanzan',
    regions: [
      { id: 'bounkani', label: 'Bounkani', communes: ['Bouna', 'Doropo', 'Téhini', 'Nassian'] },
      { id: 'gontougo', label: 'Gontougo', communes: ['Bondoukou', 'Tanda', 'Koun-Fao', 'Sandégué'] },
    ],
  },
];

function getDistrict(id) {
  return districts.find((d) => d.id === id);
}
function getRegion(districtId, regionId) {
  const d = getDistrict(districtId);
  return d ? d.regions.find((r) => r.id === regionId) : null;
}

module.exports = { districts, getDistrict, getRegion };
