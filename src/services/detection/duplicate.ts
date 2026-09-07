import { AnomalyItem, ProjectEntity } from '../../types';

// Simple token similarity
function calculateStringSimilarity(s1: string, s2: string): number {
  const set1 = new Set(s1.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/));
  const set2 = new Set(s2.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/));
  if (set1.size === 0 || set2.size === 0) return 0;
  let intersection = 0;
  for (const item of set1) {
    if (set2.has(item)) intersection++;
  }
  return (2 * intersection) / (set1.size + set2.size);
}

export const detectDuplicateAnomalies = (
  project: ProjectEntity,
  allProjects: ProjectEntity[] = []
): AnomalyItem[] => {
  const anomalies: AnomalyItem[] = [];

  for (const other of allProjects) {
    if (other.id === project.id) continue;
    if (other.district_id !== project.district_id) continue;

    const titleSim = calculateStringSimilarity(project.title, other.title);
    const descSim = calculateStringSimilarity(project.description || '', other.description || '');
    const avgSim = (titleSim * 0.6) + (descSim * 0.4);

    if (avgSim > 0.75) {
      anomalies.push({
        id: `dup-sim-${project.id}-${other.id}`,
        project_id: project.id,
        rule_code: 'DUP-SIM-001',
        category: 'DUPLICATE',
        severity: 'HIGH',
        score_impact: 20,
        title: `High Semantic Similarity to Project #${other.project_code} (${Math.round(avgSim * 100)}% match)`,
        description: `Project title and scope mirror existing sanction "${other.title}" in the same district (${project.district_name}).`,
        evidence_summary: `Shared terms and identical cost profile indicate potential duplicate scheme submission.`,
        confidence_score: Number(avgSim.toFixed(2)),
        detected_at: new Date().toISOString(),
        is_resolved: false,
      });
      break;
    }
  }

  return anomalies;
};
