import { useEffect, useState } from "react";
import type { paths } from "./types/api-generated";
import "./App.css";

type MembersResponse =
  paths["/members"]["get"]["responses"][200]["content"]["application/json"];

type MemberDetailResponse =
  paths["/members/{member_id}"]["get"]["responses"][200]["content"]["application/json"];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [members, setMembers] = useState<MembersResponse>([]);
  const [selectedMember, setSelectedMember] =
    useState<MemberDetailResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadMembers() {
      try {
        const response = await fetch(`${API_BASE_URL}/members`);

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

  async function loadMemberDetail(memberId: string) {
    setIsDetailLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/members/${encodeURIComponent(memberId)}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: MemberDetailResponse = await response.json();
      setSelectedMember(data);
    } catch {
      setErrorMessage("Failed to fetch member detail");
    } finally {
      setIsDetailLoading(false);
    }
  }

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
                <td>
                  <button
                    type="button"
                    onClick={() => void loadMemberDetail(member.member_id)}
                  >
                    {member.member_id}
                  </button>
                </td>
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

      <section>
        <h2>Member Detail</h2>

        {isDetailLoading && <p>Loading detail...</p>}

        {!isDetailLoading && selectedMember === null && (
          <p>Select a member from the table.</p>
        )}

        {!isDetailLoading && selectedMember !== null && (
          <>
            <p>Member ID: {selectedMember.member_id}</p>
            <p>Member type: {selectedMember.member_type}</p>
            <p>Storey: {selectedMember.storey_id}</p>
            <p>Dimension: {selectedMember.dimension_id}</p>
            <p>Material: {selectedMember.material_id}</p>
            <p>Zone: {selectedMember.zone_id}</p>

            <h3>Geometry Points</h3>
            <table>
              <thead>
                <tr>
                  <th>Point</th>
                  <th>X (mm)</th>
                  <th>Y (mm)</th>
                  <th>Z (mm)</th>
                </tr>
              </thead>

              <tbody>
                {selectedMember.geometry_points.map((point, index) => (
                  <tr key={`${selectedMember.member_id}-point-${index}`}>
                    <td>P{index + 1}</td>
                    <td>{point[0]}</td>
                    <td>{point[1]}</td>
                    <td>{point[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>
    </main>
  );
}

export default App;