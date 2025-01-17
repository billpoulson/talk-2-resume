import { Location } from '@angular/common'; // Ensure correct import
import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { createComponentBem } from '../../../../core/util/bem'
import { ModalActivator } from '../../modal/modal-activator.component'


@Component({
  selector: 'app-channel-list.modal',
  standalone: false,
  templateUrl: './channel-list.modal.component.html',
  styleUrl: './channel-list.modal.component.scss'
})
export class ChannelListModalComponent {
  bem = createComponentBem('app-channel-list-modal')
  mockChannels = [{
    l1: "Test",
    l2: 'Test2'
  }, {
    l1: "Test1",
    l2: 'Test3'
  }, {
    l1: "Test2",
    l2: 'Test4'
  }]
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ChannelListModalComponent>
  ) {
  }
}

@Component({
  selector: 'app-channel-list-modal-activator',
  standalone: false,
  template: '',
  styles: ''
})
export class ChannelListModalActivator
  extends ModalActivator<{}>
 {
  constructor(location: Location, router: Router, route: ActivatedRoute, dialog: MatDialog) {
    super(location, router, route, dialog)
  }

  override activate() {
    this.launchDialog(ChannelListModalComponent)
  }
}
