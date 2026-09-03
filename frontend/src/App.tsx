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
      <header className="page-header">
        <h1>Structural Members</h1>
        <p className="page-subtitle">
          Browse the member schedule and open a row to inspect its geometry,
          material, and section detail.
        </p>
      </header>

      <div className="layout">
        <section className="panel">
          <div className="panel-head">
            <h2>Members</h2>
            {members.length > 0 && (
              <span className="count-chip">{members.length} total</span>
            )}
          </div>

          {isLoading && <p className="status-line">Loading members...</p>}
          {errorMessage && (
            <p className="status-line is-error">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && members.length === 0 && (
            <p className="status-line">No members found.</p>
          )}

          {members.length > 0 && (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Member ID</th>
                    <th>Type</th>
                    <th>Storey</th>
                    <th>Dimension</th>
                    <th>Material</th>
                  </tr>
                </thead>

                <tbody>
                  {members.map((member) => (
                    <tr
                      key={member.member_id}
                      className={
                        selectedMember?.member_id === member.member_id
                          ? "is-selected"
                          : undefined
                      }
                    >
                      <td>
                        <button
                          type="button"
                          className="member-id-button"
                          onClick={() =>
                            void loadMemberDetail(member.member_id)
                          }
                        >
                          {member.member_id}
                        </button>
                      </td>
                      <td>
                        <span
                          className={`type-badge type-${member.member_type}`}
                        >
                          {member.member_type}
                        </span>
                      </td>
                      <td>{member.storey_id}</td>
                      <td>{member.dimension_id}</td>
                      <td>{member.material_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Member Detail</h2>
          </div>

          {isDetailLoading && <p className="status-line">Loading detail...</p>}

          {!isDetailLoading && selectedMember === null && (
            <p className="detail-empty">Select a member from the table.</p>
          )}

          {!isDetailLoading && selectedMember !== null && (
            <div className="detail-body">
              <div className="detail-title">
                <span className="member-id">{selectedMember.member_id}</span>
                <span
                  className={`type-badge type-${selectedMember.member_type}`}
                >
                  {selectedMember.member_type}
                </span>
              </div>

              <div className="stat-row">
                <div className="stat">
                  <span className="stat-label">Material strength</span>
                  <span className="stat-value">
                    {selectedMember.material_strength_kg_cm2}
                    <span className="unit">kg/cm&sup2;</span>
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Storey</span>
                  <span className="stat-value">
                    {selectedMember.storey_name}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Pour sequence</span>
                  <span className="stat-value">
                    {selectedMember.pour_sequence}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Dimension Section</h3>
                <dl className="kv-grid">
                  {Object.entries(selectedMember.dimension_section).map(
                    ([field, value]) => (
                      <div className="kv-cell" key={field}>
                        <dt>{field}</dt>
                        <dd>{value}</dd>
                      </div>
                    ),
                  )}
                </dl>
              </div>

              <div className="detail-section">
                <h3>Geometry Points</h3>
                <table className="points-table">
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
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;