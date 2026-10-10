import { Package, Clock, Coins, Tag } from 'lucide-react'
import { TelemetryEmpty } from '@/components/TelemetryPrimitives'

export interface ManifestDeal { id: string; item: string; price: number; currency: 'PLT' | 'CREDITS'; originalPrice?: number; discount: number; timer: string; popular?: boolean; stock?: { remaining: number; total: number; percent: number } }
export default function MarketManifest({ deals, featured = false, emptyMessage }: { deals: ManifestDeal[]; featured?: boolean; emptyMessage: string }) {
  return <div className={`intel-view market-manifest ${featured ? 'market-featured' : ''}`}><div className="intel-scroll custom-scrollbar">{!deals.length ? <TelemetryEmpty message={emptyMessage} /> : deals.map(deal => <article key={deal.id} className="market-offer">
    <div className="market-offer-heading"><span className="market-item-emblem"><Package size={featured ? 28 : 21} aria-hidden="true" /></span><div><span className="intel-kicker">{featured ? 'Darvo’s featured item' : deal.popular ? 'Featured offer' : 'Market offer'}</span><h4>{deal.item}</h4></div>{deal.discount > 0 && <span className="market-discount"><Tag size={10} />−{deal.discount}%</span>}</div>
    <div className="market-price-row"><strong>{deal.currency === 'CREDITS' && <Coins size={15} />}{deal.price.toLocaleString()}<small>{deal.currency}</small></strong>{deal.originalPrice !== undefined && deal.originalPrice !== deal.price && <del>{deal.originalPrice.toLocaleString()} PLT</del>}<span><Clock size={10} />{deal.timer}</span></div>
    {deal.stock && <div className="market-stock"><div><span>Available stock</span><strong>{deal.stock.remaining} / {deal.stock.total}</strong></div><div className="market-stock-bar" role="progressbar" aria-label="Remaining stock" aria-valuemin={0} aria-valuemax={deal.stock.total} aria-valuenow={deal.stock.remaining}><span style={{ width: `${deal.stock.percent}%` }} /></div><p>{deal.stock.percent}% remaining</p></div>}
  </article>)}</div></div>
}
