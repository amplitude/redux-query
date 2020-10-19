export type QueryState = {
    headers:
        | {
              [key: string]: any
          }
        | null
        | undefined
    isFinished: boolean
    isPending: boolean
    lastUpdated: number | null | undefined
    queryCount: number
    status: number | null | undefined
}

export type QueriesState = {
    isFinished: boolean
    isPending: boolean
}