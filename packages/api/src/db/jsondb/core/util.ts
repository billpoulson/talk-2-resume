import { JSONFilePreset } from 'lowdb/node'

export function getDbRef<TData>(pathParts: string[], data: TData) {
  return JSONFilePreset(pathParts.join('.'), data)
}