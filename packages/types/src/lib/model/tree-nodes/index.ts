export type AppTreeNodeTypes = {
  'folder': 'folder',
  'file': 'file',
}

export type AppTreeNodeData = {
  type: keyof AppTreeNodeTypes
  text: string
  _id: string
  parentKey?: string
  timestamp: number
}

import { signal } from '@angular/core'
export class AppFlatTreeNode {
  constructor(
    public type: keyof AppTreeNodeTypes,
    public _id: string,
    public parentKey: string,
    public text: string,
    public level = 0,
    public expandable = false,
    public isLoading = signal(false),
    public timestamp = -1
  ) { }
}



