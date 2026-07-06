// QuickScan — Vragenboom Data
// Gebruik: importeer dit bestand en gebruik `quickscanData` als de databron voor je prototype.

const quickscanData = {
  outcomes: {
    start_aanvraag: {
      id: "start_aanvraag",
      title: "Start je aanvraag",
      body: "Je aanvraag lijkt te voldoen aan de basiscriteria van Maatschappij van Welstand. Lees eerst de voorwaarden voordat je met de aanvraag start.",
      ctas: [
        { label: "Start aanvraag", action: "start_aanvraag" },
        { label: "Bekijk voorwaarden", action: "bekijk_voorwaarden" },
      ],
    },
    noodhulp_contact: {
      id: "noodhulp_contact",
      title: "Aanvraag niet mogelijk via privépersoon",
      body: "Een aanvraag kan alleen worden ingediend door een officeel erkende of geregistreerde hulpverlenende organisatie.",
      ctas: [{ label: "Neem contact op", action: "contact" }],
    },
    mvw_al_reeds_toegekend: {
      id: "mvw_al_reeds_toegekend",
      title: "Waarschijnlijk niet passend",
      body: "MvW kent in principe geen bijdragen toe aan personen/gezinnen die in de afgelopen drie jaar al een toekenning hebben gekregen. Neem bij twijfel contact op via info@mvw.nl of telefonisch via 033 – 467 10 15.",
      ctas: [{ label: "Neem contact op", action: "contact" }],
    },
    project_passend: {
      id: "project_passend",
      title: "Je project lijkt passend",
      body: "Op basis van je antwoorden lijkt jouw project aan te sluiten bij de richtlijnen van Maatschappij van Welstand. Controleer de voorwaarden en start je aanvraag.",
      ctas: [
        { label: "Start aanvraag", action: "start_aanvraag" },
        { label: "Bekijk voorwaarden", action: "bekijk_voorwaarden" },
      ],
    },
    project_niet_passend: {
      id: "project_niet_passend",
      title: "Waarschijnlijk niet passend",
      body: "Op basis van je antwoorden lijkt jouw project niet te voldoen aan de basiscriteria van Maatschappij van Welstand.",
      ctas: [
        { label: "Bekijk voorwaarden", action: "bekijk_voorwaarden" },
        { label: "Neem contact op bij twijfel", action: "contact" },
      ],
    },
    project_kerk: {
      id: "project_kerk",
      title: "Kerk en geloof",
      body: "Je project valt onder kerk en geloof. Je kunt een aanvraag doen voor versterking en vernieuwing, migrantenkerken of interculturele kerken, pioniersplekken, restauratie of nieuw-/verbouw van kerkgebouwen en orgels. Onder voorwaarden is ook een hypothecaire lening mogelijk.",
      ctas: [{ label: "Start aanvraag", action: "start_aanvraag" }],
    },
    project_samenleving: {
      id: "project_samenleving",
      title: "Ondersteuning kwetsbare groepen",
      body: "Je project valt onder maatschappelijke zorg. Je kunt een aanvraag doen voor inloophuizen, presentie of maatschappelijke hulp, faciliteiten en inrichting, of recreatie met zorg.",
      ctas: [{ label: "Start aanvraag", action: "start_aanvraag" }],
    },
    project_onderwijs: {
      id: "project_onderwijs",
      title: "Levensbeschouwelijk onderwijs",
      body: "Je project richt zich op levensbeschouwelijke vorming, identiteit of religieuze alfabetisering. Je kunt een aanvraag doen voor projecten die jongeren buiten school bereiken of professionals ondersteunen in levensbeschouwelijk onderwijs.",
      ctas: [{ label: "Start aanvraag", action: "start_aanvraag" }],
    },
    bekijk_voorwaarden: {
      id: "bekijk_voorwaarden",
      title: "Bekijk eerst de voorwaarden",
      body: "Deze quickscan is een richtlijn en geen garantie op een donatie. Controleer altijd de voorwaarden voordat je een aanvraag start.",
      ctas: [{ label: "Bekijk voorwaarden", action: "bekijk_voorwaarden" }],
    },
    neem_contact_op: {
      id: "neem_contact_op",
      title: "Neem contact op",
      body: "Bij twijfel of onduidelijkheid is het verstandig om contact op te nemen zodat je niet onnodig een aanvraag start.",
      ctas: [{ label: "Neem contact op", action: "contact" }],
    },
  },

  questions: {
    start: {
      id: "start",
      step: 0,
      label: "Start",
      title: "Waarvoor wil je een aanvraag doen?",
      subtitle: "Start de Quick Scan voor:",
      options: [
        {
          label: "Projectondersteuning",
          next: "project_kenmerk",
        },
        {
          label: "Aanvraag voor noodhulp voor personen/gezinnen",
          next: "noodhulp_hulpverlener",
        },
      ],
    },

    noodhulp_hulpverlener: {
      id: "noodhulp_hulpverlener",
      step: 1,
      label: "Hulpverlener",
      title:
        "Ben jij een hulpverlener of maatschappelijk werker van een officiële hulpverlenende organisatie of een erkend bewindvoerder?",
      info: "Bijvoorbeeld maatschappelijk werk, wijkteam, zorginstelling, therapeut.",
      options: [
        {
          label: "Ja",
          next: "noodhulp_wettelijke_regelingen",
        },
        {
          label: "Nee",
          next: null,
          outcome: "noodhulp_contact",
          hint: "Aanvragen door een privépersoon worden niet in behandeling genomen.",
        },
      ],
    },

    noodhulp_wettelijke_regelingen: {
      id: "noodhulp_wettelijke_regelingen",
      step: 2,
      label: "Regelingen",
      title:
        "Maatschappij van Welstand ziet haar gift als aanvullend op wettelijke overheidsregelingen en lokale noodfondsen. Kan daar voor deze aanvraag een beroep op worden gedaan?",
      options: [
        {
          label: "Ja",
          next: "noodhulp_voorgaande_bijdrage",
          hint: "Lees eerst de voorwaarden voordat je met de aanvraag start.",
        },
        {
          label: "Nee",
          next: "noodhulp_voorgaande_bijdrage",
          hint: "Bij de aanvraag graag aangeven waarom dit niet mogelijk is. Ook eventuele afwijzingen graag meesturen.",
        },
      ],
    },

    noodhulp_voorgaande_bijdrage: {
      id: "noodhulp_voorgaande_bijdrage",
      step: 3,
      label: "Bijdrage",
      title:
        "Heeft de cliënt/het gezin in de afgelopen drie jaar al eens een financiële bijdrage gekregen vanuit Maatschappij van Welstand?",
      options: [
        {
          label: "Ja",
          next: null,
          outcome: "mvw_al_reeds_toegekend",
        },
        {
          label: "Nee",
          next: null,
          outcome: "start_aanvraag",
        },
      ],
    },

    project_kenmerk: {
      id: "project_kenmerk",
      step: 1,
      label: "Identiteit",
      title:
        "Heeft het project of de aanvragende organisatie, kerk of geloofsgemeenschap een protestants-christelijke identiteit?",
      options: [
        {
          label: "Ja",
          next: "project_locatie",
        },
        {
          label: "Nee",
          next: null,
          outcome: "project_niet_passend",
          hint: "Wij ondersteunen uitsluitend projecten met een kerkelijke verbondenheid of zichtbare christelijke levensbeschouwing.",
        },
      ],
    },

    project_locatie: {
      id: "project_locatie",
      step: 2,
      label: "Locatie",
      title: "Betreft het een aanvraag voor een project in Nederland?",
      options: [
        {
          label: "Ja",
          next: "project_eenmalig",
        },
        {
          label: "Nee",
          next: null,
          outcome: "project_niet_passend",
          hint: "Het werkgebied van Maatschappij van Welstand is in Nederland.",
        },
      ],
    },

    project_eenmalig: {
      id: "project_eenmalig",
      step: 3,
      label: "Type",
      title:
        "Is jouw project een eenmalig (cultureel) evenement, congres of publicatie, tijdschrift of boek?",
      options: [
        {
          label: "Ja",
          next: null,
          outcome: "project_niet_passend",
          hint: "Wij ondersteunen geen eenmalige evenementen of publicaties zonder directe relatie met MVW-doelstellingen.",
        },
        {
          label: "Nee",
          next: "project_eigen_vermogen",
        },
      ],
    },

    project_eigen_vermogen: {
      id: "project_eigen_vermogen",
      step: 4,
      label: "Vermogen",
      title:
        "Is het eigen vermogen van de aanvragende organisatie meer dan 1,5 keer de reguliere jaaromzet?",
      options: [
        {
          label: "Ja",
          next: null,
          outcome: "neem_contact_op",
          hint: "Neem contact op als je twijfelt over eigen vermogen; MvW vraagt soms jaarrekeninginzichten op bij betrokken partijen.",
        },
        {
          label: "Nee",
          next: "project_domein",
        },
        {
          label: "Ik weet het niet zeker",
          next: null,
          outcome: "neem_contact_op",
          hint: "Twijfel je of je te veel eigen vermogen hebt naar onze richtlijn? Neem contact met ons op via het contactformulier en stuur je jaarrekening alvast op.",
        },
      ],
    },

    project_domein: {
      id: "project_domein",
      step: 5,
      label: "Domein",
      title: "Is het project gericht op:",
      options: [
        {
          label: "Kerk en geloof",
          next: null,
          outcome: "project_kerk",
        },
        {
          label: "Samenleving",
          next: null,
          outcome: "project_samenleving",
        },
        {
          label: "Levensbeschouwelijk onderwijs",
          next: null,
          outcome: "project_onderwijs",
        },
      ],
    },
  },

  getCategoriecheck(category) {
    return null;
  },
};

export default quickscanData;
