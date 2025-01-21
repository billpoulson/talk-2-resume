import { signal } from '@angular/core'
import { AppTreeNodeTypes } from '@talk2resume/types'

export class AppFlatTreeNode {
  constructor(
    public type: keyof AppTreeNodeTypes,
    public key: string,
    public parentKey: string,
    public text: string,
    public level = 0,
    public expandable = false,
    public isLoading = signal(false),
  ) { }
}


// export const dataMap = new Map<string, AppTreeNodeData>([
//   ['1', {
//     key: '1',
//     text: newUUID(),
//     type: 'folder',
//   }],
//   ['2', {
//     key: '2',
//     text: newUUID(),
//     type: 'folder',
//   }],
//   ['3', {
//     key: '3',
//     parentKey: '1',
//     text: newUUID(),
//     type: 'file',
//   }],
//   ['4', {
//     key: '4',
//     parentKey: '2',
//     text: newUUID(),
//     type: 'folder',
//   }],
//   ['5', {
//     key: '5',
//     parentKey: '4',
//     text: newUUID(),
//     type: 'file',
//   }],
//   ['6', {
//     key: '6',
//     parentKey: '4',
//     text: newUUID(),
//     type: 'file',
//   }],
// ])


export const isExpandableNodeType = (type: keyof AppTreeNodeTypes) => {
  switch (type) {
    case 'folder': return true
    default:
      return false
  }
}

