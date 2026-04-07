
import React, { useEffect } from 'react';

const Privacy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white py-12 sm:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-12 tracking-tight">Datenschutz</h1>
        
        <div className="space-y-10 text-slate-600 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">1. Allgemeines</h2>
            <p>
              Betreiberin der Website www.mission13.ch (nachfolgend die "Plattform") ist die Mission13 GmbH. Diese Datenschutzerklärung zeigt den Umgang von Mission13 GmbH mit Personendaten auf und legt insbesondere dar, welche Personendaten von Besuchern der Plattform sowie registrierten Kunden (nachfolgend gemeinsam "Benutzer" genannt) von Mission13 GmbH bearbeitet werden und zu welchen Zwecken die Bearbeitung dieser Daten erfolgt. Sie beschreibt zudem, wie gesammelte Personendaten überprüft, korrigiert oder gelöscht werden können. Diese Datenschutzerklärung ist integrierter Bestandteil der Allgemeinen Geschäftsbedingungen von Mission13 GmbH.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">2. Anerkennung der Datenschutzerklärung</h2>
            <p>
              Besucher erklären sich mit der Nutzung der Website automatisch mit dieser Datenschutzerklärung einverstanden. Registrierte Kunden akzeptieren diese Datenschutzerklärung zusätzlich mit dem Anklicken des Feldes "Ich stimme den Allgemeinen Geschäftsbedingungen und der Datenschutzerklärung zu". Benutzer erklären sich insbesondere einverstanden mit der Erhebung der Personendaten gemäss Ziff. 3 nachstehend und der Verwendung dieser Daten gemäss Ziff. 4 nachstehend.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">3. Personendaten</h2>
            <p>
              Mission13 GmbH respektiert die Privatsphäre der Benutzer und sammelt nur Personendaten (wie Name, Adresse, E-Mail-Adresse), die vom Benutzer freiwillig im Rahmen seiner Registrierung für die Plattform oder bei der späteren Benutzung der Plattform zur Verfügung gestellt oder durch Cookies automatisch erhoben werden. Im Rahmen der Registrierung für die Plattform hat der Benutzer Mission13 GmbH folgende Daten zwingend anzugeben:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vorname und Nachname</li>
              <li>Adresse</li>
              <li>E-Mail adresse</li>
              <li>Telefonnummer (Festnetz und oder Mobil)</li>
              <li>Angaben zum Wohnort</li>
              <li>Zusätzliche Angaben des Zustandes der Wohnung oder des Gebäudes, die für Offerten relevant sind</li>
            </ul>
            <p>Der Zugang zu Personendaten ist auf die Mitarbeiter von Mission13 GmbH begrenzt.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">4. Weitergabe von Personendaten an Dritte</h2>
            <p>
              Mission13 GmbH kann für die Erbringung ihrer Leistungen Dritte beiziehen und zu diesem Zweck Daten an diese weitergeben. Benutzer erteilen hiermit die Zustimmung zu dieser Weitergabe ihrer Daten.
            </p>
            <p>
              Mission13 GmbH kann darüber hinaus die Daten des Nutzers ausgewählten Dritten für physisches Marketing bereitstellen.
            </p>
            <p>
              Mission13 GmbH kann gestützt auf die Einwilligung des Nutzers Daten (Vorname, Name, Telefonnummer, Emailadresse, alte & neue Wohnadresse) an den Partner Basler Versicherungen zwecks einer Versicherungsberatung weitergeben. Der Nutzer hat das Recht, die Einwilligung jederzeit zu widerrufen. Durch den Widerruf der Einwilligung wird die Rechtmässigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung nicht berührt.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">5. Eingesetzte Tools und Drittanbieter</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-900">Google Tag Manager</h3>
                <p>Zur Verwaltung von Website-Tags. Der Tag Manager selbst speichert keine personenbezogenen Daten, löst jedoch andere Tools aus.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Google Analytics (GA4)</h3>
                <p>Zur Analyse des Nutzerverhaltens auf der Website.</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Anbieter: Google Ireland Ltd.</li>
                  <li>Daten: IP-Adresse (gekürzt), Nutzungsverhalten, Geräteinformationen</li>
                  <li>Zweck: Analyse, Optimierung der Website</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Google Marketing Plattform (inkl. Google Ads / Remarketing)</h3>
                <p>Zur Ausspielung personalisierter Werbung und Messung von Kampagnenleistung.</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Verarbeitung von Nutzerdaten für zielgerichtete Werbung</li>
                  <li>Einsatz von Remarketing-Listen</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Meta Pixel (Facebook / Instagram)</h3>
                <p>Zur Messung der Wirksamkeit von Facebook- und Instagram-Werbeanzeigen.</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Anbieter: Meta Platforms Ireland Ltd.</li>
                  <li>Daten: Nutzerverhalten, Interaktionen</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">LinkedIn Insight Tag</h3>
                <p>Zur Analyse und Optimierung von LinkedIn-Kampagnen.</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Anbieter: LinkedIn Ireland Unlimited Company</li>
                  <li>Daten: Seitenaufrufe, Conversions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Formspree</h3>
                <p>Zur Verarbeitung von Formularanfragen.</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Anbieter: Formspree Inc., USA</li>
                  <li>Daten: E-Mail, Nachrichteninhalte, ggf. weitere Formularfelder</li>
                  <li>Zweck: Weiterleitung und Verarbeitung von Kontaktanfragen</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Weitere Tools</h3>
                <p>Je nach Nutzung können zusätzliche Tools eingesetzt werden, z. B.: Hosting-Provider, CRM-Systeme, Newsletter-Tools. Diese Anbieter verarbeiten Daten ausschliesslich im Auftrag und gemäss den geltenden Datenschutzbestimmungen.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">6. Weitergabe von Personendaten</h2>
            <p>Mission13 GmbH kann Personendaten an Dritte weitergeben, sofern dies notwendig ist für:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vertragserfüllung</li>
              <li>technische Dienstleistungen</li>
              <li>Marketingzwecke (nur mit Einwilligung)</li>
            </ul>
            <p><span className="font-bold">Versicherungspartner:</span> Daten (Vorname, Name, Telefonnummer, E-Mail, Adressen) können – mit ausdrücklicher Einwilligung – an die Basler Versicherungen weitergegeben werden.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">7. Datenübermittlung ins Ausland</h2>
            <p>Die Verarbeitung kann auch ausserhalb der Schweiz oder EU erfolgen (z. B. USA). Dabei wird sichergestellt, dass ein angemessenes Datenschutzniveau besteht oder geeignete Garantien (z. B. Standardvertragsklauseln) vorliegen.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">8. Datensicherheit</h2>
            <p>Mission13 GmbH trifft angemessene technische und organisatorische Massnahmen, um Personendaten zu schützen vor unbefugtem Zugriff, Verlust oder Missbrauch.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">9. Speicherdauer</h2>
            <p>Personendaten werden nur so lange gespeichert, wie dies notwendig ist für die Vertragsabwicklung, gesetzliche Verpflichtungen oder legitime Geschäftsinteressen.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">10. Rechte der Benutzer</h2>
            <p>Benutzer haben jederzeit das Recht auf:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Auskunft über gespeicherte Daten</li>
              <li>Berichtigung falscher Daten</li>
              <li>Löschung („Recht auf Vergessenwerden“)</li>
              <li>Einschränkung der Verarbeitung</li>
              <li>Datenübertragbarkeit</li>
              <li>Widerruf erteilter Einwilligungen</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">11. Serverstandort</h2>
            <p>Die Daten werden auf Servern innerhalb Europas gespeichert.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">12. Änderungen</h2>
            <p>Mission13 GmbH kann diese Datenschutzerklärung jederzeit anpassen. Es gilt jeweils die aktuelle Version auf der Plattform.</p>
          </section>

          <section className="pt-8 border-t border-slate-100">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Letzte Aktualisierung: April 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
