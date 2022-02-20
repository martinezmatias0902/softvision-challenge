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

  function updateCandidate(id: Candidate["id"], partial: Partial<Candidate>) {
    setCandidates((candidates) =>
      candidates.map((candidate) =>
        candidate.id == id
          ? {
              ...candidate,
              ...partial,
            }
          : candidate,
      ),
    );
  }

  function editCandidate(id: Candidate["id"], partial: Partial<Candidate>) {
    return 0;
  }

  function addCandidate() {
    const candidate = window.prompt("Nombre: ");
    const comments = window.prompt("Comentarios: " || "");

    if (!candidate) return;

    setCandidates((candidates) =>
      candidates.concat({
        id: String(+new Date()),
        name: candidate,
        comments,
        step: "Entrevista inicial",
      }),
    );
  }

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
      {STEPS.map((step, index) => (
        <section key={step} className={styles.column}>
          <h1>{step}</h1>
          {candidates
            .filter((candidate) => candidate.step == step)
            .map((candidate) => (
              <article key={candidate.id} className={styles.card}>
                <div className={styles.content}>
                  <div>
                    <p className={styles.candidate}>{candidate.name}</p>
                    {candidate.comments && (
                      <p
                        className={styles.comments}
                        onClick={() =>
                          updateCandidate(candidate.id, {
                            comments:
                              window.prompt("Comentarios del candidato: ", candidate.comments) ||
                              "",
                          })
                        }
                      >
                        {candidate.comments}
                      </p>
                    )}
                  </div>
                  <div>
                    {index > 0 && (
                      <button
                        onClick={() =>
                          updateCandidate(candidate.id, {
                            step: STEPS[index - 1],
                          })
                        }
                      >
                        {"<"}
                      </button>
                    )}
                    {index < STEPS.length - 1 && (
                      <button
                        onClick={() =>
                          updateCandidate(candidate.id, {
                            step: STEPS[index + 1],
                          })
                        }
                      >
                        {">"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          {index == 0 && <button onClick={addCandidate}>Agregar Candidato</button>}
        </section>
      ))}
    </main>
  );
}

export default App;
