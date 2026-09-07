import { AnomalyItem, ProjectEntity } from '../../types';

export const detectTimelineAnomalies = (project: ProjectEntity): AnomalyItem[] => {
  const anomalies: AnomalyItem[] = [];

  const sanctionDate = new Date(project.sanction_date);
  const startDate = project.start_date ? new Date(project.start_date) : null;
  const actualCompletionDate = project.actual_completion_date
    ? new Date(project.actual_completion_date)
    : null;
  const expectedCompletionDate = project.expected_completion_date
    ? new Date(project.expected_completion_date)
    : null;

  // 1. TIME-SEQ-001: Completion or Start Before Sanction
  if (actualCompletionDate && actualCompletionDate < sanctionDate) {
    anomalies.push({
      id: `time-seq-${project.id}`,
      project_id: project.id,
      rule_code: 'TIME-SEQ-001',
      category: 'TIMELINE',
      severity: 'CRITICAL',
      score_impact: 28,
      title: 'Impossible Timeline Sequence: Completion Predates Work Sanction',
      description: `Completion certificate dated ${project.actual_completion_date} precedes administrative sanction order date of ${project.sanction_date}.`,
      evidence_summary: 'Milestone log chronology physically impossible without pre-existing or backdated construction.',
      confidence_score: 0.98,
      detected_at: new Date().toISOString(),
      is_resolved: false,
    });
  }

  if (startDate && startDate < sanctionDate) {
    anomalies.push({
      id: `time-start-${project.id}`,
      project_id: project.id,
      rule_code: 'TIME-SEQ-001',
      category: 'TIMELINE',
      severity: 'HIGH',
      score_impact: 18,
      title: 'Work Commencement Precedes Sanction Authorization',
      description: `Ground physical start date (${project.start_date}) predates sanction order (${project.sanction_date}).`,
      evidence_summary: 'Tender release and sanction protocol bypassed.',
      confidence_score: 0.95,
      detected_at: new Date().toISOString(),
      is_resolved: false,
    });
  }

  // 2. TIME-DELAY-002: Excessive Execution Stagnation
  if (
    expectedCompletionDate &&
    new Date() > expectedCompletionDate &&
    project.status !== 'COMPLETED'
  ) {
    const daysOverdue = Math.floor(
      (new Date().getTime() - expectedCompletionDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysOverdue > 180) {
      anomalies.push({
        id: `time-delay-${project.id}`,
        project_id: project.id,
        rule_code: 'TIME-DELAY-002',
        category: 'TIMELINE',
        severity: daysOverdue > 365 ? 'HIGH' : 'MEDIUM',
        score_impact: daysOverdue > 365 ? 16 : 10,
        title: `Project Overdue by ${daysOverdue} Days Beyond Sanctioned Deadline`,
        description: `Scheduled deadline was ${project.expected_completion_date}. No revised milestone sanction uploaded.`,
        evidence_summary: `Execution stalled in ${project.status} state with ₹${project.released_amount.toLocaleString('en-IN')} held.`,
        confidence_score: 0.89,
        detected_at: new Date().toISOString(),
        is_resolved: false,
      });
    }
  }

  return anomalies;
};
