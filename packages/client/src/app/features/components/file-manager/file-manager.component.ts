import { FlatTreeControl } from '@angular/cdk/tree'
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'

import { notifyWith } from '@talk2resume/common'
import { AppFlatTreeNode, AppTreeNodeData } from '@talk2resume/types'
import { concatMap, Subject, tap } from 'rxjs'
import { FileUploadService, UserFileService } from '../../../core/services/file-upload.service'
import { AppSingleTextInputEventData, SingleTextInputModalActivator } from '../modal/single-text-input.modal/single-text-input.modal.component'
import { FilesSelectedEventData, UploadFilesModalComponentActivator } from '../modal/upload-files.modal/upload-files.modal.component'
import { FileNodeSelectedEventData, SelectFileNodeModalComponentActivator } from './components/select-file-node.modal/select-file-node.modal.component'
import { isExpandableNodeType, UserFileManagerDatasource } from './services/user-file-manager-datasource'


@Component({
  selector: 'app-file-manager',
  templateUrl: 'file-manager.component.html',
  styleUrl: 'file-manager.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerComponent implements OnInit {


  @ViewChild(UploadFilesModalComponentActivator) uploadModal!: UploadFilesModalComponentActivator
  @ViewChild(SingleTextInputModalActivator) createFolderModal!: SingleTextInputModalActivator
  @ViewChild(SelectFileNodeModalComponentActivator) selectFileNodeModal!: SelectFileNodeModalComponentActivator

  @Output() fileAdded = new EventEmitter<FilesSelectedEventData>()
  @Output() nodeSelected = new EventEmitter<AppTreeNodeData>()
  selectedNodeId: string = '';
  @Input() selectedNode: AppFlatTreeNode | undefined
  @Output() selectedNodeChange = new EventEmitter<AppFlatTreeNode>();
  nodesChange = new Subject<void>()

  constructor(
    private uploadService: FileUploadService,
    private useFileService: UserFileService,
  ) {
    this.nodesChange.subscribe(x => { })

    this.treeControl = new FlatTreeControl<AppFlatTreeNode>(this.getLevel, this.isExpandable)
    this.dataSource = new UserFileManagerDatasource(this.treeControl, useFileService)

    // save files after modal fiile select
    this.fileAdded
      .asObservable()
      .pipe(
        concatMap(event =>
          this.uploadService.uploadFiles(event.selected, `/api/uploads/upload/${event.selectedFolder ?? ''}`)
            .pipe(
              tap(x => {
                this.dataSource.refreshNode(event.selectedFolder)
              })
            )
        ),
      )
      .subscribe()

    this.useFileService
      .listFiles()
      .subscribe(files => {
        this.dataSource.initializeData(files)
      })
  }

  moveNode(node: AppFlatTreeNode) {
    this.selectFileNodeModal
      .activate({
        nodeToMove: node._id,
        sourceFolder: node.parentKey
      })
  }

  handleFileMove(event: FileNodeSelectedEventData) {
    this.useFileService.moveNode({
      node: event.nodeToMove,
      source: event.sourceFolder,
      destination: event.newFolder,
    })
      .subscribe(_ => {
        const refreshRoot = [!!event.sourceFolder, !!event.newFolder].indexOf(false) > -1
        if (event.sourceFolder) { this.dataSource.refreshNode(event.sourceFolder) }
        if (event.newFolder) { this.dataSource.refreshNode(event.newFolder) }
        if (refreshRoot) { this.dataSource.reloadRoot() }
      })
  }

  deleteNode(node: AppFlatTreeNode) {
    this.useFileService
      .deleteFileOrFolder(node._id)
      .pipe(notifyWith(this.nodesChange))
      .subscribe(_ => {
        this.dataSource.refreshNode(node.parentKey)
      })
  }

  folderNameProvided(
    $event: AppSingleTextInputEventData
  ) {
    const inFolder = $event.meta?.folder
    this.useFileService
      .createFolder($event.text, inFolder)
      .subscribe(_ => {
        this.dataSource.refreshNode(inFolder)
      })
  }

  async fileSelectionCompleted(
    event: FilesSelectedEventData
  ) {
    this.fileAdded.emit(event)
  }


  uploadToFolder(selectedFolder?: string) { this.uploadModal.uploadToFolder(selectedFolder) }
  createFolder(folder?: string) { this.createFolderModal.activateWithMetaData({ folder }) }

  ngOnInit(): void { }

  treeControl: FlatTreeControl<AppFlatTreeNode>

  dataSource: UserFileManagerDatasource

  getLevel = (node: AppFlatTreeNode) => { return node.type === 'folder' ? node.level : node.level + 1 };

  isExpandable = (node: AppFlatTreeNode) => isExpandableNodeType(node.type);

  hasChild = (_: number, _nodeData: AppFlatTreeNode) => _nodeData.expandable;
  selectNode(node: AppFlatTreeNode) {
    this.selectedNodeId = node._id
    this.selectedNode = node
    this.selectedNodeChange.emit(node)
  }

}
