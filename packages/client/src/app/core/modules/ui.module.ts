import { NgModule } from '@angular/core'
import { AllCommunityModule, ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community'
import { FileManagerModule } from '../../features/components/file-manager/file-manager.module'
import { SharedUIComponentsModule } from '../../features/components/shared/shared.ui.module'
import { TextChatModule } from '../../features/components/text-chat/text-chat.module'
import { VoiceChatModule } from '../../features/components/voice-chat/voice-chat.module'
import { GoBackDirective } from '../../features/directives/go-back.directive'
import { MaterialUIModule } from './material.ui.module'

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
])

const modules = [
  MaterialUIModule,
  SharedUIComponentsModule,
  VoiceChatModule,
  TextChatModule,
  FileManagerModule,
  GoBackDirective,
]

@NgModule({
  imports: modules,
  exports: modules,
})
export class UIModule { }

