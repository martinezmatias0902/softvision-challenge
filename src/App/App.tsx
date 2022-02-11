import type {Candidate} from "../types/candidate";

import React, {useState, useEffect} from "react";

import api from "../api";

import styles from "./App.module.scss";

const STEPS: Candidate["step"][] = [
  "Entrevista inicial",
  "Entrevista técnica",
  "Oferta",
  "Asignación",
  "Rechazo",
];

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [status, setStatus] = useState<"init" | "resolved">("init");

  useEffect(() => {
    api.candidates.list().then((candidates) => {
      setCandidates(candidates);
      setStatus("resolved");
    });
  }, []);

  if (status == "init") {
    return <span>Cargando...</span>;
  }

  return (
    <main className={styles.columns}>
      {STEPS.map((step) => (
        <section key={step} className={styles.column}>
          <h1>{step}</h1>
          {candidates
            .filter((candidate) => candidate.step == step)
            .map((candidate) => (
              <article key={candidate.id} className={styles.card}>
                <div>
                  <p className={styles.candidate}>{candidate.name}</p>
                  {candidate.comments && <p className={styles.comments}>{candidate.comments}</p>}
                </div>
                <div>
                  <button>{"<"}</button>
                  <button>{">"}</button>
                </div>
              </article>
            ))}
        </section>
      ))}
    </main>
  );
}

export default App;
