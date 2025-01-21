import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections'
import { FlatTreeControl } from '@angular/cdk/tree'
import { AppTreeNodeData } from '@talk2resume/types'
import { BehaviorSubject, map, merge, Observable } from 'rxjs'
import { UserFileService } from '../../../core/services/file-upload.service'
import { AppFlatTreeNode, isExpandableNodeType } from './DynamicFlatNode'



export class DynamicDataSource implements DataSource<AppFlatTreeNode> {
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
                childNode.type == 'folder'
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
      .filter((x) => x.parentKey === undefined)
      .map((name) =>
        new AppFlatTreeNode(name.type, name._id, name.parentKey!, name.text, 0, isExpandableNodeType(name.type))
      )
  }

}
