import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections'
import { FlatTreeControl } from '@angular/cdk/tree'
import { signal } from '@angular/core'
import { AppFlatTreeNode, AppTreeNodeData, AppTreeNodeTypes } from '@talk2resume/types'
import { BehaviorSubject, map, merge, Observable } from 'rxjs'
import { UserFileService } from '../../../../core/services/file-upload.service'


export const isExpandableNodeType = (type: keyof AppTreeNodeTypes) => {
  switch (type) {
    case 'folder': return true
    default:
      return false
  }
}


export class UserFileManagerDatasource implements DataSource<AppFlatTreeNode> {

  dataChange$ = new BehaviorSubject<AppFlatTreeNode[]>([]);
  db: AppTreeNodeData[] = []

  get data(): AppFlatTreeNode[] {
    return this.dataChange$.value
  }

  set data(value: AppFlatTreeNode[]) {
    this._treeControl.dataNodes = value
    this.dataChange$.next(value)
  }

  constructor(
    private _treeControl: FlatTreeControl<AppFlatTreeNode>,
    private userFilesService: UserFileService,
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<AppFlatTreeNode[]> {
    this._treeControl.expansionModel.changed
      .subscribe(change => {
        if ((change as SelectionChange<AppFlatTreeNode>).added ||
          (change as SelectionChange<AppFlatTreeNode>).removed) {
          this.handleTreeControl(change as SelectionChange<AppFlatTreeNode>)
        }
      })

    return merge(collectionViewer.viewChange, this.dataChange$)
      .pipe(map(() => this.data))
  }

  disconnect(
    collectionViewer: CollectionViewer
  ): void { }

  handleTreeControl(
    change: SelectionChange<AppFlatTreeNode>
  ) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true))
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach(node => this.toggleNode(node, false))
    }
  }

  toggleNode(
    node: AppFlatTreeNode,
    expand: boolean
  ) {

    this.userFilesService
      .listFiles(node._id)
      .subscribe(children => {
        const index = this.data.indexOf(node)
        if (!children || index < 0) {
          // If no children, or cannot find the node, no op
          return
        }

        if (expand) {
          node.isLoading.set(true)
          const nodes = children.map(
            childNode => {
              return new AppFlatTreeNode(
                childNode.type,
                childNode._id,
                childNode.parentKey!,
                childNode.text,
                node.level + 1,
                childNode.type == 'folder',
                signal(false),
                childNode.timestamp
              )
            }
          )
          this.data.splice(index + 1, 0, ...nodes)
        } else {
          let count = 0
          for (let i = index + 1; i < this.data.length && this.data[i].level > node.level; i++, count++) { }
          this.data.splice(index + 1, count)
        }

        // notify the change
        this.dataChange$.next(this.data)
        node.isLoading.set(false)

      })

  }

  initializeData(data: AppTreeNodeData[]) {
    this.db = Array.from(data)
    this.data = this.db
      .filter((x) => !x.parentKey)
      .map((name) => new AppFlatTreeNode(name.type, name._id, name.parentKey!, name.text, 0, isExpandableNodeType(name.type), signal(false),
        name.timestamp))


  }

  reloadRoot() {
    this.userFilesService.listFiles()
      .subscribe(files => {
        this.initializeData(files as any)
      })
  }


  refreshNode(selectedFolder: string | undefined): void {
    console.trace(`Refreshing Node Data ${selectedFolder}`)
    console.debug(`Refreshing Node Data ${selectedFolder}`)

    if (selectedFolder === undefined) {
      this.reloadRoot()
      return
    }

    const selectedNode = this.data.find(node => node._id === selectedFolder)
    if (!selectedNode) {
      throw new Error('Selected folder not found')
    }

    let wasExpanded = this._treeControl.isExpanded(selectedNode)
    if (wasExpanded) {
      this._treeControl.collapse(selectedNode)
    }

    this.userFilesService
      .listFiles(selectedNode._id)
      .subscribe(children => {
        let count = 0
        const index = this.data.indexOf(selectedNode)
        this.data.splice(index + 1, count)

        if (!children || index < 0) {
          return
        }

        this.data.splice(index + 1, count)

        // Add updated children
        children.map(childNode =>
          new AppFlatTreeNode(
            childNode.type,
            childNode._id,
            childNode.parentKey!,
            childNode.text,
            selectedNode.level + 1,
            childNode.type == 'folder',
            signal(false),
            childNode.timestamp
          ))

        // Notify the change
        this.dataChange$.next(this.data)

        this._treeControl.expand(selectedNode)
      })
  }

}

