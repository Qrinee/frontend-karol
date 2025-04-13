<h1>Karol Frontend</h1>
  <p>Aplikacja frontend dla projektu <strong>Karol</strong> – inteligentnego głośnika i asystenta dla seniorów. Projekt został zbudowany przy użyciu React.js oraz Vite.</p>

  <h2>Spis Treści</h2>
  <ul>
    <li><a href="#opis-projektu">Opis projektu</a></li>
    <li><a href="#technologie">Technologie</a></li>
    <li><a href="#instalacja">Instalacja</a></li>
    <li><a href="#uruchomienie">Uruchomienie</a></li>
    <li><a href="#budowanie-wersji-produkcji">Budowanie wersji produkcyjnej</a></li>
    <li><a href="#struktura-projektu">Struktura projektu</a></li>
    <li><a href="#kontrybucja">Kontrybucja</a></li>
    <li><a href="#licencja">Licencja</a></li>
  </ul>

  <h2 id="opis-projektu">Opis projektu</h2>
  <p>Projekt <strong>Karol Frontend</strong> stanowi interfejs użytkownika dla inteligentnego głośnika i asystenta, który wspiera seniorów w codziennych zadaniach, przypomina o lekach oraz dba o bezpieczeństwo cyfrowe. Aplikacja zapewnia przejrzysty i intuicyjny interfejs, umożliwiając łatwe zarządzanie ustawieniami i monitorowanie aktywności systemu.</p>

  Film - https://www.youtube.com/watch?v=2c0_HzGvdBA

  <h2 id="technologie">Technologie</h2>
  <ul>
    <li><strong>React.js</strong> – biblioteka do budowania interfejsów użytkownika.</li>
    <li><strong>Vite</strong> – narzędzie do szybkiego tworzenia aplikacji frontend.</li>
    <li><strong>JavaScript (ES6+)</strong> – język programowania użyty do logiki aplikacji.</li>
    <li><strong>CSS / SCSS</strong> – stylizacja aplikacji.</li>
  </ul>

  <h2 id="instalacja">Instalacja</h2>
  <ol>
    <li>
      <strong>Klonowanie repozytorium:</strong>
      <pre><code>git clone https://github.com/twoj-uzytkownik/karol-frontend.git
cd karol-frontend</code></pre>
    </li>
    <li>
      <strong>Instalacja zależności:</strong>
      <pre><code>npm install</code></pre>
    </li>
  </ol>

  <h2 id="uruchomienie">Uruchomienie</h2>
  <p>Uruchom aplikację w trybie deweloperskim:</p>
  <pre><code>npm run dev</code></pre>
  <p>Po uruchomieniu aplikacji, otwórz przeglądarkę i wejdź na adres <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.</p>

  <h2 id="budowanie-wersji-produkcji">Budowanie wersji produkcyjnej</h2>
  <p>Aby zbudować aplikację do produkcji, użyj komendy:</p>
  <pre><code>npm run build</code></pre>
  <p>W wyniku budowania zostanie wygenerowany folder <code>dist</code>, który zawiera zoptymalizowany kod gotowy do wdrożenia.</p>

  <h2 id="struktura-projektu">Struktura projektu</h2>
  <pre><code>
karol-frontend/
├── public/              # Statyczne zasoby (favicon, index.html, itp.)
├── src/                 # Kod źródłowy aplikacji
│   ├── assets/          # Zasoby graficzne i style
│   ├── components/      # Komponenty React
│   ├── pages/           # Strony aplikacji
│   ├── App.jsx          # Główny komponent aplikacji
│   └── main.jsx         # Punkt wejścia do aplikacji
├── .gitignore
├── package.json
├── README.md
└── vite.config.js       # Konfiguracja Vite
  </code></pre>

  <h2 id="kontrybucja">Kontrybucja</h2>
  <p>Chętnie przyjmujemy zgłoszenia błędów, sugestie oraz pull requesty. Aby wnosić zmiany:</p>
  <ol>
    <li><strong>Fork</strong> tego repozytorium.</li>
    <li>Utwórz nową gałąź:
      <pre><code>git checkout -b feature/nazwa-funkcji</code></pre>
    </li>
    <li>Wprowadź zmiany i zapisz commit:
      <pre><code>git commit -am 'Dodaj nową funkcjonalność'</code></pre>
    </li>
    <li>Wypchnij zmiany do swojego forka:
      <pre><code>git push origin feature/nazwa-funkcji</code></pre>
    </li>
    <li>Utwórz nowy <strong>Pull Request</strong>.</li>
  </ol>
