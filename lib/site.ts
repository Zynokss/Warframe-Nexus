// Public operator details: configure only confirmed information.
export const site = {
  name: 'Warframe Nexus',
  creator: 'Zynoks',
  origin: 'https://www.warframenexus.com',
  operator: process.env.NEXT_PUBLIC_SITE_OPERATOR || 'Ashraf',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'zynoksy@gmail.com',
  updated: '10 October 2026',
}
