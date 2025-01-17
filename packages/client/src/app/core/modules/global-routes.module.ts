import { ChannelListModalActivator } from '../../features/components/text-chat/channel-list.modal/channel-list.modal.component'

export default [
  {
    path: 'channel-list',
    component: ChannelListModalActivator,
    outlet: 'modal', // Auxiliary route for the modal
    resolve: {
      data: () => ({}),
      config: () => ({ 
        width: '800px'
       })
    },
  },
]