import { useEffect, useState } from "react";
import type { paths } from "./types/api-generated";

type MembersResponse =
  paths["/members"]["get"]["responses"][200]["content"]["application/json"];

function App() {
  const [members, setMembers] = useState<MembersResponse>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadMembers() {
      try {
        const response = await fetch("http://localhost:8000/members");

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: MembersResponse = await response.json();
        setMembers(data);
      } catch {
        setErrorMessage("Failed to fetch members");
      } finally {
        setIsLoading(false);
      }
    }

    void loadMembers();
  }, []);

  return (
    <main>
      <h1>Structural Members</h1>

      {isLoading && <p>Loading members...</p>}

      {errorMessage && <p>{errorMessage}</p>}

      {!isLoading && !errorMessage && members.length === 0 && (
        <p>No members found.</p>
      )}

      {members.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Type</th>
              <th>Storey</th>
              <th>Dimension</th>
              <th>Material</th>
              <th>Zone</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member.member_id}>
                <td>{member.member_id}</td>
                <td>{member.member_type}</td>
                <td>{member.storey_id}</td>
                <td>{member.dimension_id}</td>
                <td>{member.material_id}</td>
                <td>{member.zone_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default App;