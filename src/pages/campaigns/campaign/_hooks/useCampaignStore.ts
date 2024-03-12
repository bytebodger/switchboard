import type { ReactNode } from 'react';
import { create } from 'zustand';
import { LocalItem } from '../../../../common/enums/LocalItem';
import { TabName } from '../../../../common/enums/TabName';
import type { UserUI } from '../../../../common/interfaces/user/UserUI';
import { local } from '../../../../common/libraries/local';

interface State {
   // values
   addButton: ReactNode,
   audienceSize: number | null,
   campaignId: number,
   description: string | null,
   isDisabled: boolean,
   name: string,
   ownedBy: number | null,
   recipientId: number,
   sendFrom: number | null,
   sendFromName: string,
   tab: TabName,
   tagName: string,
   // getters
   getAddButton: () => ReactNode,
   getAudienceSize: () => number | null,
   getCampaignId: () => number,
   getDescription: () => string | null,
   getIsDisabled: () => boolean,
   getName: () => string,
   getOwnedBy: () => number | null,
   getRecipientId: () => number,
   getSendFrom: () => number | null,
   getSendFromName: () => string,
   getTab: () => TabName,
   getTagName: () => string,
   // setters
   setAddButton: (addButton: ReactNode) => void,
   setAudienceSize: (audienceSize: number | null) => void,
   setCampaignId: (experimentId: number) => void,
   setDescription: (description: string | null) => void,
   setIsDisabled: (isDisabled: boolean) => void,
   setName: (name: string) => void,
   setOwnedBy: (ownedBy: number | null) => void,
   setRecipientId: (recipientId: number) => void,
   setSendFrom: (sendFrom: number | null) => void,
   setSendFromName: (sendFromName: string) => void,
   setTab: (tab: TabName) => void,
   setTagName: (tagName: string) => void,
   // actions
   resetForm: (user: UserUI | null) => void,
}

export const useCampaignStore = create<State>()((set, get) => ({
   // values
   addButton: null,
   audienceSize: 0,
   campaignId: 0,
   description: null,
   isDisabled: false,
   name: '',
   ownedBy: null,
   recipientId: 0,
   sendFrom: Number(process.env.REACT_APP_SEND_FROM),
   sendFromName: 'Lore Team',
   tab: local.getItem(LocalItem.campaignTab, TabName.detail),
   tagName: '',
   // getters
   getAddButton: () => get().addButton,
   getAudienceSize: () => get().audienceSize,
   getCampaignId: () => get().campaignId,
   getDescription: () => get().description,
   getIsDisabled: () => get().isDisabled,
   getName: () => get().name,
   getOwnedBy: () => get().ownedBy,
   getRecipientId: () => get().recipientId,
   getSendFrom: () => get().sendFrom,
   getSendFromName: () => get().sendFromName,
   getTab: () => get().tab,
   getTagName: () => get().tagName,
   // setters
   setAddButton: addButton => set(() => ({ addButton })),
   setAudienceSize: audienceSize => set(() => ({ audienceSize })),
   setCampaignId: campaignId => set(() => ({ campaignId })),
   setDescription: description => set(() => ({ description })),
   setIsDisabled: isDisabled => set(() => ({ isDisabled })),
   setName: name => set(() => ({ name })),
   setOwnedBy: ownedBy => set(() => ({ ownedBy })),
   setRecipientId: recipientId => set(() => ({ recipientId })),
   setSendFrom: sendFrom => set(() => ({ sendFrom })),
   setSendFromName: sendFromName => set(() => ({ sendFromName })),
   setTab: tab => {
      local.setItem(LocalItem.campaignTab, tab);
      set(() => ({ tab }));
   },
   setTagName: tagName => set(() => ({ tagName })),
   // actions
   resetForm: user => {
      set(() => ({ description: null }));
      set(() => ({ isDisabled: false }));
      set(() => ({ name: '' }));
      set(() => ({ ownedBy: user?.id }));
      set(() => ({ sendFrom: Number(process.env.REACT_APP_SEND_FROM) }));
      set(() => ({ sendFromName: 'Lore Team' }));
   },
}))