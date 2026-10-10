import { ArrowUpRight, Clock, Radio } from 'lucide-react'
import { TelemetryEmpty } from '@/components/TelemetryPrimitives'

export default function DispatchFeed({ items }: { items: { id: string; title: string; link: string; time: string; image?: string }[] }) {
  return <div className="intel-view dispatch-feed">{!items.length ? <TelemetryEmpty message="No broadcasts received from Lotus Command." /> : <div className="intel-scroll custom-scrollbar">{items.map((item, index) => <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className={`dispatch-entry ${index === 0 ? 'dispatch-featured' : ''}`}>
    {index === 0 && item.image && <div className="dispatch-art" style={{ backgroundImage: `linear-gradient(0deg, #0c1511, #0c151130), url(${JSON.stringify(item.image)})` }} aria-hidden="true" />}
    <div className="dispatch-entry-meta"><span><Radio size={10} />{index === 0 ? 'Latest transmission' : `Transmission 0${index + 1}`}</span><span><Clock size={10} />{item.time}</span></div><h4>{item.title}</h4><span className="dispatch-open">Read transmission <ArrowUpRight size={13} /></span>
  </a>)}</div>}</div>
}
