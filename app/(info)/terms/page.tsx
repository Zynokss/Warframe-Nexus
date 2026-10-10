import type { Metadata } from 'next'
import Link from 'next/link'
import InfoPage from '@/components/InfoPage'
export const metadata: Metadata = { title: 'Terms of use — Warframe Nexus' }
export default function TermsPage(){return <InfoPage title="Terms of use" intro="A free, independent companion for exploring Warframe information.">
<section><h2>Information and accuracy</h2><p>Nexus provides game information and community utilities. Live feeds can be delayed, unavailable, or incomplete. Riven statistics describe aggregated historical trades, not current listings or guaranteed prices. Check important timings and rewards against the game.</p><p>Some utilities use limited or sample data, including the Hex screen, glyph list, palette matcher, and Riven tool. Their presence does not verify promotional-code validity or provide access to your game account.</p></section>
<section><h2>Using the site</h2><p>Do not interfere with the service, attempt unauthorized access, or overload its endpoints. You remain responsible for activity on your Warframe account. This site does not ask for your game password and cannot redeem codes, complete missions, or trade items for you.</p></section>
<section><h2>Local progress and external services</h2><p>Checklists are personal browser-local notes, not synchronized game progress. They may be lost when site data is cleared or storage is unavailable. External sites and services have their own terms and privacy practices.</p></section>
<section><h2>Ownership and project support</h2><p>Use of Nexus does not transfer rights in Warframe or third-party materials. See the <Link href="/legal">legal notice</Link> for attribution and the <Link href="/support">support page</Link> for the current donation status. No paid features or checkout are offered in this version.</p></section>
<section><h2>Changes and questions</h2><p>The site and these pages may change as providers and features are added. Nothing here is intended to remove rights that applicable law gives you. Questions can be directed through the <Link href="/contact">contact page</Link>.</p></section>
</InfoPage>}
