import "./App.css";
import { getFormattedNumber } from "./utils/intl/number";
import RepositoriesTableWidget from "./widgets/RepositoriesTable";

const REPOSITORIES_STARS_LEFT_BOUND = 10000;

function App() {
  return (
    <div className="App">
      <h1>
        <span aria-describedby="note">
          Most popular
          <span className="asterisk" aria-hidden>
            *
          </span>{" "}
          TypeScript repositories.
        </span>
        <br />
        Check them out!
      </h1>
      <p id="note">
        <small>
          <span className="asterisk" aria-hidden>
            *
          </span>{" "}
          repositories that have at least{" "}
          {getFormattedNumber(REPOSITORIES_STARS_LEFT_BOUND, "en-US")} stars.
        </small>
      </p>
      <RepositoriesTableWidget
        primaryLanguage="typescript"
        starsLeftBound={REPOSITORIES_STARS_LEFT_BOUND}
      />
    </div>
  );
}

export default App;
