import detailsHistory from './content/details_history.json';

export const HISTORY_REELS_DATA = {
  // ==========================================
  // TOPIC 1 - PHASE 0: INDUS VALLEY CIVILISATION
  // ==========================================
  his_1_p0_s0_b0: {
    title: "Citadel vs Lower Town Layout",
    examTakeaways: [
      "Citadel stood elevated to the West on a +12m mud-brick platform for flood defense and civic administration.",
      "Lower Town to the East housed common citizens in an orthogonal 90° cardinal street grid.",
      "UPSC Traps: Dholavira features a 3-tier layout, while Chanhudaro has NO citadel at all."
    ],
    scenes: [
      {
        id: 1,
        title: 'Bifurcated Cities: Citadel vs Lower Town',
        hook: 'How did Harappans flood-proof their cities 4,500 years ago?',
        tag: 'Zoning & Elevation',
        audioText: 'Harappan cities were strictly bifurcated into two distinct zones. On the west stood the Citadel, raised on a twelve-meter mud brick platform to protect from floods. On the east lay the Lower Town for common residential life.',
        subtitleWords: [
          { text: 'STRICTLY', highlight: false },
          { text: 'BIFURCATED:', highlight: true },
          { text: 'ELEVATED', highlight: true },
          { text: 'WESTERN', highlight: false },
          { text: 'CITADEL', highlight: true },
          { text: '(+12M MUD PLATFORM)', highlight: true },
          { text: 'VS', highlight: false },
          { text: 'EASTERN', highlight: false },
          { text: 'LOWER', highlight: false },
          { text: 'TOWN', highlight: true }
        ],
        visualType: 'zoning'
      },
      {
        id: 2,
        title: 'The Great Bath & Granary Vaults',
        hook: 'The world\'s earliest bitumen waterproofing & food vaults!',
        tag: 'Engineering Hallmarks',
        audioText: 'Inside the Citadel stood the Great Bath, lined with burnt bricks and waterproofed with natural bitumen asphalt. Adjacent state granaries featured sub-floor air ducts to stop grain rot.',
        subtitleWords: [
          { text: 'THE', highlight: false },
          { text: 'GREAT', highlight: true },
          { text: 'BATH:', highlight: true },
          { text: 'SEALED', highlight: false },
          { text: 'WITH', highlight: false },
          { text: 'NATURAL', highlight: true },
          { text: 'BITUMEN', highlight: true },
          { text: 'ASPHALT', highlight: true },
          { text: '•', highlight: false },
          { text: 'VENTILATED', highlight: true },
          { text: 'GRANARIES', highlight: true }
        ],
        visualType: 'bath'
      },
      {
        id: 3,
        title: 'The Cardinal 90° Street Grid',
        hook: 'Streets that cleaned themselves using the wind!',
        tag: 'Civic Urban Planning',
        audioText: 'The Lower Town was planned on a strict cardinal grid running North-South and East-West. Avenues met at exact ninety degree angles, allowing prevailing winds to naturally sweep the streets clean.',
        subtitleWords: [
          { text: 'CARDINAL', highlight: true },
          { text: 'GRID:', highlight: true },
          { text: '90°', highlight: true },
          { text: 'RIGHT', highlight: false },
          { text: 'ANGLES', highlight: true },
          { text: '•', highlight: false },
          { text: 'PREVAILING', highlight: false },
          { text: 'WINDS', highlight: true },
          { text: 'CLEARED', highlight: false },
          { text: 'STREET', highlight: false },
          { text: 'DUST', highlight: true }
        ],
        visualType: 'grid'
      },
      {
        id: 4,
        title: 'Subterranean Covered Sewage',
        hook: 'Private Bathrooms & Soak Pits 2,500 years before Rome!',
        tag: 'Sanitary Masterclass',
        audioText: 'Household bathrooms drained through private soak pits that trapped solid waste first. The wastewater then discharged into covered burnt-brick street sewers with inspection manholes.',
        subtitleWords: [
          { text: '3-STAGE', highlight: true },
          { text: 'DRAINAGE:', highlight: true },
          { text: 'BATHROOM', highlight: false },
          { text: '➔', highlight: false },
          { text: 'SOAK', highlight: true },
          { text: 'PIT', highlight: true },
          { text: '➔', highlight: false },
          { text: 'COVERED', highlight: true },
          { text: 'STREET', highlight: false },
          { text: 'SEWERS', highlight: true }
        ],
        visualType: 'drainage'
      },
      {
        id: 5,
        title: 'UPSC Prelims Master Traps',
        hook: '2 Exceptions guaranteed to appear in Civil Services!',
        tag: 'UPSC Must-Know',
        audioText: 'Remember the UPSC Prelims traps! Dholavira in Gujarat features three distinct urban tiers: Citadel, Middle Town, and Lower Town. While Chanhudaro has no citadel at all!',
        subtitleWords: [
          { text: 'EXAM', highlight: false },
          { text: 'TRAPS:', highlight: true },
          { text: 'DHOLAVIRA', highlight: true },
          { text: '= 3 TIERS', highlight: true },
          { text: '(CITADEL + MIDDLE + LOWER)', highlight: false },
          { text: '•', highlight: false },
          { text: 'CHANHUDARO', highlight: true },
          { text: '= NO', highlight: true },
          { text: 'CITADEL!', highlight: true }
        ],
        visualType: 'exceptions'
      }
    ]
  },

  his_1_p0_s0_b1: {
    title: "Hydraulic Engineering & Maritime Docks",
    examTakeaways: [
      "Standard burnt-brick ratio 1:2:4 was universal across all Indus sites, ensuring structural durability.",
      "Lothal (Gujarat) possessed the world's earliest artificial tidal dockyard connected to the Bhogava River.",
      "Dholavira featured 16 massive rock-cut rainwater reservoirs to withstand arid desert conditions."
    ],
    scenes: [
      {
        id: 1,
        title: 'Standardized Burnt Bricks: The 1:2:4 Ratio',
        hook: 'How did every city across thousands of kilometers use identical bricks?',
        tag: 'Standardized Masonry',
        audioText: 'The foundation of Harappan hydraulic engineering was the kiln-burnt brick. Every single brick followed an exact dimensional ratio of one is to two is to four in thickness, width, and length.',
        subtitleWords: [
          { text: 'KILN-BURNT', highlight: true },
          { text: 'BRICKS:', highlight: false },
          { text: 'EXACT', highlight: false },
          { text: 'RATIO', highlight: true },
          { text: '1 : 2 : 4', highlight: true },
          { text: '(THICKNESS :', highlight: false },
          { text: 'WIDTH :', highlight: false },
          { text: 'LENGTH)', highlight: true },
          { text: '•', highlight: false },
          { text: 'TOTAL', highlight: false },
          { text: 'UNIFORMITY', highlight: true }
        ],
        visualType: 'bricks'
      },
      {
        id: 2,
        title: 'Lothal Tidal Dockyard: Gujarat Coast',
        hook: 'How did ships berth in a tidal basin 4,500 years ago?',
        tag: 'Maritime Engineering',
        audioText: 'At Lothal in Gujarat, Harappan engineers built a massive burnt-brick tidal dockyard connected to the Bhogava River. It featured a sluice gate system to control water levels during high and low tides.',
        subtitleWords: [
          { text: 'LOTHAL', highlight: true },
          { text: 'DOCKYARD:', highlight: true },
          { text: 'TIDAL', highlight: false },
          { text: 'BASIN', highlight: true },
          { text: 'ON', highlight: false },
          { text: 'BHOGAVA', highlight: true },
          { text: 'RIVER', highlight: true },
          { text: '•', highlight: false },
          { text: 'SLUICE', highlight: true },
          { text: 'GATES', highlight: true },
          { text: 'BERTHED', highlight: false },
          { text: 'SHIPS', highlight: true }
        ],
        visualType: 'dockyard'
      },
      {
        id: 3,
        title: 'Dholavira Rock-Cut Mega Reservoirs',
        hook: 'Rainwater harvesting in the arid Rann of Kutch!',
        tag: 'Water Harvesting',
        audioText: 'In the arid Rann of Kutch, Dholavira survived through brilliant rainwater harvesting. Engineers carved sixteen colossal stone-cut reservoirs and diversion dams to trap every drop of monsoon storm runoff.',
        subtitleWords: [
          { text: 'DHOLAVIRA', highlight: true },
          { text: 'RESERVOIRS:', highlight: true },
          { text: '16', highlight: true },
          { text: 'STONE-CUT', highlight: true },
          { text: 'MEGA', highlight: false },
          { text: 'TANKS', highlight: true },
          { text: '•', highlight: false },
          { text: 'STORM-WATER', highlight: true },
          { text: 'HARVESTING', highlight: true },
          { text: 'IN', highlight: false },
          { text: 'KUTCH', highlight: true }
        ],
        visualType: 'reservoir'
      },
      {
        id: 4,
        title: 'Covered Inspection Slabs & Sanitation',
        hook: 'Removable manhole slabs for municipal cleaning staff!',
        tag: 'Civic Hygiene',
        audioText: 'Unlike Mesopotamian cities where waste was dumped in open streets, Harappan main drains were entirely covered with removable limestone slabs. Municipal staff lifted them regularly for inspection.',
        subtitleWords: [
          { text: 'COVERED', highlight: true },
          { text: 'STREET', highlight: false },
          { text: 'DRAINS:', highlight: true },
          { text: 'REMOVABLE', highlight: true },
          { text: 'LIMESTONE', highlight: false },
          { text: 'SLABS', highlight: true },
          { text: '•', highlight: false },
          { text: 'REGULAR', highlight: false },
          { text: 'INSPECTION', highlight: true },
          { text: 'MANHOLES', highlight: true }
        ],
        visualType: 'manhole'
      },
      {
        id: 5,
        title: 'UPSC Prelims Exam Trap',
        hook: 'The one civilizational contrast UPSC loves to test!',
        tag: 'UPSC Comparison',
        audioText: 'UPSC Question Alert! Covered sewage drainage was completely absent in contemporary Egypt and Mesopotamia. This unmatched sanitary infrastructure is unique to the Indus Valley Civilization.',
        subtitleWords: [
          { text: 'PRELIMS', highlight: false },
          { text: 'ALERT:', highlight: true },
          { text: 'COVERED', highlight: true },
          { text: 'SEWAGE', highlight: true },
          { text: 'WAS', highlight: false },
          { text: 'ABSENT', highlight: true },
          { text: 'IN', highlight: false },
          { text: 'EGYPT', highlight: false },
          { text: '&', highlight: false },
          { text: 'MESOPOTAMIA!', highlight: true }
        ],
        visualType: 'trap'
      }
    ]
  },

  his_1_p0_s1_b0: {
    title: "Trade, Weights & Boustrophedon Script",
    examTakeaways: [
      "Mesopotamian Akkadian texts refer to the Indus region as 'Meluha'—trading carnelian, lapis lazuli, and timber.",
      "Chert weights followed a binary progression (1, 2, 4, 8, 16, 32, 64) transitioning into a decimal system for higher values.",
      "The Harappan script remains undeciphered and was written in Boustrophedon (alternating right-to-left and left-to-right)."
    ],
    scenes: [
      {
        id: 1,
        title: 'Maritime Trade with Meluha (Mesopotamia)',
        hook: 'Who was Meluha in Mesopotamian royal inscriptions?',
        tag: 'International Trade',
        audioText: 'Harappan merchants dominated international trade routes. Akkadian cuneiform tablets in Mesopotamia explicitly record ships arriving from Meluha, loaded with carnelian beads, copper, timber, and lapis lazuli.',
        subtitleWords: [
          { text: 'TRADE', highlight: false },
          { text: 'WITH', highlight: false },
          { text: 'MESOPOTAMIA:', highlight: true },
          { text: 'CALLED', highlight: false },
          { text: '\"MELUHA\"', highlight: true },
          { text: 'IN', highlight: false },
          { text: 'CUNEIFORM', highlight: true },
          { text: '•', highlight: false },
          { text: 'CARNELIAN,', highlight: true },
          { text: 'LAPIS,', highlight: false },
          { text: 'TIMBER', highlight: true }
        ],
        visualType: 'meluha'
      },
      {
        id: 2,
        title: 'Standardized Binary-Decimal Chert Weights',
        hook: 'The universal ratio that ruled every market from Sindh to Gujarat!',
        tag: 'Standardized Metrology',
        audioText: 'To prevent fraud, trade was regulated by standardized cubical chert weights. Lower values followed a binary series: one, two, four, eight, sixteen, up to sixty-four, before scaling decimally.',
        subtitleWords: [
          { text: 'CHERT', highlight: true },
          { text: 'WEIGHTS:', highlight: true },
          { text: 'BINARY', highlight: true },
          { text: 'BASE', highlight: false },
          { text: '(1, 2, 4, 8, 16, 32, 64)', highlight: true },
          { text: '➔', highlight: false },
          { text: 'DECIMAL', highlight: true },
          { text: 'FOR', highlight: false },
          { text: 'HIGHER', highlight: false },
          { text: 'VALUES', highlight: true }
        ],
        visualType: 'weights'
      },
      {
        id: 3,
        title: 'Steatite Seals: The Merchant Signature',
        hook: 'Over 2,000 square seals found, but what did they do?',
        tag: 'Merchant Security',
        audioText: 'Harappan merchants stamped square steatite seals onto wet clay on cargo packages. The seal guaranteed origin and proved tampering. Most seals depicted the unicorn, bull, elephant, or rhinoceros.',
        subtitleWords: [
          { text: 'STEATITE', highlight: true },
          { text: 'SEALS:', highlight: true },
          { text: 'USED', highlight: false },
          { text: 'FOR', highlight: false },
          { text: 'CARGO', highlight: true },
          { text: 'SECURITY', highlight: true },
          { text: '•', highlight: false },
          { text: 'PROMINENT', highlight: false },
          { text: 'UNICORN', highlight: true },
          { text: '&', highlight: false },
          { text: 'BULL', highlight: true },
          { text: 'EMBLEMS', highlight: false }
        ],
        visualType: 'seal'
      },
      {
        id: 4,
        title: 'The Undeciphered Boustrophedon Script',
        hook: 'Text that alternates direction like an ox plowing a field!',
        tag: 'Script & Language',
        audioText: 'The Harappan script remains undeciphered. It is logo-syllabic with roughly four hundred signs, written in Boustrophedon style: the first line runs right-to-left, and the next line runs left-to-right.',
        subtitleWords: [
          { text: 'BOUSTROPHEDON', highlight: true },
          { text: 'SCRIPT:', highlight: true },
          { text: 'LINE 1', highlight: false },
          { text: 'RIGHT-TO-LEFT', highlight: true },
          { text: '➔', highlight: false },
          { text: 'LINE 2', highlight: false },
          { text: 'LEFT-TO-RIGHT', highlight: true },
          { text: '•', highlight: false },
          { text: 'UNDECIPHERED!', highlight: true }
        ],
        visualType: 'script'
      },
      {
        id: 5,
        title: 'UPSC Prelims Barter Trap',
        hook: 'Did the Harappans have metallic coins?',
        tag: 'Currency Myth',
        audioText: 'Vital Prelims Trap! Despite their booming commerce, the Harappans had zero metallic coinage. Trade operated entirely on an organized barter system strictly calibrated by standardized chert weights.',
        subtitleWords: [
          { text: 'EXAM', highlight: false },
          { text: 'TRAP:', highlight: true },
          { text: 'NO', highlight: true },
          { text: 'METALLIC', highlight: true },
          { text: 'COINS', highlight: true },
          { text: 'EXISTED!', highlight: true },
          { text: '•', highlight: false },
          { text: 'PURE', highlight: false },
          { text: 'BARTER', highlight: true },
          { text: 'REGULATED', highlight: false },
          { text: 'BY', highlight: false },
          { text: 'WEIGHTS', highlight: true }
        ],
        visualType: 'trap'
      }
    ]
  },

  his_1_p0_s1_b1: {
    title: "Metallurgy & Artistic Stratigraphy",
    examTakeaways: [
      "Mastered lost-wax casting (Cire Perdue) to sculpt the bronze Dancing Girl of Mohenjo-daro.",
      "The steatite Pashupati Seal depicts a proto-Shiva yogic figure surrounded by 4 animals (Elephant, Tiger, Rhino, Buffalo) plus 2 deer at the feet.",
      "Harappans were a Bronze/Copper Age society—they had absolutely NO knowledge of iron!"
    ],
    scenes: [
      {
        id: 1,
        title: 'The Lost-Wax Bronze Technique (Cire Perdue)',
        hook: 'How was the 10.5cm Dancing Girl cast in hollow bronze?',
        tag: 'Bronze Metallurgy',
        audioText: 'Harappan metallurgists pioneered the lost-wax technique, or Cire Perdue. A wax model was coated in clay, heated to drain the melted wax, and filled with molten bronze alloy to create hollow masterpieces.',
        subtitleWords: [
          { text: 'LOST-WAX', highlight: true },
          { text: 'CASTING', highlight: true },
          { text: '(CIRE PERDUE):', highlight: true },
          { text: 'WAX', highlight: false },
          { text: 'MODEL', highlight: false },
          { text: '➔', highlight: false },
          { text: 'CLAY', highlight: false },
          { text: 'MOLD', highlight: true },
          { text: '➔', highlight: false },
          { text: 'MOLTEN', highlight: false },
          { text: 'BRONZE', highlight: true }
        ],
        visualType: 'lostwax'
      },
      {
        id: 2,
        title: 'The Dancing Girl of Mohenjo-daro',
        hook: 'A confident tribal pose that captivated world archaeologists!',
        tag: 'Iconic Sculpture',
        audioText: 'The bronze Dancing Girl of Mohenjo-daro is a world-renowned artifact. Standing just ten and a half centimeters tall, she rests one hand on her hip with her left arm adorned with shell bangles.',
        subtitleWords: [
          { text: 'DANCING', highlight: true },
          { text: 'GIRL:', highlight: true },
          { text: 'MOHENJO-DARO', highlight: false },
          { text: '•', highlight: false },
          { text: '10.5 CM', highlight: true },
          { text: 'BRONZE', highlight: true },
          { text: 'ALLOY', highlight: false },
          { text: '•', highlight: false },
          { text: 'ARM', highlight: false },
          { text: 'OF', highlight: false },
          { text: 'SHELL', highlight: true },
          { text: 'BANGLES', highlight: true }
        ],
        visualType: 'dancinggirl'
      },
      {
        id: 3,
        title: 'The Pashupati Seal: 5 Animals & Proto-Shiva',
        hook: 'Can you name all 5 animals depicted around the yogic figure?',
        tag: 'Religious Iconography',
        audioText: 'The steatite Pashupati Seal depicts a horned three-faced figure seated in a yogic posture. He is surrounded by four wild animals: an elephant, a tiger, a rhinoceros, and a buffalo, with two deer beneath his seat.',
        subtitleWords: [
          { text: 'PASHUPATI', highlight: true },
          { text: 'SEAL:', highlight: true },
          { text: 'PROTO-SHIVA', highlight: true },
          { text: '•', highlight: false },
          { text: 'ELEPHANT,', highlight: true },
          { text: 'TIGER,', highlight: true },
          { text: 'RHINO,', highlight: true },
          { text: 'BUFFALO', highlight: true },
          { text: '+ 2 DEER', highlight: true }
        ],
        visualType: 'pashupati'
      },
      {
        id: 4,
        title: 'Red-and-Black Standardized Pottery',
        hook: 'Glossy red slips with geometric fish-scale motifs!',
        tag: 'Ceramic Art',
        audioText: 'Harappan ceramics were predominantly fast wheel-turned pottery. Jars featured a lustrous red slip painted with black geometric patterns, intersecting circles, peepal leaves, and fish scales.',
        subtitleWords: [
          { text: 'RED-AND-BLACK', highlight: true },
          { text: 'WARE:', highlight: true },
          { text: 'FAST', highlight: false },
          { text: 'WHEEL-TURNED', highlight: true },
          { text: '•', highlight: false },
          { text: 'PEEPAL', highlight: true },
          { text: 'LEAVES,', highlight: false },
          { text: 'FISH', highlight: true },
          { text: 'SCALES,', highlight: false },
          { text: 'CIRCLES', highlight: true }
        ],
        visualType: 'pottery'
      },
      {
        id: 5,
        title: 'The Iron Trap: Bronze Age Only!',
        hook: 'The biggest chronological trap in Ancient History!',
        tag: 'Metallurgy Trap',
        audioText: 'Critical UPSC Alert! Harappans mastered copper, bronze, gold, and silver, but they had absolutely ZERO knowledge of iron. Iron appeared in India only around one thousand BCE during the Later Vedic period.',
        subtitleWords: [
          { text: 'BIGGEST', highlight: false },
          { text: 'PRELIMS', highlight: false },
          { text: 'TRAP:', highlight: true },
          { text: 'HARAPPANS', highlight: false },
          { text: 'KNEW', highlight: false },
          { text: 'NO', highlight: true },
          { text: 'IRON!', highlight: true },
          { text: '•', highlight: false },
          { text: 'BRONZE', highlight: true },
          { text: '&', highlight: false },
          { text: 'COPPER', highlight: true },
          { text: 'ONLY', highlight: true }
        ],
        visualType: 'trap'
      }
    ]
  },

  // ==========================================
  // TOPIC 1 - PHASE 1: EARLY VEDIC PERIOD
  // ==========================================
  his_1_p1_s0_b0: {
    title: "Rig Vedic Pastoralism & Cattle Wealth",
    examTakeaways: [
      "Economy was semi-nomadic and pastoral; cattle (Gau) was the supreme unit of wealth and barter.",
      "Battles were fought for cattle, termed 'Gavisthi' (search for cows), not for territorial land boundaries.",
      "Private land ownership did NOT exist in the Early Vedic era—land belonged communally to the clan."
    ],
    scenes: [
      {
        id: 1,
        title: 'Cattle: The Supreme Unit of Wealth',
        hook: 'Why was money measured in cows instead of gold or land?',
        tag: 'Pastoral Economy',
        audioText: 'The Early Vedic tribes lived a semi-nomadic pastoral life in the Land of Seven Rivers. Agriculture with barley was secondary; livestock cattle, or Gau, was the supreme measure of private wealth and barter exchange.',
        subtitleWords: [
          { text: 'PASTORAL', highlight: true },
          { text: 'ECONOMY:', highlight: true },
          { text: 'CATTLE', highlight: true },
          { text: '(GAU)', highlight: true },
          { text: '= CHIEF', highlight: false },
          { text: 'WEALTH', highlight: true },
          { text: '•', highlight: false },
          { text: 'BARLEY', highlight: false },
          { text: '(YAVA)', highlight: true },
          { text: 'AGRICULTURE', highlight: false }
        ],
        visualType: 'cattle'
      },
      {
        id: 2,
        title: 'Gavisthi: Battles Fought for Cows',
        hook: 'Why did Rig Vedic clans go to war?',
        tag: 'Tribal Warfare',
        audioText: 'Rig Vedic warfare was driven by cattle raiding. Inter-tribal conflicts were called Gavisthi, literally translating to a search for cows. Chiefs did not fight to conquer territory, but to capture cattle herds.',
        subtitleWords: [
          { text: 'GAVISTHI:', highlight: true },
          { text: 'LITERALLY', highlight: false },
          { text: '\"SEARCH', highlight: true },
          { text: 'FOR', highlight: true },
          { text: 'COWS\"', highlight: true },
          { text: '•', highlight: false },
          { text: 'WARFARE', highlight: false },
          { text: 'WAS', highlight: false },
          { text: 'CATTLE', highlight: true },
          { text: 'RAIDING,', highlight: true },
          { text: 'NOT', highlight: false },
          { text: 'LAND', highlight: true }
        ],
        visualType: 'gavisthi'
      },
      {
        id: 3,
        title: 'Cattle-Centric Vocabulary in Rig Veda',
        hook: 'How did language itself measure space using cows?',
        tag: 'Linguistic Evidence',
        audioText: 'The Rig Veda measured distance as Gavyuti—the distance a cow\'s lowing could be heard. A wealthy chief was called Gomat, daughters were called Duhitr meaning milkers, and the king was Gopa or protector of cows.',
        subtitleWords: [
          { text: 'COW', highlight: false },
          { text: 'TERMS:', highlight: true },
          { text: 'GAVYUTI', highlight: true },
          { text: '= DISTANCE', highlight: false },
          { text: '•', highlight: false },
          { text: 'GOMAT', highlight: true },
          { text: '= WEALTHY', highlight: false },
          { text: '•', highlight: false },
          { text: 'GOPA', highlight: true },
          { text: '= KING / PROTECTOR', highlight: true }
        ],
        visualType: 'terms'
      },
      {
        id: 4,
        title: 'No Private Land Ownership',
        hook: 'Who owned the soil in 1500 BCE?',
        tag: 'Land Tenure',
        audioText: 'In the Early Vedic period, private land ownership did not exist. Pastures and clearing lands were held communally by the tribe, or Vis. Wealth was mobile: exclusively counted in cattle and horses.',
        subtitleWords: [
          { text: 'NO', highlight: true },
          { text: 'PRIVATE', highlight: true },
          { text: 'LAND', highlight: true },
          { text: 'OWNERSHIP!', highlight: true },
          { text: '•', highlight: false },
          { text: 'COMMUNAL', highlight: true },
          { text: 'PASTURES', highlight: false },
          { text: '•', highlight: false },
          { text: 'WEALTH', highlight: false },
          { text: 'WAS', highlight: false },
          { text: 'MOBILE', highlight: true }
        ],
        visualType: 'land'
      },
      {
        id: 5,
        title: 'UPSC Prelims Pastoral Trap',
        hook: 'Did Rig Vedic tribes have regular taxes or standing armies?',
        tag: 'State Formation',
        audioText: 'Important UPSC Trap! The Rajan had no standing army and no regular taxation system. People gave voluntary offerings called Bali, and all adult clan members mobilized as militia during conflicts.',
        subtitleWords: [
          { text: 'NO', highlight: true },
          { text: 'STANDING', highlight: true },
          { text: 'ARMY', highlight: true },
          { text: '•', highlight: false },
          { text: 'NO', highlight: true },
          { text: 'REGULAR', highlight: false },
          { text: 'TAXES', highlight: true },
          { text: '•', highlight: false },
          { text: 'VOLUNTARY', highlight: true },
          { text: 'TRIBUTES', highlight: false },
          { text: '(BALI)', highlight: true }
        ],
        visualType: 'trap'
      }
    ]
  },

  his_1_p1_s0_b1: {
    title: "Tribal Democratic Assemblies & Political Polity",
    examTakeaways: [
      "Rig Vedic chiefs (Rajan) were limited by tribal assemblies: Sabha (elders), Samiti (folk folk assembly), and Vidatha (spoils & rituals).",
      "The Samiti had the constitutional power to elect or depose the Rajan.",
      "Crucial distinction: Women had full participation and debating rights in the Sabha and Samiti during the Early Vedic era!"
    ],
    scenes: [
      {
        id: 1,
        title: 'The Rajan: Tribal Chief, Not Monarch',
        hook: 'Could a Vedic king rule as an absolute dictator?',
        tag: 'Kinship Polity',
        audioText: 'The Rig Vedic political structure was tribal, based on kinship units called Jana. The chief, or Rajan, was a military leader and protector of cattle, possessing no divine right or absolute monarchical power.',
        subtitleWords: [
          { text: 'THE', highlight: false },
          { text: 'RAJAN:', highlight: true },
          { text: 'TRIBAL', highlight: false },
          { text: 'CHIEF,', highlight: true },
          { text: 'NOT', highlight: false },
          { text: 'AUTOCRAT', highlight: true },
          { text: '•', highlight: false },
          { text: 'KINSHIP', highlight: true },
          { text: 'POLITY', highlight: false },
          { text: '(JANA)', highlight: true }
        ],
        visualType: 'rajan'
      },
      {
        id: 2,
        title: 'The Sabha: Council of Senior Elders',
        hook: 'The judicial and advisory council of the tribal nobility.',
        tag: 'Judicial Council',
        audioText: 'The Sabha functioned as a selective advisory council consisting of senior tribal elders and distinguished elites. It exercised judicial duties, advised the Rajan on clan disputes, and met in sacred council halls.',
        subtitleWords: [
          { text: 'THE', highlight: false },
          { text: 'SABHA:', highlight: true },
          { text: 'COUNCIL', highlight: false },
          { text: 'OF', highlight: false },
          { text: 'ELDERS', highlight: true },
          { text: '&', highlight: false },
          { text: 'ELITES', highlight: true },
          { text: '•', highlight: false },
          { text: 'JUDICIAL', highlight: true },
          { text: '&', highlight: false },
          { text: 'ADVISORY', highlight: true },
          { text: 'DUTIES', highlight: false }
        ],
        visualType: 'sabha'
      },
      {
        id: 3,
        title: 'The Samiti: Sovereign Folk Assembly',
        hook: 'The general assembly that could elect or depose the king!',
        tag: 'Democratic Mandate',
        audioText: 'The Samiti was the sovereign general folk assembly representing the entire tribe. It held supreme democratic authority, discussing public policy, military campaigns, and holding the statutory power to elect or depose the Rajan.',
        subtitleWords: [
          { text: 'THE', highlight: false },
          { text: 'SAMITI:', highlight: true },
          { text: 'GENERAL', highlight: false },
          { text: 'FOLK', highlight: true },
          { text: 'ASSEMBLY', highlight: true },
          { text: '•', highlight: false },
          { text: 'POWER', highlight: false },
          { text: 'TO', highlight: false },
          { text: 'ELECT', highlight: true },
          { text: 'OR', highlight: false },
          { text: 'DEPOSE', highlight: true },
          { text: 'THE', highlight: false },
          { text: 'RAJAN', highlight: true }
        ],
        visualType: 'samiti'
      },
      {
        id: 4,
        title: 'Women\'s Rights in Vedic Assemblies',
        hook: 'The gender equality feature that was lost in Later Vedic times!',
        tag: 'Gender Inclusion',
        audioText: 'Remarkably, Early Vedic society preserved high gender inclusion. Women attended assembly sessions, participated in high-level debates, and actively performed sacrificial rituals alongside men.',
        subtitleWords: [
          { text: 'WOMEN', highlight: true },
          { text: 'ATTENDED', highlight: false },
          { text: 'SABHA', highlight: true },
          { text: '&', highlight: false },
          { text: 'SAMITI!', highlight: true },
          { text: '•', highlight: false },
          { text: 'ACTIVE', highlight: false },
          { text: 'DEBATING', highlight: true },
          { text: 'RIGHTS', highlight: true },
          { text: 'IN', highlight: false },
          { text: 'EARLY', highlight: false },
          { text: 'VEDIC', highlight: true }
        ],
        visualType: 'women'
      },
      {
        id: 5,
        title: 'The Vidatha: The Ancient Spoils Assembly',
        hook: 'The oldest tribal assembly responsible for war booty.',
        tag: 'Communal Redistribution',
        audioText: 'The Vidatha was the earliest communal tribal gathering. It managed religious ceremonies, military clan operations, and the equitable redistribution of war booty captured during cattle raids.',
        subtitleWords: [
          { text: 'VIDATHA:', highlight: true },
          { text: 'OLDEST', highlight: true },
          { text: 'ASSEMBLY', highlight: false },
          { text: '•', highlight: false },
          { text: 'MANAGED', highlight: false },
          { text: 'REDISTRIBUTION', highlight: true },
          { text: 'OF', highlight: false },
          { text: 'WAR', highlight: false },
          { text: 'BOOTY', highlight: true },
          { text: '&', highlight: false },
          { text: 'RITUALS', highlight: true }
        ],
        visualType: 'vidatha'
      }
    ]
  },

  // ==========================================
  // TOPIC 2: BUDDHISM, JAINISM & SHRAMANIC TRADITIONS
  // ==========================================
  his_2_p0_s0_b0: {
    title: 'Rise of Vaishyas & Kshatriya Reaction',
    examTakeaways: [
      'Iron-backed Gangetic agriculture created a wealthy Vaishya merchant class seeking social status commensurate with their wealth.',
      'Cattle wealth preservation clashed directly with expensive Vedic animal sacrifices (Pashubali).',
      'UPSC Trap: Heterodox traditions were not low-caste peasant rebellions; they were elite critiques led by Kshatriyas and financed by urban Vaishyas.'
    ],
    scenes: [
      {
        id: 1,
        title: 'Iron Surplus & The Merchant Revolution',
        hook: 'Why did merchants finance Buddha and Mahavira?',
        tag: 'Economic Crucible',
        audioText: 'The expansion of iron-backed agriculture in the middle Gangetic plains created unprecedented grain surplus and urban commerce. A wealthy mercantile class, the Vaishyas, emerged but found themselves relegated to the third tier of the Vedic caste hierarchy.',
        subtitleWords: [
          { text: 'IRON', highlight: true },
          { text: 'SURPLUS', highlight: false },
          { text: '➔', highlight: false },
          { text: 'RISE', highlight: false },
          { text: 'OF', highlight: false },
          { text: 'VAISHYA', highlight: true },
          { text: 'MERCHANTS', highlight: true },
          { text: '•', highlight: false },
          { text: 'SOUGHT', highlight: false },
          { text: 'HIGHER', highlight: false },
          { text: 'SOCIAL', highlight: true },
          { text: 'STATUS', highlight: true }
        ],
        visualType: 'dharma_wheel'
      },
      {
        id: 2,
        title: 'Cattle Wealth vs Sacrificial Slaughter',
        hook: 'How Vedic animal sacrifices crippled farm productivity!',
        tag: 'Material Necessity',
        audioText: 'Plough agriculture required heavy animal draught power. Repeated Brahminical cattle sacrifices at public Yajnas depleted vital farm livestock, making non-violence, or Ahimsa, an economic necessity for farmers and traders.',
        subtitleWords: [
          { text: 'AGRICULTURE', highlight: false },
          { text: 'NEEDED', highlight: false },
          { text: 'BULLOCK', highlight: true },
          { text: 'POWER', highlight: true },
          { text: '•', highlight: false },
          { text: 'YAJNA', highlight: false },
          { text: 'SLAUGHTERS', highlight: true },
          { text: 'DEPLETED', highlight: false },
          { text: 'LIVESTOCK', highlight: true },
          { text: '➔', highlight: false },
          { text: 'AHIMSA', highlight: true },
          { text: 'EMERGED', highlight: false }
        ],
        visualType: 'cattle'
      },
      {
        id: 3,
        title: 'Kshatriya Intellectual Reaction',
        hook: 'Royal princes challenging priestly ritual supremacy!',
        tag: 'Social Friction',
        audioText: 'Both Siddhartha Gautama and Vardhamana Mahavira belonged to the Kshatriya warrior aristocracy. They spearheaded an intellectual revolt rejecting ritualism, hereditary caste purity, and the supreme authority of the Vedas.',
        subtitleWords: [
          { text: 'ROYAL', highlight: false },
          { text: 'KSHATRIYA', highlight: true },
          { text: 'LEADERS', highlight: true },
          { text: '•', highlight: false },
          { text: 'REJECTED', highlight: true },
          { text: 'VEDIC', highlight: false },
          { text: 'INFALLIBILITY', highlight: true },
          { text: '&', highlight: false },
          { text: 'HEREDITARY', highlight: false },
          { text: 'PRIESTLY', highlight: false },
          { text: 'MONOPOLY', highlight: true }
        ],
        visualType: 'dharma_wheel'
      },
      {
        id: 4,
        title: 'UPSC Prelims Master Trap',
        hook: 'A trap that confuses thousands of civil services candidates!',
        tag: 'UPSC Must-Know',
        audioText: 'Beware of the classic UPSC trap! Heterodox movements were not peasant-led working class uprisings. They were elite-driven philosophical reforms led by Kshatriya princes and generously financed by wealthy urban merchant guilds.',
        subtitleWords: [
          { text: 'NOT', highlight: true },
          { text: 'A', highlight: false },
          { text: 'PEASANT', highlight: true },
          { text: 'REVOLT!', highlight: true },
          { text: '•', highlight: false },
          { text: 'ELITE', highlight: true },
          { text: 'KSHATRIYA-LED', highlight: true },
          { text: '&', highlight: false },
          { text: 'FINANCED', highlight: false },
          { text: 'BY', highlight: false },
          { text: 'URBAN', highlight: false },
          { text: 'GUILDS', highlight: true }
        ],
        visualType: 'dynamic_trap'
      },
      {
        id: 5,
        title: 'High-Yield Formula Takeaway',
        hook: 'Key concepts to lock into your prelims memory sheet.',
        tag: 'Revision Capsule',
        audioText: 'Remember: Iron metallurgy produced urban trade surplus, Vaishya capital backed Shramanic faiths, and Ahimsa protected agrarian livestock across the mid-Gangetic basin.',
        subtitleWords: [
          { text: 'MID-GANGETIC', highlight: true },
          { text: 'AXIS:', highlight: false },
          { text: 'IRON', highlight: true },
          { text: '+', highlight: false },
          { text: 'COMMERCE', highlight: true },
          { text: '+', highlight: false },
          { text: 'AHIMSA', highlight: true },
          { text: '=', highlight: false },
          { text: 'SECOND', highlight: true },
          { text: 'URBANIZATION', highlight: true }
        ],
        visualType: 'dynamic_revision'
      }
    ]
  },

  his_2_p1_s0_b0: {
    title: 'Buddhism Core Doctrines & Pratityasamutpada',
    examTakeaways: [
      'Four Noble Truths: Dukkha, Samudaya, Nirodha, Magga (Eightfold Path).',
      'Pratityasamutpada (Dependent Origination): 12-link causal chain explaining samsara without a permanent self.',
      'UPSC Trap: Buddhism rejects a permanent soul (Anatta), yet upholds karma and rebirth via the stream of consciousness.'
    ],
    scenes: [
      {
        id: 1,
        title: 'The Four Noble Truths',
        hook: 'The fundamental psychological diagnosis of human sorrow.',
        tag: 'Chatvari Arya Satyani',
        audioText: 'The Buddha taught the Four Noble Truths: All mundane life involves sorrow or Dukkha. Sorrow originates from craving or Trishna. Sorrow ceases when craving ends. And the Eightfold Path is the practical middle way to liberation.',
        subtitleWords: [
          { text: '4', highlight: true },
          { text: 'NOBLE', highlight: true },
          { text: 'TRUTHS:', highlight: true },
          { text: 'DUKKHA', highlight: true },
          { text: '(SORROW)', highlight: false },
          { text: '➔', highlight: false },
          { text: 'SAMUDAYA', highlight: true },
          { text: '(ORIGIN)', highlight: false },
          { text: '➔', highlight: false },
          { text: 'NIRODHA', highlight: true },
          { text: '➔', highlight: false },
          { text: 'MAGGA', highlight: true }
        ],
        visualType: 'four_truths'
      },
      {
        id: 2,
        title: 'Pratityasamutpada: Dependent Origination',
        hook: 'If this exists, that arises. When this ceases, that ceases.',
        tag: 'The Causal Wheel',
        audioText: 'Pratityasamutpada is the causal law of Buddhism. Nothing arises independently; every phenomenon depends on prior causes. It is visualized as a twelve-linked causal chain starting with Avidya or ignorance and ending in death.',
        subtitleWords: [
          { text: 'PRATITYASAMUTPADA:', highlight: true },
          { text: 'DEPENDENT', highlight: true },
          { text: 'ORIGINATION', highlight: true },
          { text: '•', highlight: false },
          { text: '12-LINKED', highlight: true },
          { text: 'CAUSAL', highlight: false },
          { text: 'WHEEL', highlight: true },
          { text: 'OF', highlight: false },
          { text: 'EXISTENCE', highlight: false }
        ],
        visualType: 'dharma_wheel'
      },
      {
        id: 3,
        title: 'Anatta & Anicca: The Soul Doctrine',
        hook: 'Can there be rebirth without an eternal soul?',
        tag: 'Core Ontology',
        audioText: 'Buddhism asserts Anicca, that all things are impermanent, and Anatta, that there is no eternal unchanging soul or Atman. The human identity is simply a flux of five transient aggregates or Skandhas.',
        subtitleWords: [
          { text: 'ANATTA:', highlight: true },
          { text: 'NO', highlight: true },
          { text: 'PERMANENT', highlight: false },
          { text: 'SOUL', highlight: true },
          { text: '•', highlight: false },
          { text: 'ANICCA:', highlight: true },
          { text: 'UNIVERSAL', highlight: false },
          { text: 'IMPERMANENCE', highlight: true },
          { text: '•', highlight: false },
          { text: '5', highlight: true },
          { text: 'SKANDHAS', highlight: true }
        ],
        visualType: 'dharma_wheel'
      },
      {
        id: 4,
        title: 'UPSC Prelims Master Trap',
        hook: 'The paradox that tests every candidate\'s analytical depth!',
        tag: 'UPSC Trap Alert',
        audioText: 'Pay close attention! Candidates often assume that because Buddhism denies a permanent soul, it also denies rebirth. That is false! Buddhism strongly upholds rebirth, comparing it to a flame passed from one candle to another.',
        subtitleWords: [
          { text: 'NO', highlight: true },
          { text: 'ATMAN,', highlight: true },
          { text: 'YET', highlight: false },
          { text: 'REBIRTH', highlight: true },
          { text: 'CONTINUES!', highlight: true },
          { text: '•', highlight: false },
          { text: 'FLAME', highlight: false },
          { text: 'PASSING', highlight: false },
          { text: 'FROM', highlight: false },
          { text: 'CANDLE', highlight: true },
          { text: 'TO', highlight: false },
          { text: 'CANDLE', highlight: true }
        ],
        visualType: 'dynamic_trap'
      },
      {
        id: 5,
        title: 'Ashtangika Marga: The Middle Path',
        hook: 'Avoiding both luxury and extreme self-mortification.',
        tag: 'Majjhima Patipada',
        audioText: 'The Eightfold Path avoids both extreme sensual indulgence and painful ascetic torture. Categorized into Wisdom, Ethical Conduct, and Mental Discipline, it delivers Nirvana: the complete extinction of craving.',
        subtitleWords: [
          { text: 'THE', highlight: false },
          { text: 'MIDDLE', highlight: true },
          { text: 'PATH:', highlight: true },
          { text: 'PRAJNA', highlight: true },
          { text: '(WISDOM)', highlight: false },
          { text: '+', highlight: false },
          { text: 'SHILA', highlight: true },
          { text: '(ETHICS)', highlight: false },
          { text: '+', highlight: false },
          { text: 'SAMADHI', highlight: true },
          { text: '➔', highlight: false },
          { text: 'NIRVANA', highlight: true }
        ],
        visualType: 'four_truths'
      }
    ]
  },

  his_2_p1_s0_b2: {
    title: 'The 4 Buddhist Councils & Historical Schisms',
    examTakeaways: [
      '1st Council: Rajgriha under King Ajatashatru (Vinaya & Sutta Pitakas compiled).',
      '2nd Council: Vaishali under King Kalasoka (First schism: Sthaviravadins vs Mahasanghikas).',
      '3rd Council: Pataliputra under King Ashoka (Abhidhamma Pitaka added; Kathavatthu compiled).',
      '4th Council: Kundalvana Kashmir under King Kanishka (Division into Hinayana and Mahayana).'
    ],
    scenes: [
      {
        id: 1,
        title: '1st Council: Rajgriha (483 BCE)',
        hook: 'Preserving the teachings right after the Buddha\'s Mahaparinirvana!',
        tag: 'Canon Foundation',
        audioText: 'Immediately after the Buddha passed away, the First Council met at the Sattapanni Cave in Rajgriha under the patronage of King Ajatashatru. Presided over by Mahakassapa, Upali recited the monastic Vinaya Pitaka while Ananda recited the philosophical Sutta Pitaka.',
        subtitleWords: [
          { text: '1ST', highlight: true },
          { text: 'COUNCIL:', highlight: true },
          { text: 'RAJGRIHA', highlight: true },
          { text: '•', highlight: false },
          { text: 'KING', highlight: false },
          { text: 'AJATASHATRU', highlight: true },
          { text: '•', highlight: false },
          { text: 'VINAYA', highlight: true },
          { text: '&', highlight: false },
          { text: 'SUTTA', highlight: true },
          { text: 'PITAKAS', highlight: true }
        ],
        visualType: 'councils'
      },
      {
        id: 2,
        title: '2nd Council: Vaishali & First Schism',
        hook: 'When monks argued over ten relaxed rules of discipline!',
        tag: 'First Great Division',
        audioText: 'One century later, King Kalasoka sponsored the Second Council at Vaishali. Disputes over ten relaxed monastic practices caused the first great schism, dividing the Sangha into conservative Sthaviravadins and liberal Mahasanghikas.',
        subtitleWords: [
          { text: '2ND', highlight: true },
          { text: 'COUNCIL:', highlight: true },
          { text: 'VAISHALI', highlight: true },
          { text: '•', highlight: false },
          { text: 'KALASOKA', highlight: true },
          { text: '•', highlight: false },
          { text: 'STHAVIRAVADINS', highlight: true },
          { text: 'VS', highlight: false },
          { text: 'MAHASANGHIKAS', highlight: true }
        ],
        visualType: 'councils'
      },
      {
        id: 3,
        title: '3rd Council: Pataliputra (250 BCE)',
        hook: 'Ashoka purging corrupt monks and sealing the Tripitaka.',
        tag: 'Abhidhamma Pitaka',
        audioText: 'Emperor Ashoka convened the Third Council at Pataliputra, presided over by Moggaliputta Tissa. Corrupt heretics were expelled, the Abhidhamma Pitaka was added to complete the Tripitaka, and Buddhist missionary envoys were dispatched across Asia.',
        subtitleWords: [
          { text: '3RD', highlight: true },
          { text: 'COUNCIL:', highlight: true },
          { text: 'PATALIPUTRA', highlight: true },
          { text: '•', highlight: false },
          { text: 'ASHOKA', highlight: true },
          { text: '•', highlight: false },
          { text: 'ABHIDHAMMA', highlight: true },
          { text: 'PITAKA', highlight: true },
          { text: 'ADDED', highlight: false }
        ],
        visualType: 'councils'
      },
      {
        id: 4,
        title: '4th Council: Kashmir & Hinayana vs Mahayana',
        hook: 'Sanskrit texts and the deification of the Buddha!',
        tag: 'Hinayana vs Mahayana',
        audioText: 'The Fourth Council met at Kundalvana in Kashmir under Kushan King Kanishka, with Vasumitra as president and Ashvaghosha as vice-president. Sanskrit was adopted, and Buddhism irrevocably split into Hinayana and Mahayana.',
        subtitleWords: [
          { text: '4TH', highlight: true },
          { text: 'COUNCIL:', highlight: true },
          { text: 'KASHMIR', highlight: true },
          { text: '•', highlight: false },
          { text: 'KANISHKA', highlight: true },
          { text: '•', highlight: false },
          { text: 'HINAYANA', highlight: true },
          { text: 'VS', highlight: false },
          { text: 'MAHAYANA', highlight: true }
        ],
        visualType: 'councils'
      },
      {
        id: 5,
        title: 'UPSC Prelims Master Matrix',
        hook: 'The king and venue formula you must memorize.',
        tag: 'UPSC Cheat Code',
        audioText: 'Memorize the formula! Kings: Ajatashatru, Kalasoka, Ashoka, Kanishka. Venues: Rajgriha, Vaishali, Pataliputra, Kashmir. Council 3 completed the Tripitaka, while Council 4 gave birth to Mahayana Buddhism.',
        subtitleWords: [
          { text: 'KINGS:', highlight: true },
          { text: 'AJATASHATRU', highlight: false },
          { text: '➔', highlight: false },
          { text: 'KALASOKA', highlight: false },
          { text: '➔', highlight: false },
          { text: 'ASHOKA', highlight: true },
          { text: '➔', highlight: false },
          { text: 'KANISHKA', highlight: true },
          { text: '•', highlight: false },
          { text: 'VENUES:', highlight: true },
          { text: 'R-V-P-K', highlight: true }
        ],
        visualType: 'dynamic_trap'
      }
    ]
  },

  his_3_p0_s0_b0: {
    title: '16 Mahajanapadas & Ganasanghas vs Monarchies',
    examTakeaways: [
      'The 6th century BCE witnessed the Second Urbanization with 16 Mahajanapadas.',
      'Polities split into Hereditary Monarchies (Magadha, Kosala) and Oligarchic Ganasanghas (Vajji, Malla).',
      'UPSC Trap: Ganasanghas were oligarchies, not egalitarian democracies; agricultural laborers (Dasa-Karmakaras) had no voting rights.'
    ],
    scenes: [
      {
        id: 1,
        title: 'The 16 Great Territorial Realms',
        hook: 'Tribal janas transforming into fortified territorial states!',
        tag: 'Second Urbanization',
        audioText: 'Around the 6th century BCE, the mid-Gangetic plains witnessed the Second Urbanization. Kinship-based tribal territories evolved into sixteen large territorial states known as the Mahajanapadas, characterized by walled cities and punch-marked silver coins.',
        subtitleWords: [
          { text: 'SECOND', highlight: true },
          { text: 'URBANIZATION:', highlight: true },
          { text: '16', highlight: true },
          { text: 'MAHAJANAPADAS', highlight: true },
          { text: '•', highlight: false },
          { text: 'FORTIFIED', highlight: false },
          { text: 'CAPITALS', highlight: true },
          { text: '&', highlight: false },
          { text: 'COINAGE', highlight: true }
        ],
        visualType: 'mahajanapadas_map'
      },
      {
        id: 2,
        title: 'Ganasanghas: Republican Oligarchies',
        hook: 'States governed by clan councils in assembly halls!',
        tag: 'Republican Santhagara',
        audioText: 'In polities like the Vajji confederacy, authority was shared among clan chiefs rather than a hereditary monarch. They met inside assembly halls called Santhagaras to debate public policy and elect their military commanders.',
        subtitleWords: [
          { text: 'GANASANGHAS:', highlight: true },
          { text: 'CLAN', highlight: false },
          { text: 'COUNCILS', highlight: true },
          { text: 'IN', highlight: false },
          { text: 'THE', highlight: false },
          { text: 'SANTHAGARA', highlight: true },
          { text: '•', highlight: false },
          { text: 'ELECTED', highlight: true },
          { text: 'CHIEFS', highlight: false }
        ],
        visualType: 'republics'
      },
      {
        id: 3,
        title: 'Hereditary Monarchies & Standing Armies',
        hook: 'The rise of absolute kings supported by agricultural taxes.',
        tag: 'Centralized Power',
        audioText: 'In contrast, monarchies like Magadha and Kosala concentrated power in a hereditary king supported by permanent standing armies and regular land taxation known as Bhaga and Bali, closely aligned with orthodox Vedic rituals.',
        subtitleWords: [
          { text: 'MONARCHIES:', highlight: true },
          { text: 'MAGADHA', highlight: true },
          { text: '&', highlight: false },
          { text: 'KOSALA', highlight: true },
          { text: '•', highlight: false },
          { text: 'STANDING', highlight: true },
          { text: 'ARMIES', highlight: true },
          { text: '&', highlight: false },
          { text: 'REGULAR', highlight: false },
          { text: 'BHAGA', highlight: true },
          { text: 'TAXES', highlight: true }
        ],
        visualType: 'mahajanapadas_map'
      },
      {
        id: 4,
        title: 'UPSC Prelims Master Trap',
        hook: 'Were early Indian republics truly democratic?',
        tag: 'UPSC Trap Alert',
        audioText: 'Never call Ganasanghas modern democracies in the exam hall! Power and voting rights were restricted exclusively to Kshatriya clan families. Agricultural slaves and artisans had zero voice in the Santhagara assembly.',
        subtitleWords: [
          { text: 'NOT', highlight: true },
          { text: 'MODERN', highlight: false },
          { text: 'DEMOCRACIES!', highlight: true },
          { text: '•', highlight: false },
          { text: 'RESTRICTED', highlight: true },
          { text: 'TO', highlight: false },
          { text: 'KSHATRIYA', highlight: true },
          { text: 'ELITES', highlight: true },
          { text: '•', highlight: false },
          { text: 'NO', highlight: true },
          { text: 'SLAVE', highlight: false },
          { text: 'RIGHTS', highlight: true }
        ],
        visualType: 'dynamic_trap'
      },
      {
        id: 5,
        title: 'Why Magadha Won the Imperial Race',
        hook: 'The four geographic pillars of Magadhan supremacy.',
        tag: 'Strategic Dominance',
        audioText: 'Magadha triumphed over all rival states due to four factors: rich iron deposits near Rajgir, dense forests supplying war elephants, riverine highway control across the Ganges, and highly fertile alluvial soil guaranteeing grain surplus.',
        subtitleWords: [
          { text: 'MAGADHA', highlight: true },
          { text: 'SUPREMACY:', highlight: true },
          { text: 'IRON', highlight: true },
          { text: 'ORES', highlight: false },
          { text: '+', highlight: false },
          { text: 'WAR', highlight: false },
          { text: 'ELEPHANTS', highlight: true },
          { text: '+', highlight: false },
          { text: 'GANGETIC', highlight: true },
          { text: 'WATERWAYS', highlight: false }
        ],
        visualType: 'mahajanapadas_map'
      }
    ]
  },

  his_12_p0_s0_b0: {
    title: 'Gandhian Trilogy: Champaran, Ahmedabad & Kheda',
    examTakeaways: [
      'Champaran 1917: 1st Civil Disobedience (Opposing Tinkathia indigo planting system).',
      'Ahmedabad 1918: 1st Hunger Strike (35% plague bonus arbitration for textile mill workers).',
      'Kheda 1918: 1st Non-Cooperation (Revenue remission demand after total crop failure).'
    ],
    scenes: [
      {
        id: 1,
        title: 'Champaran 1917: 1st Civil Disobedience',
        hook: 'Defying British eviction orders in rural Bihar!',
        tag: 'Champaran Satyagraha',
        audioText: 'Invited by Rajkumar Shukla, Gandhi travelled to Champaran in Bihar to investigate the oppressive Tinkathia system, where peasants were forced to cultivate indigo on three-twentieths of their land. Defying colonial orders to leave, this became India\'s first Civil Disobedience.',
        subtitleWords: [
          { text: 'CHAMPARAN', highlight: true },
          { text: '(1917):', highlight: true },
          { text: 'FIRST', highlight: true },
          { text: 'CIVIL', highlight: true },
          { text: 'DISOBEDIENCE', highlight: true },
          { text: '•', highlight: false },
          { text: 'TINKATHIA', highlight: true },
          { text: 'INDIGO', highlight: true },
          { text: 'SYSTEM', highlight: false }
        ],
        visualType: 'satyagraha_trilogy'
      },
      {
        id: 2,
        title: 'Ahmedabad 1918: 1st Hunger Strike',
        hook: 'Gandhi fasting alongside mill workers for wage justice.',
        tag: 'Ahmedabad Strike',
        audioText: 'In Ahmedabad, cotton mill owners sought to withdraw wartime plague bonuses. Supported by Anasuya Sarabhai, Gandhi undertook his first public hunger strike to support worker demands, successfully securing a thirty-five percent wage increase.',
        subtitleWords: [
          { text: 'AHMEDABAD', highlight: true },
          { text: '(1918):', highlight: true },
          { text: 'FIRST', highlight: true },
          { text: 'HUNGER', highlight: true },
          { text: 'STRIKE', highlight: true },
          { text: '•', highlight: false },
          { text: '35%', highlight: true },
          { text: 'WAGE', highlight: false },
          { text: 'HIKE', highlight: true },
          { text: 'WON', highlight: false }
        ],
        visualType: 'satyagraha_trilogy'
      },
      {
        id: 3,
        title: 'Kheda 1918: 1st Non-Cooperation',
        hook: 'Withholding land revenue when crops completely failed.',
        tag: 'Kheda Satyagraha',
        audioText: 'In Kheda, Gujarat, extreme drought caused crops to yield less than twenty-five percent, entitling peasants to statutory revenue remission. When British authorities refused, Gandhi and Sardar Vallabhbhai Patel led peasants to refuse tax payments, initiating the first Non-Cooperation.',
        subtitleWords: [
          { text: 'KHEDA', highlight: true },
          { text: '(1918):', highlight: true },
          { text: 'FIRST', highlight: true },
          { text: 'NON-COOPERATION', highlight: true },
          { text: '•', highlight: false },
          { text: 'TAX', highlight: true },
          { text: 'REFUSAL', highlight: true },
          { text: 'WITH', highlight: false },
          { text: 'SARDAR', highlight: true },
          { text: 'PATEL', highlight: true }
        ],
        visualType: 'satyagraha_trilogy'
      },
      {
        id: 4,
        title: 'UPSC Prelims Master Trap',
        hook: 'The classification trap that UPSC tests repeatedly!',
        tag: 'UPSC Trap Alert',
        audioText: 'Memorize the exact tactical match! Champaran was First Civil Disobedience. Ahmedabad was First Hunger Strike. Kheda was First Non-Cooperation. The Commission regularly swaps these three classifications to mislead candidates.',
        subtitleWords: [
          { text: 'CHAMPARAN', highlight: true },
          { text: '=', highlight: false },
          { text: 'CIVIL', highlight: true },
          { text: 'DISOBEDIENCE', highlight: true },
          { text: '•', highlight: false },
          { text: 'AHMEDABAD', highlight: true },
          { text: '=', highlight: false },
          { text: 'HUNGER', highlight: true },
          { text: 'STRIKE', highlight: true },
          { text: '•', highlight: false },
          { text: 'KHEDA', highlight: true },
          { text: '=', highlight: false },
          { text: 'NON-COOPERATION', highlight: true }
        ],
        visualType: 'dynamic_trap'
      },
      {
        id: 5,
        title: 'The Regional Laboratories Takeaway',
        hook: 'How Gandhi perfected his mass political methods.',
        tag: 'National Milestone',
        audioText: 'These three regional campaigns tested Satyagraha in rural fields and urban factories. They demonstrated that non-violent resistance could mobilize ordinary masses, preparing Gandhi for the pan-Indian Non-Cooperation Movement of 1920.',
        subtitleWords: [
          { text: 'LABORATORIES', highlight: true },
          { text: 'OF', highlight: false },
          { text: 'SATYAGRAHA:', highlight: true },
          { text: 'RURAL', highlight: false },
          { text: '+', highlight: false },
          { text: 'URBAN', highlight: false },
          { text: 'MASSES', highlight: true },
          { text: '➔', highlight: false },
          { text: 'PAN-INDIAN', highlight: true },
          { text: 'LEADERSHIP', highlight: true }
        ],
        visualType: 'satyagraha_trilogy'
      }
    ]
  }
};

// ==========================================
// UNIVERSAL DYNAMIC REEL GENERATOR ENGINE
// Covers 100% of all 140 History Subtopics
// ==========================================

const dynamicReelsCache = {};

function formatSubtitleWords(sentence) {
  if (!sentence) return [{ text: 'UPSC', highlight: true }, { text: 'HIGH-YIELD', highlight: true }];
  const words = sentence.replace(/[.,:;()\"\']/g, '').split(/\s+/).slice(0, 16);
  return words.map((w, idx) => ({
    text: w.toUpperCase(),
    highlight: idx % 3 === 0 || w.length > 6 || /^[A-Z]/.test(w)
  }));
}

export function generateDynamicReel(subtopicKey) {
  if (dynamicReelsCache[subtopicKey]) {
    return dynamicReelsCache[subtopicKey];
  }

  const record = detailsHistory.find(x => x.subtopicKey === subtopicKey);
  if (!record) {
    return HISTORY_REELS_DATA.his_1_p0_s0_b0;
  }

  const h2Match = record.paragraphs.match(/<h2[^>]*>(.*?)<\/h2>/i);
  const title = h2Match ? h2Match[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim() : (record.videoTitle || 'Historical Milestone');

  const stmtMatch = record.paragraphs.match(/<b>Statement:<\/b>(.*?)(?:<\/div>|<p>)/i);
  const statement = stmtMatch ? stmtMatch[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim() : 'Crucial structural developments shaped this period in Indian history.';

  const trapMatch = record.paragraphs.match(/<b>Exam Trap:<\/b>(.*?)(?:<\/div>|<p>)/i);
  const examTrap = trapMatch ? trapMatch[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim() : 'Watch out for chronological and regional classification traps tested by the Commission.';

  const revMatch = record.paragraphs.match(/<b>UPSC Revision:<\/b>(.*?)(?:<\/div>|<p>)/i);
  const revision = revMatch ? revMatch[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim() : statement;

  const pMatches = (record.paragraphs.match(/<p>(.*?)<\/p>/gi) || []).map(p => p.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim());
  const para1 = pMatches[0] || statement;
  const para2 = pMatches[1] || pMatches[0] || 'This structural framework transformed socio-economic relations across the subcontinent.';

  // Determine era & visual style
  let eraVisual = 'dynamic_era';
  if (subtopicKey.startsWith('his_1')) eraVisual = 'zoning';
  else if (subtopicKey.startsWith('his_2')) eraVisual = 'dharma_wheel';
  else if (subtopicKey.startsWith('his_3')) eraVisual = 'mahajanapadas_map';
  else if (subtopicKey.startsWith('his_4')) eraVisual = 'tinai_matrix';
  else if (subtopicKey.startsWith('his_5')) eraVisual = 'administration_pillars';
  else if (subtopicKey.startsWith('his_6')) eraVisual = 'mansab_ranks';
  else if (subtopicKey.startsWith('his_7')) eraVisual = 'rock_cut';
  else if (subtopicKey.startsWith('his_8')) eraVisual = 'colonial_trade';
  else if (subtopicKey.startsWith('his_9')) eraVisual = 'tribal_resistance';
  else if (subtopicKey.startsWith('his_10')) eraVisual = 'reform_movements';
  else if (subtopicKey.startsWith('his_11')) eraVisual = 'swadeshi';
  else if (subtopicKey.startsWith('his_12')) eraVisual = 'satyagraha_trilogy';
  else if (subtopicKey.startsWith('his_13')) eraVisual = 'revolutionary';
  else if (subtopicKey.startsWith('his_14')) eraVisual = 'princely_accession';

  const generated = {
    title: title,
    examTakeaways: [
      statement.slice(0, 140) + (statement.length > 140 ? '...' : ''),
      examTrap.slice(0, 140) + (examTrap.length > 140 ? '...' : ''),
      revision.slice(0, 140) + (revision.length > 140 ? '...' : '')
    ],
    scenes: [
      {
        id: 1,
        title: title.slice(0, 38),
        hook: 'Why is ' + title.slice(0, 30) + ' vital for UPSC Civil Services?',
        tag: 'Core Thesis',
        audioText: statement,
        subtitleWords: formatSubtitleWords(statement),
        visualType: 'dynamic_thesis'
      },
      {
        id: 2,
        title: 'Causation & Structural Dynamics',
        hook: 'The socio-economic transition and historical drivers behind this phase.',
        tag: 'Historical Dynamics',
        audioText: para1,
        subtitleWords: formatSubtitleWords(para1),
        visualType: 'dynamic_mechanics'
      },
      {
        id: 3,
        title: 'Key Institutions & Terminology',
        hook: 'Primary terminology, institutions, and administrative formations to remember.',
        tag: 'Institutional Framework',
        audioText: para2,
        subtitleWords: formatSubtitleWords(para2),
        visualType: 'dynamic_matrix'
      },
      {
        id: 4,
        title: 'UPSC Prelims Master Trap',
        hook: 'The classic misconception that costs candidates negative marks!',
        tag: 'UPSC Trap Alert',
        audioText: examTrap,
        subtitleWords: formatSubtitleWords(examTrap),
        visualType: 'dynamic_trap'
      },
      {
        id: 5,
        title: '10-Second Revision Formula',
        hook: 'High-yield memory capsule for rapid recall in the exam hall.',
        tag: 'UPSC Fast Recall',
        audioText: revision,
        subtitleWords: formatSubtitleWords(revision),
        visualType: 'dynamic_revision'
      }
    ]
  };

  dynamicReelsCache[subtopicKey] = generated;
  return generated;
}

export function getHistoryReel(subtopicKey) {
  if (HISTORY_REELS_DATA[subtopicKey]) {
    return HISTORY_REELS_DATA[subtopicKey];
  }
  return generateDynamicReel(subtopicKey);
}
