

export enum LoadingState {
  Idle = "IDLE",// Represents a state where no loading is happening
  Loading = "LOADING",// Represents a state where loading is in progress
  Success = "SUCCESS",// Represents a state where loading has finished successfully
  Error = "ERROR" // Represents a state where loading has failed
}

export enum ConnectionState {
  Idle = "IDLE",// Represents a state where no loading is happening
  Connecting = "CONNECTING",// Represents a state where loading is in progress
  Connected = "CONNECTED",// Represents a state where loading has finished successfully
  Error = "ERROR" // Represents a state where loading has failed
}
