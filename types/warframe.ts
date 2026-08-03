export interface CetusCycle {
  id: string
  expiry: string
  activation: string
  isDay: boolean
  state: string
  timeLeft: string
  isCetus: boolean
}

export interface VallisCycle {
  id: string
  expiry: string
  isWarm: boolean
  state: string
  timeLeft: string
}

export interface CambionCycle {
  id: string
  expiry: string
  activation: string
  active: 'fass' | 'vome'
  timeLeft: string
}

export interface ZarimanCycle {
  id: string
  expiry: string
  activation: string
  state: 'corpus' | 'grineer'
  timeLeft: string
}

export interface DuviriCycle {
  id: string
  expiry: string
  activation: string
  state: 'sorrow' | 'fear' | 'joy' | 'anger' | 'envy'
  timeLeft: string
}

export interface Fissure {
  id: string
  activation: string
  expiry: string
  node: string
  missionType: string
  missionKey: string
  enemy: string
  enemyKey: string
  nodeKey: string
  tier: 'Lith' | 'Meso' | 'Neo' | 'Axi' | 'Requiem' | 'Omnia'
  tierNum: number
  expired: boolean
  eta: string
  isHard: boolean
  isStorm: boolean
}

export interface InvasionReward {
  itemString?: string
  asString?: string
  thumbnail?: string
  color?: number
  countedItems?: Array<{
    count: number
    type: string
    key?: string
  }>
  items?: Array<string | { itemString?: string; asString?: string; type?: string }>
}

export interface Invasion {
  id: string
  node: string
  nodeKey: string
  desc: string
  attacker?: InvasionReward
  defender?: InvasionReward
  attackerReward?: InvasionReward
  defenderReward?: InvasionReward
  attackingFaction: string
  defendingFaction: string
  completion: number
  completed: boolean
  eta: string
  vsInfestation: boolean
}

export interface Sortie {
  id: string
  activation: string
  expiry: string
  rewardPool: string
  variants: {
    node: string
    boss: string
    missionType: string
    modifier: string
    modifierDescription: string
  }[]
  boss: string
  faction: string
  eta: string
}

export interface ArchonHunt {
  id: string
  activation: string
  expiry: string
  boss: string
  faction: string
  missions: {
    node: string
    nodeKey: string
    type: string
    typeKey: string
  }[]
  eta: string
}

export interface DeepArchimedea {
  id: string
  activation: string
  expiry: string
  missions: {
    title: string
    modifiers: {
      name: string
      description: string
    }[]
  }[]
  personalVariables: {
    name: string
    description: string
  }[]
  eta: string
}

export interface BountyJob {
  id: string
  rewardPool: string[]
  type: string
  enemyLevels: number[]
  standingStages: number[]
  minMR: number
  title?: string
}

export interface SyndicateMission {
  id: string
  activation: string
  expiry: string
  syndicate: string
  nodes: string[]
  jobs: BountyJob[]
  eta: string
}

export interface BaroItem {
  item: string
  ducats: number
  credits: number
}

export interface VoidTrader {
  id: string
  activation: string
  expiry: string
  character: string
  location: string
  inventory: BaroItem[]
  active: boolean
  startString: string
  endString: string
}

export interface DailyDeal {
  id: string
  item: string
  expiry: string
  originalPrice: number
  salePrice: number
  total: number
  sold: number
  discount: number
  eta: string
}

export interface Arbitration {
  activation: string
  expiry: string
  node: string
  enemy: string
  type: string
  archwing: boolean
  sharkwing: boolean
}

export interface SteelPathIncursion {
  id: string
  node: string
  missionType?: string
  enemy?: string
  expiry?: string
  completed?: boolean
}

export interface SteelPathData {
  expiry?: string
  activation?: string
  incursions?: SteelPathIncursion[]
}

export interface NewsItem {
  id?: string
  message: string
  link: string
  date?: string
  eta?: string
  priority?: boolean
}

export interface AlertMission {
  node: string
  type: string
  faction: string
  minEnemyLevel: number
  maxEnemyLevel: number
  isSteelPath?: boolean
  description?: string
  reward?: {
    asString?: string
    itemString?: string
    items?: string[]
  }
}

export interface Alert {
  id: string
  activation: string
  expiry: string
  mission: AlertMission
  eta: string
  expired: boolean
}

export interface ConstructionProgress {
  id?: string
  fomorianProgress?: string
  razorbackProgress?: string
  unknownProgress?: string
}

export interface FlashSale {
  id?: string
  item?: string
  discount?: number
  regularOverride?: number
  premiumOverride?: number
  isFeatured?: boolean
  isPopular?: boolean
  isShownInMarket?: boolean
  expiry?: string
}

export interface WorldState {
  cetusCycle: CetusCycle
  vallisCycle: VallisCycle
  cambionCycle: CambionCycle
  zarimanCycle: ZarimanCycle
  duviriCycle: DuviriCycle
  fissures: Fissure[]
  invasions: Invasion[]
  sortie: Sortie
  archonHunt: ArchonHunt
  deepArchimedea?: DeepArchimedea
  syndicateMissions: SyndicateMission[]
  voidTrader?: VoidTrader
  dailyDeals?: DailyDeal[]
  arbitration?: Arbitration
  steelPath?: SteelPathData
  news?: NewsItem[]
  alerts?: Alert[]
  constructionProgress?: ConstructionProgress
  flashSales?: FlashSale[]
}

export interface ConclaveChallenge {
  id?: string
  title?: string
  description?: string
  standing?: number
  daily?: boolean
  mode?: string
  category?: string
  amount?: number
}

export interface WorldState {
  // ... existing fields ...
  conclaveChallenges?: ConclaveChallenge[]
  news?: NewsItem[]
}