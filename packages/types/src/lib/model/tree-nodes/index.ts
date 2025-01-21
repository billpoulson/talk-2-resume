export type AppTreeNodeTypes = {
  'folder': 'folder',
  'file': 'file',
}

export type AppTreeNodeData = {
  type: keyof AppTreeNodeTypes
  text: string
  _id: string
  parentKey?: string
}
