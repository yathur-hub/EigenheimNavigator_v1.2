
import React, { useEffect } from 'react';

const Impressum: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white py-12 sm:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-12 tracking-tight">Impressum</h1>
        
        <div className="space-y-10 text-slate-600 leading-relaxed">
          <section className="space-y-4">
            <p className="font-bold text-slate-900">
              Mission13 GmbH<br />
              Im Lerchenfeld 2<br />
              9535 Wilen<br />
              Schweiz
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Vertretungsberechtigte (Persönlich haftende Gesellschafter/in)</h2>
            <p>Mission13 GmbH</p>
            <p>Diese wird vertreten durch die Geschäftsführer:<br />Florian Krasniqi</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Kontakt:</h2>
            <p>
              Tel: +41 71 952 13 13<br />
              E-Mail: info@mission13.ch
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Unternehmens-Identifikationsnummer (UID):</h2>
            <p>CH-320.4.084.729-1</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Inhaltlich Verantwortlicher:</h2>
            <p>Mission13 GmbH</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Copyright</h2>
            <p>
              Alle auf unseren Internetseiten veröffentlichten Werke bzw. Werkteile, wie z.B. Texte, Bilder, Illustrationen und Dateien unterliegen dem Urheberrecht und anderen Gesetzen zum Schutz geistigen Eigentums. Jede weitere Veröffentlichung, Vervielfältigung, Verbreitung oder sonstige Nutzung, auch auszugsweise, bedarf der schriftlichen Genehmigung der Mission13 GmbH.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Haftungsausschluss</h2>
            <p>
              Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen. Alle Angebote sind unverbindlich. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne besondere Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Haftungsausschluss für Links</h2>
            <p>
              Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs. Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr des jeweiligen Nutzers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Urheberrechte</h2>
            <p>
              Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf dieser Website, gehören ausschliesslich der Mission13 GmbH. oder den speziell genannten Rechteinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung des Urheberrechtsträgers im Voraus einzuholen.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Cookie</h2>
            <p>
              Diese Website verwendet Retargeting-Technologie der Google Inc. („Google“). Diese ermöglicht es, Besucher unserer Internetseiten gezielt mit personalisierter, interessenbezogener Werbung anzusprechen, die sich bereits für unseren Shop und unsere Produkte interessiert haben. Die Einblendung der Werbemittel erfolgt dabei auf Basis einer Cookie-basierten Analyse des früheren Nutzungsverhaltens. In den Fällen der Retargeting-Technologie wird ein Cookie auf Ihrem Computer oder mobilen Endgerät gespeichert, um anonymisierte Daten über Ihre Interessen zu erfassen und so die Werbung individuell auf die gespeicherten Informationen anzupassen. Diese Cookies sind kleine Textdateien, die auf Ihrem Computer oder mobilen Endgerät gespeichert werden. Sie bekommen dadurch Werbung angezeigt, die mit hoher Wahrscheinlichkeit Ihren Produkt- und Informationsinteressen entspricht. Weitergehende Informationen und die Datenschutzbestimmungen bezüglich Werbung und Google können Sie hier einsehen.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Hinweis</h2>
            <p>
              Sämtliche Inhalte und Werke auf dieser Website unterliegen dem Schweizer Urheberrecht und anderen Gesetzen zum Schutz des geistigen Eigentums. Es darf keine Vervielfältigung, Veränderung, Verbreitung und Verwertung der Inhalte erfolgen, sofern von der Firma Mission13 GmbH oder dem jeweiligen Inhaber der hierfür relevanten Rechte nicht zugestimmt wurde. Die Website der Mission13 GmbH ist mit größtmöglicher Sorgfalt zusammengestellt worden und wird regelmäßig aktualisiert und überprüft. Die übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit, Aktualität oder Qualität der Informationen auf dieser Website. Unsere Website enthält externe Links zu anderen Seiten. Für die Inhalte und die Funktion der verlinkten Seiten übernehmen wir keine Haftung.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Impressum;
