import { useState } from "react";
import type { paths } from "./types/api-generated";

type HelloResponse =
  paths["/db-check"]["get"]["responses"][200]["content"]["application/json"];

function App() {
  const [message, setMessage] = useState("Data not yet fetched");

  async function getMessage() {
    setMessage("Fetching data...");

    try {
      const response = await fetch("http://localhost:8000/db-check");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: HelloResponse = await response.json();
      setMessage(`database ${data.database}: ${data.status}`);
    } catch {
      setMessage("Failed to fetch data from backend");
    }
  }

  return (
    <div>
      <h1>Week 2 Frontend</h1>
      <button onClick={getMessage}>Fetch Data</button>
      <p>{message}</p>
    </div>
  );
}

export default App;