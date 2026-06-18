import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, Play, Filter, Sparkles, BookOpen } from 'lucide-react';

interface VideoItem {
  title: string;
  url: string;
  category: string;
}

interface GlossarySectionProps {
  onStartCheck: () => void;
}

const videos: VideoItem[] = [
  {
    title: "So läuft's ab! Vom Erstgespräch bis zum Eigenheim",
    url: "https://youtu.be/ELibSv3mUSo",
    category: "Einstieg ins Eigenheim"
  },
  {
    title: "Die 3 wichtigsten Phasen vor dem Hauskauf – Das muss JEDER wissen!",
    url: "https://youtu.be/OIEZtJJtW0Y",
    category: "Einstieg ins Eigenheim"
  },
  {
    title: "So schaffst du den Einstieg in den Eigenheimkauf – Experten-Tipps",
    url: "https://youtu.be/qomTROmgnoM",
    category: "Einstieg ins Eigenheim"
  },
  {
    title: "Schritt für Schritt ins Eigenheim – Dein Weg zum Traumhaus",
    url: "https://youtu.be/CWp4k1M9btM",
    category: "Einstieg ins Eigenheim"
  },
  {
    title: "Mieten oder kaufen? Diese Berechnung ändert ALLES!",
    url: "https://youtu.be/En-6FsbFW4w",
    category: "Einstieg ins Eigenheim"
  },
  {
    title: "Mieten oder kaufen? | Simon Karrica (Kanalstart)",
    url: "https://youtu.be/lBzLqY_as5Q",
    category: "Einstieg ins Eigenheim"
  },
  {
    title: "Die 2 Typen von Hauskäufern – Welcher bist du?",
    url: "https://youtu.be/QTgUSTPdhps",
    category: "Einstieg ins Eigenheim"
  },
  {
    title: "Eigenheim sichern: 6 Tipps, um dein Traumhaus schnell zu finden!",
    url: "https://youtu.be/DFJjVZ2nVw0",
    category: "Einstieg ins Eigenheim"
  },
  {
    title: "KI empfiehlt Eigenheim? So rechnet ein Käufer in der Schweiz 2026 richtig",
    url: "https://youtu.be/tDrekDeFvYI",
    category: "Einstieg ins Eigenheim"
  },

  {
    title: "Eigenheim trotz kleinem Einkommen? Bonität & Tragbarkeit erklärt",
    url: "https://youtu.be/K5jYujYizUY",
    category: "Finanzierung & Bank"
  },
  {
    title: "Gute Bonität sieht man an der Steuererklärung (Teil 1)",
    url: "https://youtu.be/chYtKMKhcRs",
    category: "Finanzierung & Bank"
  },
  {
    title: "Gute Bonität sieht man an der Steuererklärung (Teil 2)",
    url: "https://youtu.be/VIZO5WKiug0",
    category: "Finanzierung & Bank"
  },
  {
    title: "Eigenheim kaufen? Diese Dokumente musst du vorher kennen!",
    url: "https://youtu.be/tsaUaKc0X8I",
    category: "Finanzierung & Bank"
  },
  {
    title: "Warum du NIE einfach Unterlagen an die Bank senden solltest!",
    url: "https://youtu.be/5Z7DKu-uq-8",
    category: "Finanzierung & Bank"
  },
  {
    title: "Schneller zur Immobilienfinanzierung – Die wichtigsten Dokumente vorbereiten",
    url: "https://youtu.be/73hOxLoRjk8",
    category: "Finanzierung & Bank"
  },
  {
    title: "Warum eine Finanzierungsbestätigung NICHT reicht, um ein Haus zu kaufen!",
    url: "https://youtu.be/e2jn_wSI2T8",
    category: "Finanzierung & Bank"
  },
  {
    title: "Bank sagte NEIN – Wie wir trotz Absage zum Traumhaus kamen",
    url: "https://youtu.be/weZQ5kZddBk",
    category: "Finanzierung & Bank"
  },
  {
    title: "Dürfen Schweizer Banken 80% finanzieren? | Simon Karrica",
    url: "https://youtu.be/61w8NXcGdxU",
    category: "Finanzierung & Bank"
  },
  {
    title: "Mehrere Banken anfragen = bessere Konditionen! 5 Gründe",
    url: "https://youtu.be/Z006WWN_q2o",
    category: "Finanzierung & Bank"
  },
  {
    title: "200'000 Franken = automatisch Eigenheimbesitzer? (Eigengeld-Mythos)",
    url: "https://youtu.be/E67E8A0wXpw",
    category: "Finanzierung & Bank"
  },
  {
    title: "Hauskauf ohne Eigenkapital – Ist das möglich in der Schweiz?",
    url: "https://youtu.be/rrAj8Q0FmyA",
    category: "Finanzierung & Bank"
  },
  {
    title: "Häufige Fehler bei der Eigenmittelzusammensetzung – teure Fallen vermeiden!",
    url: "https://youtu.be/Tw2zeDIgFUQ",
    category: "Finanzierung & Bank"
  },
  {
    title: "Eigenheim kaufen trotz Kredit? Warum Abzahlen oft der falsche Schritt ist",
    url: "https://youtu.be/zX_heViBSQE",
    category: "Finanzierung & Bank"
  },
  {
    title: "Welche Auswirkung hat ein Kredit oder Leasing auf den Eigenheimkauf?",
    url: "https://youtu.be/q0nR_MTnesk",
    category: "Finanzierung & Bank"
  },
  {
    title: "Selbständig und Eigenheim? Kauf trotz unregelmässiger Einkünfte",
    url: "https://youtu.be/KIxGKSCRdsA",
    category: "Finanzierung & Bank"
  },
  {
    title: "Luxusimmobilien oder Liebhaberobjekte – Was bei der Finanzierung beachten?",
    url: "https://youtu.be/_P9z36z4Gwk",
    category: "Finanzierung & Bank"
  },
  {
    title: "Ohne diese 3 Parteien kein Eigenheim!",
    url: "https://youtu.be/7bkPLQRQQvg",
    category: "Finanzierung & Bank"
  },
  {
    title: "Mietkauf erklärt: Die letzte Chance auf ein Eigenheim?",
    url: "https://youtu.be/BfmuxgirfWY",
    category: "Finanzierung & Bank"
  },
  {
    title: "Eigenheim im Mietkauf – Wie funktioniert das?",
    url: "https://youtu.be/aCHZyut4ZM0",
    category: "Finanzierung & Bank"
  },

  {
    title: "Festhypothek oder SARON? Was 2026 für Käufer wirklich besser ist",
    url: "https://youtu.be/edS83OsKDx8",
    category: "Hypothek, Zinsen & Steuern"
  },
  {
    title: "So nutzen Banken deine Unwissenheit aus – Hypothek richtig verstehen!",
    url: "https://youtu.be/J30tAy12nX0",
    category: "Hypothek, Zinsen & Steuern"
  },
  {
    title: "Hypothekenzinsen zeigen nach unten – für wen ist das gut?",
    url: "https://youtu.be/CD9duI9_GjY",
    category: "Hypothek, Zinsen & Steuern"
  },
  {
    title: "Amortisation beim Eigenheim einfach erklärt!",
    url: "https://youtu.be/w10aaVQxqPY",
    category: "Hypothek, Zinsen & Steuern"
  },
  {
    title: "Eigenmietwert abgeschafft! Das bedeutet es für Hausbesitzer | 2025",
    url: "https://youtu.be/LVSxUdqF4r8",
    category: "Hypothek, Zinsen & Steuern"
  },
  {
    title: "Warum ALLE mit Ja stimmen sollten! Eigenmietwert abschaffen 2025 erklärt",
    url: "https://youtu.be/_g1cnrMnaoE",
    category: "Hypothek, Zinsen & Steuern"
  },
  {
    title: "Steuern in der Schweiz: Einfach erklärt!",
    url: "https://youtu.be/bS6A3Sxq1O8",
    category: "Hypothek, Zinsen & Steuern"
  },
  {
    title: "Wichtige Steuer-Tipps für Eigentümer – teure Fehler vermeiden!",
    url: "https://youtu.be/yNIOn9LzmjQ",
    category: "Hypothek, Zinsen & Steuern"
  },
  {
    title: "Langfristig Vermögen aufbauen: Finanzplanung leicht gemacht",
    url: "https://youtu.be/md7g0XN5orY",
    category: "Hypothek, Zinsen & Steuern"
  },
  {
    title: "Vom Eigenheim zum Renditeobjekt – So geht es schneller!",
    url: "https://youtu.be/m-AAeHCGxGY",
    category: "Hypothek, Zinsen & Steuern"
  },

  {
    title: "Kaufvertrag unterschrieben – aber was kommt jetzt? Fehler vermeiden!",
    url: "https://youtu.be/eXD5DANglIk",
    category: "Kaufprozess & Übergabe"
  },
  {
    title: "Reservationsvertrag für ein Eigenheim – Tipps mit MLaw Sebastian Kaufmann",
    url: "https://youtu.be/6riA9gW0gQI",
    category: "Kaufprozess & Übergabe"
  },
  {
    title: "Achtung beim Eigenheimkauf ohne guten Makler!",
    url: "https://youtu.be/nuJPvTfwlYA",
    category: "Kaufprozess & Übergabe"
  },
  {
    title: "Das musst du erledigen, sobald du den Schlüssel hast!",
    url: "https://youtu.be/9Tl6OkJLjlU",
    category: "Kaufprozess & Übergabe"
  },
  {
    title: "Abgabe der Mietwohnung: Diese Fehler können teuer werden!",
    url: "https://youtu.be/4-Le3FM8YKU",
    category: "Kaufprozess & Übergabe"
  },
  {
    title: "Vom Mietvertrag zum Eigenheim: Kündigungsfristen & Übergabeprotokoll",
    url: "https://youtu.be/s36ciISPaTs",
    category: "Kaufprozess & Übergabe"
  },
  {
    title: "Eigentumswohnung oder Haus? | Kundenerfahrung Mission13",
    url: "https://youtu.be/T0N_Izo5n-A",
    category: "Kaufprozess & Übergabe"
  },

  {
    title: "3 Fehler beim Eigenheimkauf, die fast jeder macht",
    url: "https://youtu.be/pZbnkqiTRIM",
    category: "Fehler & Risiken"
  },
  {
    title: "Haus kaufen? Diese versteckten Kosten ruinieren viele Käufer (2025)",
    url: "https://youtu.be/ec6aJqjxCk0",
    category: "Fehler & Risiken"
  },
  {
    title: "Wer Immobilien kauft muss Hausaufgaben machen! | Simon Karrica",
    url: "https://youtu.be/Lsn9tYiVvQI",
    category: "Fehler & Risiken"
  },
  {
    title: "Warum du den Medien beim Hauskauf NICHT trauen darfst!",
    url: "https://youtu.be/oNELp5ojYRw",
    category: "Fehler & Risiken"
  },
  {
    title: "Dein Haus weg? Der KESB-Albtraum für Eigentümer!",
    url: "https://youtu.be/eyVsv_uHweg",
    category: "Fehler & Risiken"
  },
  {
    title: "Zwingt die Bank zum Hausverkauf? Insider erklärt!",
    url: "https://youtu.be/Mg14VmMeglU",
    category: "Fehler & Risiken"
  },
  {
    title: "Erbvorbezug beim Hauskauf: Diese Risiken ruinieren deine Familie!",
    url: "https://youtu.be/49T9WJgBSRc",
    category: "Fehler & Risiken"
  },
  {
    title: "Finanzplanung: So sparte ein Kunde 80'000 CHF – Risiko Erbvorbezug",
    url: "https://youtu.be/-Pu3h3BH5xc",
    category: "Fehler & Risiken"
  },

  {
    title: "Rechtliche Vorsorge beim Eigenheim – warum Aufschieben ein riesiger Fehler ist | Teil 2",
    url: "https://youtu.be/-_MclNDGDNU",
    category: "Vorsorge, Recht & Familie"
  },
  {
    title: "Ohne Ehe- & Erbvertrag? Dein Partner könnte ALLES verlieren!",
    url: "https://youtu.be/Xqln0Jcdpp0",
    category: "Vorsorge, Recht & Familie"
  },
  {
    title: "Eigenheim kaufen: Vor oder nach der Ehe? Das musst du wissen!",
    url: "https://youtu.be/li5izRJKPGQ",
    category: "Vorsorge, Recht & Familie"
  },
  {
    title: "Patientenverfügung & Vorsorgeauftrag – Mit Anwalt Sebastian Kaufmann",
    url: "https://youtu.be/9TqJpNWCmSU",
    category: "Vorsorge, Recht & Familie"
  },
  {
    title: "Warum eine 3A-Versicherung die beste Wahl für Eigenheimbesitzer ist!",
    url: "https://youtu.be/GnLXPjjRnKo",
    category: "Vorsorge, Recht & Familie"
  },
  {
    title: "Vorsorgegelder für Eigenheimkauf – Vermeide diesen Fehler!",
    url: "https://youtu.be/AbAQHqPtDVA",
    category: "Vorsorge, Recht & Familie"
  },
  {
    title: "Pensionskasse für Eigenheim – Auf diese Sachen dringend achten!",
    url: "https://youtu.be/zsZy8lB3Rp0",
    category: "Vorsorge, Recht & Familie"
  },
  {
    title: "Wichtige Versicherungen für Eigenheimbesitzer erklärt",
    url: "https://youtu.be/pSOsqn_nWCA",
    category: "Vorsorge, Recht & Familie"
  },
  {
    title: "Krankenkasse: Was Eigenheimbesitzer wissen müssen",
    url: "https://youtu.be/Q47_6lX3sjA",
    category: "Vorsorge, Recht & Familie"
  },
  {
    title: "Einkommenssicherung für Eigenheimbesitzer – Tipps von Florian Krasniqi",
    url: "https://youtu.be/gifC6_sy_UE",
    category: "Vorsorge, Recht & Familie"
  },
  {
    title: "Unumgängliche Finanz- und Versicherungsplanung | Videoserie",
    url: "https://youtu.be/cAURyZe2jhE",
    category: "Vorsorge, Recht & Familie"
  },

  {
    title: "Diese Fehler kosten dich beim Neubau ein Vermögen! | Bauleiter Joël Peter",
    url: "https://youtu.be/CtX0MoBV0iI",
    category: "Neubau & Bauleitung"
  },
  {
    title: "Was passiert nach der Baubewilligung? Joël zeigt, wie's geht! (TEIL 2)",
    url: "https://youtu.be/xrNs1X8KOS0",
    category: "Neubau & Bauleitung"
  },
  {
    title: "Braucht man wirklich einen Bauführer? Joël klärt auf! (TEIL 1)",
    url: "https://youtu.be/4qR6X9reyqk",
    category: "Neubau & Bauleitung"
  },

  {
    title: "Top 9 Fehler und Missverständnisse beim Eigenheimkauf für junge Paare",
    url: "https://youtu.be/GmHkB_REi3k",
    category: "Junge Paare & Familien"
  },
  {
    title: "Wie kann sich ein junges Paar ein Eigenheim in der Schweiz noch leisten?",
    url: "https://youtu.be/GgyQj4QyfVM",
    category: "Junge Paare & Familien"
  },
  {
    title: "Eigenheim trotz Angst? So hat Hugo es geschafft (Schweiz 2026)",
    url: "https://youtu.be/hMegu18HgZs",
    category: "Junge Paare & Familien"
  },
  {
    title: "Familie Lekaj: Eigenheim trotz Angst | Ehrliches Testimonial",
    url: "https://youtu.be/HXzGOikamlg",
    category: "Junge Paare & Familien"
  },
  {
    title: "Wir hätten fast ALLES verloren… | Unsere echte Eigenheim-Story",
    url: "https://youtu.be/eIOh5YimjMQ",
    category: "Junge Paare & Familien"
  },

  {
    title: "Wie Eigenheim-Navigator uns sicher zur Eigentumswohnung brachte",
    url: "https://youtu.be/QWVnnDqXb9Q",
    category: "Kundengeschichten"
  },
  {
    title: "Echte Erfahrungen mit dem Eigenheim-Navi!",
    url: "https://youtu.be/3okaz7541Wc",
    category: "Kundengeschichten"
  },
  {
    title: "Unser Weg zum Eigenheim – mit diesen Tipps hätten wir früher starten sollen!",
    url: "https://youtu.be/72ZkCc8-NMA",
    category: "Kundengeschichten"
  },
  {
    title: "Kundenerfahrung: Urs & Sandra | Eigenheim-Navigator",
    url: "https://youtu.be/t7s-ter-6fQ",
    category: "Kundengeschichten"
  },
  {
    title: "Ali & Cynthias TRAUMWOHNUNG – So wurde es möglich!",
    url: "https://youtu.be/HHntKM37lww",
    category: "Kundengeschichten"
  },
  {
    title: "Niru & Adsayas neue Eigentumswohnung – So haben sie es geschafft!",
    url: "https://youtu.be/LZooJyVNvEE",
    category: "Kundengeschichten"
  },
  {
    title: "Ein Blick ins Zuhause von Milos & Bojana (House Tour)",
    url: "https://youtu.be/XK8buH-0fAc",
    category: "Kundengeschichten"
  },
  {
    title: "Kundenerfahrung: Besir Vejseli | Eigenheim-Navigator",
    url: "https://youtu.be/jgM7YxAKc9w",
    category: "Kundengeschichten"
  },
  {
    title: "Kundenerfahrung: David & Kristina | Eigenheim-Navigator",
    url: "https://youtu.be/-IoxwK9KQ3w",
    category: "Kundengeschichten"
  },
  {
    title: "Kundenerfahrung: Anna & Marc | Eigenheim-Navigator",
    url: "https://youtu.be/O5T_7lwLa3M",
    category: "Kundengeschichten"
  },
  {
    title: "Kundenerfahrung: Bojana & Milos | Eigenheim-Navigator",
    url: "https://youtu.be/MceBnGpFSd8",
    category: "Kundengeschichten"
  },
  {
    title: "Eigentumswohnung oder Haus? | Kundenerfahrung Mission13",
    url: "https://youtu.be/T0N_Izo5n-A",
    category: "Kundengeschichten"
  }
];

const getMappedCategory = (video: { title: string; category: string }): string => {
  const titleLower = video.title.toLowerCase();
  
  if (titleLower.includes("eigenkapital") || titleLower.includes("eigengeld") || titleLower.includes("eigenmittel") || titleLower.includes("vorsorgebezug") || titleLower.includes("erbvorbezug") || titleLower.includes("säule") || titleLower.includes("kapital")) {
    return "Eigenkapital";
  }
  if (titleLower.includes("tragbarkeit") || titleLower.includes("einkommen") || titleLower.includes("bonität") || titleLower.includes("leisten") || titleLower.includes("tragbar")) {
    return "Tragbarkeit";
  }
  if (video.category === "Fehler & Risiken" || titleLower.includes("fehler") || titleLower.includes("falle") || titleLower.includes("risiko") || titleLower.includes("albtraum") || titleLower.includes("problem")) {
    return "Fehler vermeiden";
  }
  if (video.category === "Einstieg ins Eigenheim" || titleLower.includes("timing") || titleLower.includes("zeitpunkt") || titleLower.includes("vorbereitung") || titleLower.includes("fahrplan") || titleLower.includes("schritt") || titleLower.includes("start")) {
    return "Timing & Planung";
  }
  if (video.category === "Finanzierung & Bank" || video.category === "Hypothek, Zinsen & Steuern" || titleLower.includes("hypothek") || titleLower.includes("zins") || titleLower.includes("bank") || titleLower.includes("finanzierung")) {
    return "Finanzierung & Hypothek";
  }
  if (video.category === "Kaufprozess & Übergabe" || titleLower.includes("kaufprozess") || titleLower.includes("vertrag") || titleLower.includes("notar") || titleLower.includes("übergabe")) {
    return "Kaufprozess";
  }
  return "Objekt & Entscheidung";
};

const categories = [
  "Alle Videos",
  "Eigenkapital",
  "Finanzierung & Hypothek",
  "Tragbarkeit",
  "Kaufprozess",
  "Fehler vermeiden",
  "Timing & Planung",
  "Objekt & Entscheidung"
];

// Deduplicate and map categories to the new conversion-friendly categories
const uniqueVideos = Array.from(new Set(videos.map(v => JSON.stringify(v)))).map(s => {
  const parsed = JSON.parse(s) as VideoItem;
  return {
    ...parsed,
    category: getMappedCategory(parsed)
  };
});

const getYoutubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const GlossarySection: React.FC<GlossarySectionProps> = ({ onStartCheck }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Alle Videos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Filters calculation
  const filteredVideos = useMemo(() => {
    return uniqueVideos.filter((video) => {
      const matchesCategory = selectedCategory === "Alle Videos" || video.category === selectedCategory;
      const matchesSearch = 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        video.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const shouldLimit = selectedCategory === "Alle Videos" && !searchQuery && !isExpanded;

  const displayedVideos = useMemo(() => {
    return shouldLimit ? filteredVideos.slice(0, 6) : filteredVideos;
  }, [filteredVideos, shouldLimit]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setIsExpanded(false);
  };

  const handleVideoClick = (video: VideoItem) => {
    // Analytics tracking push
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "video_glossary_click",
        video_title: video.title,
        video_category: video.category,
        video_url: video.url
      });
    } catch (e) {
      console.error('[Glossary Tracking Error]', e);
    }
  };

  return (
    <section id="glossar" className="py-16 sm:py-28 px-4 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Intro-Bereich */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100 shadow-sm animate-fade-in">
            <BookOpen size={14} className="text-blue-600" />
            <span>Wissen & Expertise (Ostschweiz)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight select-none">
            Wissen, das dir vor dem Eigenheimkauf hilft
          </h2>
          <div className="h-1.5 bg-[#F87101] w-20 mx-auto rounded-full mb-8"></div>
          <p className="text-slate-650 font-medium leading-relaxed text-sm sm:text-base md:text-lg">
            Bevor du eine grosse finanzielle Entscheidung triffst, solltest du die wichtigsten Grundlagen verstehen. Im Wissens-Glossar findest du kurze Inhalte zu Eigenkapital, Tragbarkeit, Hypothek, Kaufprozess und typischen Fehlern beim Eigenheimkauf.
          </p>
          <p className="text-slate-500 font-semibold text-xs sm:text-sm mt-4 italic">
            Nutze die Filter, um genau die Videos zu finden, die zu deiner aktuellen Situation passen.
          </p>
        </div>

        {/* Search Input and Counter */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Thema, Stichwort oder Frage eingeben..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-950 text-sm focus:border-blue-600 focus:outline-none transition-all shadow-sm focus:shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                Leeren
              </button>
            )}
          </div>
          
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-bold px-1">
            <div className="flex items-center gap-1.5">
              <Filter size={14} className="text-slate-400" />
              <span>Filter: <span className="text-slate-800">{selectedCategory}</span></span>
            </div>
            <span>{filteredVideos.length} {filteredVideos.length === 1 ? 'Video' : 'Videos'} gefunden</span>
          </div>
        </div>

        {/* Kategorie-Filter als Buttons */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2.5 justify-center max-w-5xl mx-auto">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 border-2 border-blue-600 scale-102' 
                      : 'bg-white text-slate-600 border-2 border-slate-100/80 hover:border-blue-200 hover:bg-slate-50/50'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Video-Galerie Grid */}
        {filteredVideos.length > 0 ? (
          <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 ${
              (selectedCategory === "Alle Videos" && !searchQuery && filteredVideos.length > 6) ? 'mb-10' : 'mb-20'
            }`}>
              {displayedVideos.map((video, idx) => {
                const videoId = getYoutubeVideoId(video.url);
                const thumbnailUrl = videoId 
                  ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` 
                  : null;
                
                return (
                  <a
                    key={idx}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleVideoClick(video)}
                    className="group flex flex-col bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer h-full relative overflow-hidden"
                  >
                    {/* Thumbnail Video Container */}
                    {thumbnailUrl ? (
                      <div className="relative aspect-video w-full rounded-[18px] overflow-hidden bg-slate-100 mb-4 flex-shrink-0">
                        <img
                          src={thumbnailUrl}
                          alt={video.title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Play Hover Overlay styled professionally */}
                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 flex items-center justify-center transition-colors duration-300">
                          <div className="w-12 h-12 bg-white/95 text-blue-600 group-hover:bg-blue-600 group-hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                            <Play size={18} className="fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative aspect-video w-full rounded-[18px] overflow-hidden bg-slate-100 mb-4 flex-shrink-0 flex items-center justify-center">
                        <Play size={24} className="text-slate-300" />
                      </div>
                    )}

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        {/* Category Label */}
                        <div className="inline-flex items-center gap-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-full border border-blue-100/30">
                            {video.category}
                          </span>
                        </div>

                        {/* YouTube Title */}
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-3 leading-snug">
                          {video.title}
                        </h3>
                      </div>

                      {/* Video Play Call-to-action */}
                      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-blue-700 transition-colors">
                        <span className="flex items-center gap-1.5 uppercase tracking-widest text-[10px] text-slate-400 group-hover:text-blue-600">
                          <Play size={12} className="fill-current text-[#F87101] group-hover:text-blue-600" />
                          Video ansehen
                        </span>
                        <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Toggle Expand Accordion Button */}
            {selectedCategory === "Alle Videos" && !searchQuery && filteredVideos.length > 6 && (
              <div className="flex justify-center mb-20">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="px-8 py-4 bg-white hover:bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black text-blue-600 hover:text-blue-700 hover:border-blue-200 shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>{isExpanded ? "Weniger Videos anzeigen" : `Weitere Videos anzeigen (+${filteredVideos.length - 6})`}</span>
                  <svg 
                    className={`w-4 h-4 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-[32px] max-w-xl mx-auto mb-20 shadow-sm">
            <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
              <Search size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Zu deiner Suche wurden keine Videos gefunden.</h3>
            <p className="text-slate-500 text-xs px-6 font-medium">Probiere andere Begriffe aus oder setze deinen Filter oben auf "Alle Videos" zurück.</p>
            <button
              onClick={() => {
                setSelectedCategory("Alle Videos");
                setSearchQuery("");
              }}
              className="mt-6 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black px-5 py-2.5 rounded-xl transition-all"
            >
              Suche zurücksetzen
            </button>
          </div>
        )}

        {/* CTA-Element */}
        <div className="max-w-4xl mx-auto relative overflow-hidden bg-slate-900 text-white rounded-[32px] p-8 sm:p-12 md:p-14 shadow-2xl shadow-blue-900/10 mt-16">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F87101]/10 rounded-full blur-3xl opacity-60" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#F87101]/10 text-[#F87101] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#F87101]/20">
                <Sparkles size={12} className="text-[#F87101]" />
                <span>Nächster Schritt</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                Du möchtest wissen, was das konkret für deine Situation bedeutet?
              </h3>
              <p className="text-slate-450 font-medium leading-relaxed text-sm">
                Starte nicht mit riskantem Halbwissen oder Bauchgefühl. Lass uns deine individuelle Ausgangslage in der Ostschweiz strukturiert einordnen.
              </p>
            </div>
            
            <div className="flex-shrink-0 w-full md:w-auto">
              <button
                onClick={onStartCheck}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black text-center text-sm sm:text-base py-4 py-4.5 px-8 rounded-2xl shadow-xl shadow-blue-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Realitätscheck starten
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GlossarySection;
