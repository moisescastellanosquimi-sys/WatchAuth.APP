export interface WatchModel {
  brand: string;
  model: string;
  referenceNumbers: string[];
  yearIntroduced: number;
  priceRange: { min: number; max: number };
  keyFeatures: string[];
  materials: string[];
  movements: string[];
}

export const LUXURY_WATCH_DATABASE: WatchModel[] = [
  {
    brand: 'Rolex',
    model: 'Submariner',
    referenceNumbers: ['126610LN', '126610LV', '126619LB', '126618LN', '126613LN', '126613LB', '124060', '116610LN', '116610LV'],
    yearIntroduced: 1953,
    priceRange: { min: 9500, max: 45000 },
    keyFeatures: ['Ceramic bezel', 'Oyster case', 'Mercedes hands', '300m water resistance', 'Chromalight display', 'Glidelock extension'],
    materials: ['Oystersteel', 'Yellow gold', 'White gold', 'Rolesor'],
    movements: ['Cal. 3235', 'Cal. 3230'],
  },
  {
    brand: 'Rolex',
    model: 'Daytona',
    referenceNumbers: ['126500LN', '126508', '126509', '126506', '126519LN', '126500WN', '116500LN', '116520'],
    yearIntroduced: 1963,
    priceRange: { min: 30000, max: 95000 },
    keyFeatures: ['Chronograph', 'Tachymeter bezel', 'Oyster case', 'Racing design', 'Ceramic bezel', 'Cal. 4131 movement'],
    materials: ['Oystersteel', 'White gold', 'Yellow gold', 'Everose gold', 'Platinum'],
    movements: ['Cal. 4131', 'Cal. 4130'],
  },
  {
    brand: 'Rolex',
    model: 'GMT-Master II',
    referenceNumbers: ['126710BLRO', '126710BLNR', '126710GRNR', '126720VTNR', '126711CHNR', '126715CHNR', '126719BLRO', '116710LN'],
    yearIntroduced: 1982,
    priceRange: { min: 11000, max: 52000 },
    keyFeatures: ['Dual time zone', 'Ceramic bezel', 'Jubilee/Oyster bracelet', '24-hour hand', 'Chromalight display', 'Pepsi/Batman/Sprite bezels'],
    materials: ['Oystersteel', 'Yellow gold', 'White gold', 'Everose gold', 'Rolesor'],
    movements: ['Cal. 3285', 'Cal. 3186'],
  },
  {
    brand: 'Rolex',
    model: 'Datejust',
    referenceNumbers: ['126234', '126200', '126334', '126333', '126300', '126301', '278274', '278383', '278384', '116234'],
    yearIntroduced: 1945,
    priceRange: { min: 7200, max: 18000 },
    keyFeatures: ['Date window', 'Cyclops lens', 'Fluted bezel', 'Jubilee/Oyster bracelet', 'Chromalight display', '36mm/41mm sizes'],
    materials: ['Oystersteel', 'Yellow gold', 'White gold', 'Everose gold', 'Rolesor'],
    movements: ['Cal. 3235', 'Cal. 3135'],
  },
  {
    brand: 'Rolex',
    model: 'Day-Date',
    referenceNumbers: ['228238', '228235', '228239', '228206', '228349RBR', '128238', '118238'],
    yearIntroduced: 1956,
    priceRange: { min: 38000, max: 120000 },
    keyFeatures: ['Day and date display', 'President bracelet', 'Precious metals only', 'Chromalight display', 'Double aperture'],
    materials: ['Yellow gold', 'White gold', 'Everose gold', 'Platinum'],
    movements: ['Cal. 3255'],
  },
  {
    brand: 'Rolex',
    model: 'Explorer',
    referenceNumbers: ['124270', '124273', '214270', '114270'],
    yearIntroduced: 1953,
    priceRange: { min: 7500, max: 13000 },
    keyFeatures: ['3-6-9 dial', 'Simple design', 'Oyster case', 'Chromalight display', '36mm case', 'Time-only'],
    materials: ['Oystersteel', 'Rolesor'],
    movements: ['Cal. 3230', 'Cal. 3132'],
  },
  {
    brand: 'Rolex',
    model: 'Sea-Dweller',
    referenceNumbers: ['126600', '126603', '136660', '116600', '1665'],
    yearIntroduced: 1967,
    priceRange: { min: 13500, max: 20000 },
    keyFeatures: ['Helium escape valve', '1220m water resistance', 'No cyclops', 'Red Sea-Dweller text', '43mm case', 'Ceramic bezel'],
    materials: ['Oystersteel', 'Rolesor', 'Yellow gold'],
    movements: ['Cal. 3235', 'Cal. 3135'],
  },
  {
    brand: 'Rolex',
    model: 'Deepsea',
    referenceNumbers: ['136660', '126660', '136668LB', '116660'],
    yearIntroduced: 2008,
    priceRange: { min: 14000, max: 25000 },
    keyFeatures: ['3900m water resistance', 'Ringlock System', 'Helium escape valve', 'Extra thick case', '44mm case', 'D-Blue dial', 'RLX titanium back'],
    materials: ['Oystersteel', 'RLX titanium', 'Yellow gold'],
    movements: ['Cal. 3235', 'Cal. 3135'],
  },
  {
    brand: 'Rolex',
    model: 'Yacht-Master',
    referenceNumbers: ['126622', '126621', '126655', '226658', '226659', '116622', '268622'],
    yearIntroduced: 1992,
    priceRange: { min: 12000, max: 65000 },
    keyFeatures: ['Rotatable bezel', 'Nautical design', 'Oysterflex strap option', 'Polished bezel', '40mm/42mm sizes', 'Bidirectional bezel'],
    materials: ['Oystersteel', 'Rolesor', 'Everose gold', 'Yellow gold', 'White gold'],
    movements: ['Cal. 3235', 'Cal. 3135'],
  },
  {
    brand: 'Rolex',
    model: 'Sky-Dweller',
    referenceNumbers: ['336934', '336935', '336938', '336239', '336933', '326934', '326935', '326238'],
    yearIntroduced: 2012,
    priceRange: { min: 17000, max: 58000 },
    keyFeatures: ['Annual calendar', 'Dual time zone', 'Saros system', 'Fluted ring command bezel', '42mm case', 'Month display'],
    materials: ['Oystersteel', 'Rolesor', 'Yellow gold', 'White gold', 'Everose gold'],
    movements: ['Cal. 9002', 'Cal. 9001'],
  },
  {
    brand: 'Rolex',
    model: 'Milgauss',
    referenceNumbers: ['116400GV', '116400'],
    yearIntroduced: 1956,
    priceRange: { min: 9500, max: 12000 },
    keyFeatures: ['Anti-magnetic', 'Green sapphire crystal', 'Lightning bolt hand', '1000 gauss resistance', 'Z-Blue dial', 'Scientific heritage'],
    materials: ['Oystersteel'],
    movements: ['Cal. 3131'],
  },
  {
    brand: 'Rolex',
    model: 'Air-King',
    referenceNumbers: ['126900', '116900'],
    yearIntroduced: 1945,
    priceRange: { min: 7500, max: 8500 },
    keyFeatures: ['Aviation heritage', '3-6-9 dial', 'Chromalight display', 'Oyster case', '40mm case', 'Black dial'],
    materials: ['Oystersteel'],
    movements: ['Cal. 3230', 'Cal. 3131'],
  },
  {
    brand: 'Rolex',
    model: 'Explorer II',
    referenceNumbers: ['226570', '226571', '216570'],
    yearIntroduced: 1971,
    priceRange: { min: 10000, max: 14500 },
    keyFeatures: ['24-hour hand', 'Fixed bezel', 'Cave exploration design', 'Date window', '42mm case', 'White/black dial options'],
    materials: ['Oystersteel', 'Rolesor'],
    movements: ['Cal. 3285', 'Cal. 3187'],
  },
  {
    brand: 'Rolex',
    model: 'Oyster Perpetual',
    referenceNumbers: ['124300', '126000', '277200', '124200', '277300'],
    yearIntroduced: 1931,
    priceRange: { min: 6500, max: 9000 },
    keyFeatures: ['No date', 'Colorful dials', 'Entry-level Rolex', 'Simple design', '31mm/36mm/41mm sizes', 'Bright dial colors'],
    materials: ['Oystersteel'],
    movements: ['Cal. 3230'],
  },
  {
    brand: 'Rolex',
    model: 'Perpetual 1908',
    referenceNumbers: ['52508', '52509', '52510', '52505'],
    yearIntroduced: 2023,
    priceRange: { min: 25000, max: 38000 },
    keyFeatures: ['Dress watch', 'Thin profile', 'Manual winding', 'Small seconds', 'Elegant design', '39mm case', 'Domed crystal', 'Leather strap'],
    materials: ['Yellow gold', 'White gold', 'Platinum'],
    movements: ['Cal. 7140'],
  },
  {
    brand: 'Rolex',
    model: 'Land-Dweller',
    referenceNumbers: ['127334', '127335', '127385TBR', '127386TBR', '127336', '127286TBR', '127234', '127236', '127235', '127285TBR', 'M127334-0001', 'M127335-0001', 'M127385TBR-0001', 'M127386TBR-0001', 'M127336-0001', 'M127286TBR-0001', 'M127234-0001', 'M127236-0001', 'M127235-0001', 'M127285TBR-0001'],
    yearIntroduced: 2025,
    priceRange: { min: 14800, max: 93000 },
    keyFeatures: ['36mm and 40mm case sizes', 'Integrated bracelet design', '5 Hz high frequency movement', 'Chromalight display', '32 patent applications', '18 model-exclusive patents', 'Fluid case lines', 'Modern elegance design', 'Calibre 7135', 'New Rolex 2025 collection'],
    materials: ['Oystersteel', 'White gold', 'Platinum', 'Everose gold'],
    movements: ['Cal. 7135'],
  },
  {
    brand: 'Patek Philippe',
    model: 'Nautilus',
    referenceNumbers: ['5711/1A', '5712/1A', '5726/1A', '5980/1A', '5811/1A'],
    yearIntroduced: 1976,
    priceRange: { min: 70000, max: 150000 },
    keyFeatures: ['Porthole design', 'Integrated bracelet', 'Horizontal embossed dial'],
    materials: ['Stainless steel', 'White gold', 'Rose gold'],
    movements: ['Cal. 26-330 S C', 'Cal. 324 S C'],
  },
  {
    brand: 'Patek Philippe',
    model: 'Aquanaut',
    referenceNumbers: ['5167A', '5168G', '5164A', '5968A', '5267A'],
    yearIntroduced: 1997,
    priceRange: { min: 40000, max: 90000 },
    keyFeatures: ['Rounded octagonal case', 'Tropical composite strap', 'Embossed dial'],
    materials: ['Stainless steel', 'White gold', 'Rose gold'],
    movements: ['Cal. 26-330 S C', 'Cal. 324 S C'],
  },
  {
    brand: 'Patek Philippe',
    model: 'Calatrava',
    referenceNumbers: ['5196', '5227', '6119', '5296', '5116'],
    yearIntroduced: 1932,
    priceRange: { min: 25000, max: 50000 },
    keyFeatures: ['Simple round case', 'Dress watch', 'Minimalist design', 'Officer case back'],
    materials: ['White gold', 'Rose gold', 'Yellow gold', 'Platinum'],
    movements: ['Cal. 215 PS', 'Cal. 324 S C'],
  },
  {
    brand: 'Audemars Piguet',
    model: 'Royal Oak',
    referenceNumbers: ['15400ST', '15500ST', '15202ST', '26331ST', '15510ST'],
    yearIntroduced: 1972,
    priceRange: { min: 30000, max: 90000 },
    keyFeatures: ['Octagonal bezel', 'Integrated bracelet', 'Tapisserie dial', 'Exposed screws'],
    materials: ['Stainless steel', 'Rose gold', 'White gold', 'Titanium'],
    movements: ['Cal. 3120', 'Cal. 4302', 'Cal. 2121'],
  },
  {
    brand: 'Audemars Piguet',
    model: 'Royal Oak Offshore',
    referenceNumbers: ['26470ST', '26400SO', '26238ST', '15710ST', '26420SO'],
    yearIntroduced: 1993,
    priceRange: { min: 25000, max: 80000 },
    keyFeatures: ['Large case', 'Chronograph', 'Rubber strap option', 'Bold design'],
    materials: ['Stainless steel', 'Rose gold', 'Titanium', 'Ceramic'],
    movements: ['Cal. 3126/3840', 'Cal. 4404'],
  },
  {
    brand: 'Audemars Piguet',
    model: 'Code 11.59',
    referenceNumbers: ['15210OR', '15210BC', '26393BC', '26393OR'],
    yearIntroduced: 2019,
    priceRange: { min: 35000, max: 100000 },
    keyFeatures: ['Round case', 'Sapphire crystal sides', 'Modern design', 'Multiple complications'],
    materials: ['Rose gold', 'White gold', 'Stainless steel'],
    movements: ['Cal. 4302', 'Cal. 4401'],
  },
  {
    brand: 'Omega',
    model: 'Speedmaster Professional',
    referenceNumbers: ['310.30.42.50.01.001', '310.32.42.50.01.001', '311.30.42.30.01.005'],
    yearIntroduced: 1957,
    priceRange: { min: 6000, max: 12000 },
    keyFeatures: ['Moonwatch', 'Chronograph', 'Tachymeter bezel', 'Hesalite crystal'],
    materials: ['Stainless steel', 'Gold', 'Titanium'],
    movements: ['Cal. 3861', 'Cal. 1861'],
  },
  {
    brand: 'Omega',
    model: 'Seamaster 300M',
    referenceNumbers: ['210.30.42.20.01.001', '210.32.42.20.01.001', '210.90.42.20.01.001'],
    yearIntroduced: 1993,
    priceRange: { min: 5000, max: 10000 },
    keyFeatures: ['Helium escape valve', 'Ceramic bezel', 'Wave dial', '300m water resistance'],
    materials: ['Stainless steel', 'Gold', 'Titanium', 'Sedna gold'],
    movements: ['Cal. 8800', 'Cal. 8806'],
  },
  {
    brand: 'Omega',
    model: 'Constellation',
    referenceNumbers: ['131.10.29.20.52.001', '131.20.29.20.52.002', '131.25.29.20.52.002'],
    yearIntroduced: 1952,
    priceRange: { min: 4000, max: 12000 },
    keyFeatures: ['Griffes claws', 'Star emblem', 'Pie-pan dial', 'Integrated bracelet'],
    materials: ['Stainless steel', 'Gold', 'Sedna gold'],
    movements: ['Cal. 8700', 'Cal. 8800'],
  },
  {
    brand: 'Cartier',
    model: 'Santos',
    referenceNumbers: ['WSSA0029', 'WSSA0018', 'WSSA0030', 'WGSA0007'],
    yearIntroduced: 1904,
    priceRange: { min: 7000, max: 35000 },
    keyFeatures: ['Square case', 'Exposed screws', 'Roman numerals', 'Quick-change bracelet'],
    materials: ['Stainless steel', 'Gold', 'Rose gold'],
    movements: ['Cal. 1847 MC', 'Cal. 9612 MC'],
  },
  {
    brand: 'Cartier',
    model: 'Tank',
    referenceNumbers: ['WSTA0041', 'WSTA0052', 'W5200003', 'WGTA0041'],
    yearIntroduced: 1917,
    priceRange: { min: 3500, max: 30000 },
    keyFeatures: ['Rectangular case', 'Roman numerals', 'Railroad track minutes', 'Blue sword hands'],
    materials: ['Stainless steel', 'Yellow gold', 'Rose gold', 'White gold'],
    movements: ['Cal. 1847 MC', 'Quartz'],
  },
  {
    brand: 'IWC',
    model: 'Pilot\'s Watch',
    referenceNumbers: ['IW377709', 'IW327009', 'IW377710', 'IW389002'],
    yearIntroduced: 1936,
    priceRange: { min: 5000, max: 15000 },
    keyFeatures: ['Large crown', 'Conical crown', 'High contrast dial', 'Anti-magnetic'],
    materials: ['Stainless steel', 'Bronze', 'Titanium', 'Ceramic'],
    movements: ['Cal. 69380', 'Cal. 32110'],
  },
  {
    brand: 'IWC',
    model: 'Portugieser',
    referenceNumbers: ['IW371605', 'IW500710', 'IW371617', 'IW503501'],
    yearIntroduced: 1939,
    priceRange: { min: 12000, max: 30000 },
    keyFeatures: ['Large case', 'Railway track dial', 'Leaf hands', 'Arabic numerals'],
    materials: ['Stainless steel', 'Rose gold', 'White gold'],
    movements: ['Cal. 79350', 'Cal. 52010'],
  },
  {
    brand: 'Panerai',
    model: 'Luminor',
    referenceNumbers: ['PAM01312', 'PAM01359', 'PAM00524', 'PAM01117'],
    yearIntroduced: 1950,
    priceRange: { min: 6000, max: 25000 },
    keyFeatures: ['Crown guard', 'Cushion case', 'Sandwich dial', 'Large numerals'],
    materials: ['Stainless steel', 'Titanium', 'Bronze', 'Goldtech'],
    movements: ['P.9010', 'P.9000', 'P.6000'],
  },
  {
    brand: 'TAG Heuer',
    model: 'Carrera',
    referenceNumbers: ['CBK2110', 'CBN2A1A', 'CV2A1AB', 'CAR2A1W'],
    yearIntroduced: 1963,
    priceRange: { min: 3000, max: 8000 },
    keyFeatures: ['Chronograph', 'Racing design', 'Tachymeter scale', 'Date window'],
    materials: ['Stainless steel', 'Gold', 'Titanium'],
    movements: ['Heuer 02', 'Calibre 16'],
  },
  {
    brand: 'Breitling',
    model: 'Navitimer',
    referenceNumbers: ['A23322', 'AB0127', 'A17395', 'AB0910'],
    yearIntroduced: 1952,
    priceRange: { min: 7000, max: 15000 },
    keyFeatures: ['Slide rule bezel', 'Chronograph', 'Aviation computer', 'AOPA wings'],
    materials: ['Stainless steel', 'Gold', 'Rose gold'],
    movements: ['B01', 'B23'],
  },
  {
    brand: 'Jaeger-LeCoultre',
    model: 'Reverso',
    referenceNumbers: ['Q3978480', 'Q2548520', 'Q3958420', 'Q2788520'],
    yearIntroduced: 1931,
    priceRange: { min: 6000, max: 50000 },
    keyFeatures: ['Reversible case', 'Art Deco design', 'Swivel mechanism', 'Rectangular case'],
    materials: ['Stainless steel', 'Rose gold', 'White gold'],
    movements: ['Cal. 854', 'Cal. 822'],
  },
  {
    brand: 'Vacheron Constantin',
    model: 'Overseas',
    referenceNumbers: ['4500V', '7900V', '5500V', '2000V'],
    yearIntroduced: 1996,
    priceRange: { min: 25000, max: 80000 },
    keyFeatures: ['Integrated bracelet', 'Quick-change strap', 'Maltese cross bezel', 'Sports luxury'],
    materials: ['Stainless steel', 'Rose gold', 'White gold'],
    movements: ['Cal. 5100', 'Cal. 2460'],
  },
  {
    brand: 'A. Lange & Söhne',
    model: 'Lange 1',
    referenceNumbers: ['101.021', '191.032', '101.027', '191.039'],
    yearIntroduced: 1994,
    priceRange: { min: 40000, max: 80000 },
    keyFeatures: ['Asymmetric dial', 'Outsized date', 'Three-day power reserve', 'German silver'],
    materials: ['White gold', 'Rose gold', 'Yellow gold', 'Platinum'],
    movements: ['L121.1', 'L901.0'],
  },
  {
    brand: 'Hublot',
    model: 'Big Bang',
    referenceNumbers: ['301.SB.131.RX', '411.NM.1170.RX', '301.PX.1180.RX'],
    yearIntroduced: 2005,
    priceRange: { min: 12000, max: 25000 },
    keyFeatures: ['Fusion concept', 'Visible screws', 'Rubber strap', 'Skeleton dial'],
    materials: ['Ceramic', 'Titanium', 'King Gold', 'Carbon'],
    movements: ['HUB1242', 'HUB4100'],
  },
  {
    brand: 'Grand Seiko',
    model: 'Heritage',
    referenceNumbers: ['SBGR311', 'SBGA413', 'SBGM221', 'SBGA211'],
    yearIntroduced: 1960,
    priceRange: { min: 5000, max: 12000 },
    keyFeatures: ['Zaratsu polishing', 'Spring Drive', 'Hand-finished', 'Precision'],
    materials: ['Stainless steel', 'Titanium', 'Platinum'],
    movements: ['9S85', '9R65', '9S27'],
  },
  {
    brand: 'Tudor',
    model: 'Black Bay',
    referenceNumbers: ['79230N', '79230B', '79230R', 'M79230N-0009'],
    yearIntroduced: 2012,
    priceRange: { min: 3500, max: 5000 },
    keyFeatures: ['Snowflake hands', 'Domed crystal', 'Rivet bracelet', '200m water resistance'],
    materials: ['Stainless steel'],
    movements: ['MT5602', 'MT5612'],
  },
  {
    brand: 'Tudor',
    model: 'Pelagos',
    referenceNumbers: ['25600TN', '25600TB', '25407N', 'M25407N-0001'],
    yearIntroduced: 2012,
    priceRange: { min: 4000, max: 5500 },
    keyFeatures: ['Titanium case', '500m water resistance', 'Helium valve', 'Ceramic bezel'],
    materials: ['Titanium'],
    movements: ['MT5612', 'MT5400'],
  },
];

export function findWatchByReference(referenceNumber: string): WatchModel | undefined {
  return LUXURY_WATCH_DATABASE.find(watch => 
    watch.referenceNumbers.some(ref => 
      ref.toLowerCase().includes(referenceNumber.toLowerCase())
    )
  );
}

export function findWatchesByBrand(brand: string): WatchModel[] {
  return LUXURY_WATCH_DATABASE.filter(watch => 
    watch.brand.toLowerCase() === brand.toLowerCase()
  );
}

export function getWatchKnowledgeBase(): string {
  const brands = [...new Set(LUXURY_WATCH_DATABASE.map(w => w.brand))];
  const brandDetails = brands.map(brand => {
    const models = LUXURY_WATCH_DATABASE.filter(w => w.brand === brand);
    const modelList = models
      .map(m => {
        const refs = m.referenceNumbers.slice(0, 3).filter(Boolean);
        const refText = refs.length > 0 ? refs.join(', ') : 'refs: n/a';
        return `${m.model} (${refText})`;
      })
      .join(', ');
    return `${brand}: ${modelList}`;
  });
  
  return `
LUXURY WATCH DATABASE (2025 Updated):

${brandDetails.join('\n\n')}

NEW 2025 RELEASES - THESE ARE REAL WATCHES:
- ROLEX LAND-DWELLER (2025): Brand new Rolex model officially released in 2025. Features: integrated bracelet design, 36mm and 40mm case sizes, Cal. 7135 movement with 5 Hz high frequency, fluid case lines, modern elegance, Chromalight display.
  40mm References: 127334 (Oystersteel/white gold), 127335 (Everose gold), 127385TBR (Everose gold/diamonds), 127386TBR (Platinum/diamonds), 127336 (Platinum).
  36mm References: 127234 (Oystersteel/white gold), 127235 (Everose gold), 127285TBR (Everose gold/diamonds), 127286TBR (Platinum/diamonds), 127236 (Platinum).
  Price range: €14,800-€93,150. THIS IS A LEGITIMATE ROLEX MODEL - NOT FAKE.

Key identification features:
- Rolex: Oyster case, Mercedes hands, Cyclops date magnifier, ceramic bezels (modern), crown logo at 12
- Rolex Land-Dweller (2025): Integrated bracelet, fluid case lines, modern elegance, no cyclops, 5 Hz movement
- Patek Philippe: Calatrava cross logo, intricate finishing, porthole design (Nautilus), tropical strap (Aquanaut)
- Audemars Piguet: Octagonal bezel, tapisserie dial, integrated bracelet, exposed screws
- Omega: Hippocampus logo, wave dial patterns (Seamaster), Moonwatch history (Speedmaster)
- Cartier: Blue cabochon crown, Roman numerals, railroad track minutes, Art Deco design
- IWC: Large conical crown, railway track dial (Portugieser), pilot design language
- Panerai: Crown guard, sandwich dial, large cushion case, California dial
- Grand Seiko: Zaratsu polishing, perfect dial finishing, Spring Drive smooth sweep

Current market trends (2024-2025):
- Rolex Land-Dweller (NEW 2025): €14,800-€93,150 (40mm refs: 127334, 127335, 127385TBR, 127386TBR, 127336) (36mm refs: 127234, 127235, 127285TBR, 127286TBR, 127236)
- Rolex Submariner 126610LN: $12,000-$15,000
- Patek Nautilus 5711/1A (discontinued): $80,000-$150,000
- AP Royal Oak 15500ST: $45,000-$75,000
- Omega Speedmaster Professional: $6,000-$8,000
`;
}
