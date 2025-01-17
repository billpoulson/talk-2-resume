export class UserInfoObject {
  constructor(
    public sub: string,
    public given_name: string,
    public family_name: string,
    public nickname: string,
    public name: string,
    public picture: string,
    public updated_at: string,
    public email: string,
    public email_verified: boolean
  ) {
  }
}


export interface LoadDefinitionData {
  inProgress: boolean
  percentageCompleted: number
  isCompleted: boolean
  key: string
  mass: number
  cargoValue: number,
  payout: number,
  distance: number,
  progress: number,
  pirated: boolean,
}

export function createLoadDefinitionData(
): LoadDefinitionData {

  return {
    key: '-1',
    cargoValue: 100,
    distance: 1000,
    mass: 10000,
    payout: 1000,
    inProgress: false,
    progress: 0,
    pirated: false,
    isCompleted: false,
    percentageCompleted: 0
  }
}


export type AccelerationMap = Array<{ time: number, speed: number | null }>
export type ShipStatsData = {
  shipType: string,
  maxSpeed: number,
  accelerationData: AccelerationMap,
}
export class ShipStats implements ShipStatsData {
  shipType: any
  maxSpeed: number
  accelerationData: AccelerationMap

  constructor(
    { shipType, maxSpeed, accelerationData }: ShipStatsData
  ) {
    this.shipType = shipType
    this.maxSpeed = maxSpeed
    this.accelerationData = accelerationData
  }
}

