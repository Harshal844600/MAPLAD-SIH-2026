import { AnomalyItem, ProjectEntity, TransactionRecord } from '../../types';

export const detectFinancialAnomalies = (
  project: ProjectEntity,
  transactions: TransactionRecord[] = [],
  benchmarkCostPerUnit?: number
): AnomalyItem[] => {
  const anomalies: AnomalyItem[] = [];

  // 1. FIN-COST-001: Excessive Cost Deviation
  const benchmark = benchmarkCostPerUnit || 2500000; // fallback standard estimate
  if (project.sanctioned_amount > benchmark * 1.4) {
    const deviationPercent = Math.round(
      ((project.sanctioned_amount - benchmark) / benchmark) * 100
    );
    anomalies.push({
      id: `fin-cost-${project.id}`,
      project_id: project.id,
      rule_code: 'FIN-COST-001',
      category: 'FINANCIAL',
      severity: deviationPercent > 80 ? 'CRITICAL' : 'HIGH',
      score_impact: deviationPercent > 80 ? 25 : 18,
      title: `Sanctioned Cost ${deviationPercent}% Above Schedule of Rates Benchmark`,
      description: `Project sanctioned amount (₹${project.sanctioned_amount.toLocaleString('en-IN')}) significantly deviates from standard reference rate (₹${benchmark.toLocaleString('en-IN')}) for ${project.category_name}.`,
      evidence_summary: `Cost delta: +₹${(project.sanctioned_amount - benchmark).toLocaleString('en-IN')} without site topographical justification in file.`,
      confidence_score: 0.94,
      detected_at: new Date().toISOString(),
      is_resolved: false,
    });
  }

  // 2. FIN-DUP-002: Duplicate Payment Invoices / References
  const invoiceMap = new Map<string, TransactionRecord>();
  for (const txn of transactions) {
    if (txn.invoice_number) {
      if (invoiceMap.has(txn.invoice_number)) {
        const prev = invoiceMap.get(txn.invoice_number)!;
        anomalies.push({
          id: `fin-dup-${txn.id}`,
          project_id: project.id,
          rule_code: 'FIN-DUP-002',
          category: 'FINANCIAL',
          severity: 'CRITICAL',
          score_impact: 30,
          title: `Duplicate Invoice Reference Detected (#${txn.invoice_number})`,
          description: `Transaction ${txn.transaction_reference} (₹${txn.amount.toLocaleString('en-IN')}) shares duplicate invoice number with previous payment on ${prev.payment_date}.`,
          evidence_summary: `Dual disbursement recorded for same milestone bill to vendor "${txn.vendor_name}".`,
          confidence_score: 0.99,
          detected_at: new Date().toISOString(),
          is_resolved: false,
        });
      } else {
        invoiceMap.set(txn.invoice_number, txn);
      }
    }
  }

  // 3. FIN-UTIL-003: High Utilization With Incomplete Status
  if (project.sanctioned_amount > 0) {
    const utilRatio = project.utilized_amount / project.sanctioned_amount;
    if (utilRatio > 0.95 && (project.status === 'SANCTIONED' || project.status === 'STALLED')) {
      anomalies.push({
        id: `fin-util-${project.id}`,
        project_id: project.id,
        rule_code: 'FIN-UTIL-003',
        category: 'FINANCIAL',
        severity: 'HIGH',
        score_impact: 20,
        title: `Abnormal 100% Fund Drawdown for Stalled/Early Phase Work`,
        description: `₹${project.utilized_amount.toLocaleString('en-IN')} of ₹${project.sanctioned_amount.toLocaleString('en-IN')} has been disbursed while project progress status remains ${project.status}.`,
        evidence_summary: 'Disbursement pace outpaces physical milestone verification reports.',
        confidence_score: 0.91,
        detected_at: new Date().toISOString(),
        is_resolved: false,
      });
    }
  }

  return anomalies;
};
