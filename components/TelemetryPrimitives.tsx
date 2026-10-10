import { Radio } from 'lucide-react'

export function TelemetryEmpty({ message }: { message: string }) {
  return <div className="intel-empty"><Radio size={20} aria-hidden="true" /><strong>No active signal</strong><p>{message}</p></div>
}

export function ReportSummary({ label, title, detail, value }: { label: string; title: string; detail?: string; value?: string }) {
  return <div className="intel-summary"><div><span className="intel-kicker">{label}</span><h3>{title}</h3>{detail && <p>{detail}</p>}</div>{value && <span className="intel-summary-value">{value}</span>}</div>
}
