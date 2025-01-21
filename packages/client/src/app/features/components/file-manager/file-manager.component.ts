import { FlatTreeControl } from '@angular/cdk/tree'
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core'

import { concatMap } from 'rxjs'
import { FileUploadService, UserFileService } from '../../../core/services/file-upload.service'
import { FilesSelectedEventData } from '../modal/upload-files.modal/upload-files.modal.component'
import { DynamicDataSource } from './DynamicDataSource'
import { AppFlatTreeNode, isExpandableNodeType } from './DynamicFlatNode'

export type AddFileToFolderEventData = {
  addToFolder: string
} & FilesSelectedEventData

@Component({
  selector: 'app-file-manager',
  templateUrl: 'file-manager.component.html',
  styleUrl: 'file-manager.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerComponent implements OnInit {
  selectedNode: string = ''
  fileSelectionCompleted(
    event: FilesSelectedEventData
  ) {
    const result = {
      addToFolder: this.selectedNode,
      ...event
    }
    this.addFile.emit(result)
  }
  @Output() addFile = new EventEmitter<AddFileToFolderEventData>()

  constructor(
    private uploadService: FileUploadService,
    private useFileService: UserFileService,
  ) {
    this.treeControl = new FlatTreeControl<AppFlatTreeNode>(this.getLevel, this.isExpandable)
    this.dataSource = new DynamicDataSource(this.treeControl, useFileService)

    // save files after modal fiile select
    this.addFile.asObservable()
      .pipe(concatMap(event => this.uploadService.uploadFiles(event.selected, '/api/uploads/upload')))
      .subscribe()

    this.useFileService.listFiles()
      .subscribe(files => {
        this.dataSource.initializeData(files as any)
      })

  }


  ngOnInit(): void {

  }

  treeControl: FlatTreeControl<AppFlatTreeNode>

  dataSource: DynamicDataSource

  getLevel = (node: AppFlatTreeNode) => { return node.type === 'folder' ? node.level : node.level + 1 };

  isExpandable = (node: AppFlatTreeNode) => isExpandableNodeType(node.type);

  hasChild = (_: number, _nodeData: AppFlatTreeNode) => _nodeData.expandable;
  selectNode(node: AppFlatTreeNode) { this.selectedNode = node.key }



}
