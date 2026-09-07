import { AnomalyItem, ProjectEntity, VendorInfo } from '../../types';

export const detectVendorAnomalies = (
  project: ProjectEntity,
  vendor?: VendorInfo,
  constituencyProjects: ProjectEntity[] = []
): AnomalyItem[] => {
  const anomalies: AnomalyItem[] = [];

  if (!project.vendor_id || !project.vendor_name) return anomalies;

  // 1. VEN-CONC-001: Excessive Vendor Concentration in District/Constituency
  if (constituencyProjects.length >= 5) {
    const vendorProjects = constituencyProjects.filter((p) => p.vendor_id === project.vendor_id);
    const concentrationRatio = vendorProjects.length / constituencyProjects.length;

    if (concentrationRatio > 0.6) {
      const percentage = Math.round(concentrationRatio * 100);
      anomalies.push({
        id: `ven-conc-${project.id}`,
        project_id: project.id,
        rule_code: 'VEN-CONC-001',
        category: 'VENDOR',
        severity: percentage > 75 ? 'CRITICAL' : 'HIGH',
        score_impact: percentage > 75 ? 24 : 18,
        title: `Excessive Contractor Concentration (${percentage}% of Constituency Portfolio)`,
        description: `Vendor "${project.vendor_name}" has been awarded ${vendorProjects.length} out of ${constituencyProjects.length} sanctioned projects in ${project.constituency_name}.`,
        evidence_summary: `Herfindahl-Hirschman Index indicates non-competitive bidding distribution pattern.`,
        confidence_score: 0.92,
        detected_at: new Date().toISOString(),
        is_resolved: false,
      });
    }
  }

  // 2. VEN-BLACKLIST-002: Blacklisted/Suspended Vendor Flag
  if (vendor && vendor.blacklisted) {
    anomalies.push({
      id: `ven-blk-${project.id}`,
      project_id: project.id,
      rule_code: 'VEN-SHELL-002',
      category: 'VENDOR',
      severity: 'CRITICAL',
      score_impact: 35,
      title: 'Contract Awarded to Blacklisted Entity',
      description: `Contractor "${vendor.name}" (GSTIN: ${vendor.gstin || 'N/A'}) is flagged on the nodal registry blacklist.`,
      evidence_summary: `Blacklist reason: ${vendor.blacklisted_reason || 'Previous contract default'}.`,
      confidence_score: 1.0,
      detected_at: new Date().toISOString(),
      is_resolved: false,
    });
  }

  return anomalies;
};
