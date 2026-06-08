// QuickScan — Vragenboom Data
// Gebruik: importeer dit bestand en gebruik `quickscanData` als de databron voor je prototype.

const quickscanData = {
  // ─── UITKOMSTEN ────────────────────────────────────────────────────────────
  outcomes: {
    waarschijnlijk_passend: {
      id: "waarschijnlijk_passend",
      title: "Je aanvraag lijkt mogelijk te passen",
      body: "Op basis van je antwoorden lijkt jouw initiatief aan te sluiten bij deze aanvraagroute. Controleer de voorwaarden voordat je start.",
      ctas: [
        { label: "Start aanvraag", action: "start_aanvraag" },
        { label: "Bekijk voorwaarden", action: "bekijk_voorwaarden" },
      ],
    },
    bekijk_voorwaarden: {
      id: "bekijk_voorwaarden",
      title: "Bekijk eerst de voorwaarden",
      body: "Je aanvraag lijkt mogelijk te passen, maar er zijn voorwaarden die belangrijk zijn voordat je een aanvraag start.",
      ctas: [{ label: "Bekijk voorwaarden", action: "bekijk_voorwaarden" }],
    },
    neem_contact_op: {
      id: "neem_contact_op",
      title: "Neem eerst contact op",
      body: "Je situatie valt mogelijk onder een uitzondering of twijfelroute. Neem eerst contact op, zodat je niet onnodig een aanvraag start.",
      ctas: [
        { label: "Neem contact op", action: "contact" },
        { label: "Bekijk aanvraagroutes", action: "bekijk_routes" },
      ],
    },
    niet_passend: {
      id: "niet_passend",
      title: "Waarschijnlijk niet passend",
      body: "Op basis van je antwoorden lijkt deze aanvraag waarschijnlijk niet binnen de voorwaarden van MVW te vallen.",
      ctas: [
        { label: "Bekijk voorwaarden", action: "bekijk_voorwaarden" },
        { label: "Neem contact op bij twijfel", action: "contact" },
      ],
    },
    partnerroute: {
      id: "partnerroute",
      title: "Mogelijk andere route",
      body: "Voor jouw aanvraag is mogelijk een partnerroute passender, bijvoorbeeld SOFAK of Fonds Franciscus.",
      ctas: [
        { label: "Bekijk partnerroute", action: "bekijk_partnerroute" },
        { label: "Neem contact op bij twijfel", action: "contact" },
      ],
    },
  },

  // ─── VRAGEN ────────────────────────────────────────────────────────────────
  questions: {
    // ── STAP 0: Startvraag ──────────────────────────────────────────────────
    start: {
      id: "start",
      step: 0,
      title: "Waarvoor wil je een financiële bijdrage aanvragen?",
      options: [
        {
          label: "Project namens organisatie of initiatief",
          next: "aanvrager",
        },
        {
          label: "Persoonlijke ondersteuning",
          next: "aanvrager",
        },
        {
          label: "Kerk of geloofsgemeenschap",
          next: "aanvrager",
        },
        {
          label: "Samenleving / diaconie",
          next: "aanvrager",
        },
        {
          label: "Onderwijs",
          next: "aanvrager",
        },
        {
          label: "Duurzaamheid",
          next: "aanvrager",
        },
        {
          label: "Ik weet het niet zeker",
          next: "aanvrager",
        },
      ],
    },

    // ── STAP 1: Aanvrager ───────────────────────────────────────────────────
    aanvrager: {
      id: "aanvrager",
      step: 1,
      title: "Vraag je aan namens een organisatie, initiatief of intermediair?",
      options: [
        {
          label: "Ja, namens een organisatie/initiatief",
          next: "thema",
        },
        {
          label: "Ja, als hulpverlener/intermediair",
          next: "thema",
          hint: "Route via persoonlijke ondersteuning",
        },
        {
          label: "Nee, voor mezelf",
          // Persoonlijke ondersteuning kan niet zelf worden aangevraagd
          next: null,
          outcome: "niet_passend",
          explanation:
            "Persoonlijke ondersteuning kan helaas niet door de betrokkene zelf worden aangevraagd. Een erkend hulpverlener of intermediair dient de aanvraag in.",
        },
        {
          label: "Ik weet het niet",
          next: null,
          outcome: "neem_contact_op",
        },
      ],
    },

    // ── STAP 2: Thema ───────────────────────────────────────────────────────
    thema: {
      id: "thema",
      step: 2,
      title: "Waar past je aanvraag het beste bij?",
      options: [
        {
          label: "Kerk, geloofsgemeenschap of kerkgebouw",
          category: "kerk",
          next: "projectfase",
        },
        {
          label: "Maatschappelijke hulp, diaconie of kwetsbare groepen",
          category: "samenleving",
          next: "projectfase",
        },
        {
          label: "Onderwijs, identiteit of vorming",
          category: "onderwijs",
          next: "projectfase",
        },
        {
          label: "Duurzaamheid, landbouw, bodem of bewustwording",
          category: "duurzaamheid",
          next: "projectfase",
        },
        {
          label: "Persoonlijke ondersteuning voor iemand anders",
          category: "persoonlijk",
          next: "projectfase",
        },
        {
          label: "Geen van deze / twijfel",
          next: null,
          outcome: "neem_contact_op",
        },
      ],
    },

    // ── STAP 3: Projectfase ─────────────────────────────────────────────────
    projectfase: {
      id: "projectfase",
      step: 3,
      title: "Gaat het om een concreet project?",
      options: [
        {
          label: "Ja, met doel, planning en begroting",
          next: "categoriecheck", // verder naar categoriespecifieke vraag
        },
        {
          label: "Nog niet, het idee is in voorbereiding",
          next: null,
          outcome: "bekijk_voorwaarden",
        },
        {
          label: "Nee, het gaat om structurele kosten of exploitatie",
          next: null,
          outcome: "niet_passend",
        },
        {
          label: "Ik weet het niet",
          next: null,
          outcome: "neem_contact_op",
        },
      ],
    },

    // ── STAP 4: Categoriecheck ──────────────────────────────────────────────
    // De vraag die getoond wordt hangt af van de gekozen categorie in stap 2.
    // categoriecheck_kerk, _samenleving, etc. zijn varianten van dezelfde stap.

    categoriecheck_kerk: {
      id: "categoriecheck_kerk",
      step: 4,
      category: "kerk",
      title: "Waar gaat je kerkelijke aanvraag over?",
      options: [
        {
          label: "Versterking of vernieuwing",
          next: "twijfel_uitzondering",
        },
        {
          label: "Migrantenkerk / interculturele kerk",
          next: "twijfel_uitzondering",
        },
        {
          label: "Pioniersplek",
          next: "twijfel_uitzondering",
        },
        {
          label: "Kerkgebouw of orgel",
          next: "twijfel_uitzondering",
        },
        {
          label: "Duurzaamheid",
          next: "twijfel_uitzondering",
        },
        {
          label: "Ik twijfel",
          next: null,
          outcome: "neem_contact_op",
        },
      ],
    },

    categoriecheck_samenleving: {
      id: "categoriecheck_samenleving",
      step: 4,
      category: "samenleving",
      title: "Waar gaat je maatschappelijke aanvraag over?",
      options: [
        {
          label: "Inloophuis",
          next: "twijfel_uitzondering",
        },
        {
          label: "Presentie of maatschappelijke hulp",
          next: "twijfel_uitzondering",
        },
        {
          label: "Faciliteiten of inrichting",
          next: "twijfel_uitzondering",
        },
        {
          label: "Recreatie met zorg",
          next: "twijfel_uitzondering",
        },
        {
          label: "Ik twijfel",
          next: null,
          outcome: "neem_contact_op",
        },
      ],
    },

    categoriecheck_onderwijs: {
      id: "categoriecheck_onderwijs",
      step: 4,
      category: "onderwijs",
      title:
        "Sluit je aanvraag aan bij levensbeschouwelijke vorming, identiteit of religieuze alfabetisering?",
      options: [
        {
          label: "Ja",
          next: "twijfel_uitzondering",
        },
        {
          label: "Nee",
          next: null,
          outcome: "niet_passend",
        },
        {
          label: "Ik twijfel",
          next: null,
          outcome: "neem_contact_op",
        },
      ],
    },

    categoriecheck_duurzaamheid: {
      id: "categoriecheck_duurzaamheid",
      step: 4,
      category: "duurzaamheid",
      title:
        "Vraag je aan namens een kerk, christelijke organisatie of pachter van MVW?",
      options: [
        {
          label: "Ja",
          next: "twijfel_uitzondering",
        },
        {
          label: "Nee",
          next: null,
          outcome: "niet_passend",
        },
        {
          label: "Ik twijfel",
          next: null,
          outcome: "neem_contact_op",
        },
      ],
    },

    categoriecheck_persoonlijk: {
      id: "categoriecheck_persoonlijk",
      step: 4,
      category: "persoonlijk",
      title:
        "Ben je hulpverlener, maatschappelijk werker of erkende intermediair?",
      options: [
        {
          label: "Ja",
          next: "twijfel_uitzondering",
        },
        {
          label: "Nee",
          next: null,
          outcome: "niet_passend",
        },
        {
          label: "Ik twijfel",
          next: null,
          outcome: "neem_contact_op",
        },
      ],
    },

    // ── STAP 5: Twijfel of uitzondering ────────────────────────────────────
    twijfel_uitzondering: {
      id: "twijfel_uitzondering",
      step: 5,
      title: "Weet je zeker dat deze route past?",
      options: [
        {
          label: "Ja, ik wil verder",
          next: null,
          outcome: "waarschijnlijk_passend",
        },
        {
          label: "Ik wil eerst de voorwaarden bekijken",
          next: null,
          outcome: "bekijk_voorwaarden",
        },
        {
          label: "Ik twijfel nog",
          next: null,
          outcome: "neem_contact_op",
        },
        {
          label: "Ik denk dat er een partnerroute is",
          next: null,
          outcome: "partnerroute",
        },
      ],
    },
  },

  // ─── ROUTING HULPFUNCTIE ───────────────────────────────────────────────────
  // Roept de juiste categoriecheck op op basis van de gekozen categorie in stap 2.
  // Gebruik deze in je prototype om de volgende vraag te bepalen na stap 3.
  getCategoriecheck(category) {
    const map = {
      kerk: "categoriecheck_kerk",
      samenleving: "categoriecheck_samenleving",
      onderwijs: "categoriecheck_onderwijs",
      duurzaamheid: "categoriecheck_duurzaamheid",
      persoonlijk: "categoriecheck_persoonlijk",
    };
    return map[category] || null;
  },
};

// ─── EXPORT (voor gebruik als module) ─────────────────────────────────────────
// In een gewone <script>-tag is `quickscanData` direct beschikbaar als globale variabele.
// Bij gebruik als ES module: export default quickscanData;
export default quickscanData;
