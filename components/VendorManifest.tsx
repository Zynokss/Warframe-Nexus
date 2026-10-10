import { MapPin, Package, Clock, ShieldCheck } from 'lucide-react'
import { TelemetryEmpty, ReportSummary } from '@/components/TelemetryPrimitives'

export default function VendorManifest({ mode, active, location, timer, inventory = [], validArbitration, arbitration }: {
  mode: 'BARO' | 'ARBITRATION'; active: boolean; location?: string; timer: string;
  inventory?: { item?: string; ducats?: number; credits?: number }[];
  validArbitration: boolean; arbitration?: { node?: string; type?: string; enemy?: string }
}) {
  if (mode === 'ARBITRATION') return <div className="intel-view vendor-manifest"><ReportSummary label="Arbiters of Hexis" title="Arbitration" value={timer} />
    {validArbitration ? <div className="arbitration-report"><ShieldCheck size={32} aria-hidden="true" /><div><span className="intel-kicker">{arbitration?.enemy || 'Unknown faction'}</span><h4>{arbitration?.type || 'Arbitration Sector'}</h4><p className="intel-location"><MapPin size={11} />{arbitration?.node}</p></div></div> : <TelemetryEmpty message="Arbitration node details are awaiting telemetry." />}
  </div>
  return <div className="intel-view vendor-manifest">
    <div className="vendor-arrival"><svg className="vendor-portrait" viewBox="0 0 100 140" fill="none" aria-hidden="true"><path d="M50 10l15 12-2 27-13 13-13-13-2-27ZM35 22h30M39 34l11 6 11-6M50 40v16M37 54 20 71l-10 56h80L80 71 63 54M20 71l30 20 30-20M50 91v36M34 70l16 12 16-12M10 127h80" /><path d="M50 3v7M50 127v10M2 70h8M90 70h8" /></svg><span className="intel-kicker">VOID TRADER</span><h3>Baro Ki’Teer</h3><span className="vendor-status" data-active={active}>{active ? 'At the relay' : 'In transit'}</span><p className="intel-location"><MapPin size={12} />{location || 'Location unavailable'}</p><div className="vendor-timer"><Clock size={12} /><span>{active ? 'Departs in' : 'Arrives in'}</span><strong>{timer}</strong></div></div>
    {active && inventory.length ? <div className="intel-scroll custom-scrollbar"><div className="intel-list-caption">Available manifest<span>{inventory.length} items</span></div>{inventory.map((item, index) => <article key={index} className="vendor-item"><Package size={17} aria-hidden="true" /><div><h4>{item.item || 'Void Wares'}</h4><p>{item.ducats ? <span>{item.ducats} ducats</span> : null}{item.credits ? <span>{item.credits.toLocaleString()} credits</span> : null}</p></div></article>)}</div> : <TelemetryEmpty message={active ? 'No inventory details received.' : 'The manifest becomes available when Baro arrives.'} />}
  </div>
}
