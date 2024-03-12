import dayjs from 'dayjs';
import type { ReactNode } from 'react';
import { create } from 'zustand';
import { Format } from '../../../../common/enums/Format';
import { LocalItem } from '../../../../common/enums/LocalItem';
import { TabName } from '../../../../common/enums/TabName';
import type { UserUI } from '../../../../common/interfaces/user/UserUI';
import { local } from '../../../../common/libraries/local';

interface State {
   // values
   addButton: ReactNode,
   audienceSize: number | null,
   description: string | null,
   endOn: string | null,
   experimentId: number,
   hypothesis: string,
   isDisabled: boolean,
   name: string,
   ownedBy: number | null,
   recipientId: number,
   sendFrom: number | null,
   sendFromName: string,
   successMetric: string | null,
   tab: TabName,
   tagName: string,
   // getters
   getAddButton: () => ReactNode,
   getAudienceSize: () => number | null,
   getDescription: () => string | null,
   getEndOn: () => string | null,
   getExperimentId: () => number,
   getHypothesis: () => string,
   getIsDisabled: () => boolean,
   getName: () => string,
   getOwnedBy: () => number | null,
   getRecipientId: () => number,
   getSendFrom: () => number | null,
   getSendFromName: () => string,
   getSuccessMetric: () => string | null,
   getTab: () => TabName,
   getTagName: () => string,
   // setters
   setAddButton: (addButton: ReactNode) => void,
   setAudienceSize: (audienceSize: number | null) => void,
   setDescription: (description: string | null) => void,
   setEndOn: (endOn: string | null) => void,
   setExperimentId: (experimentId: number) => void,
   setHypothesis: (hypothesis: string) => void,
   setIsDisabled: (isDisabled: boolean) => void,
   setName: (name: string) => void,
   setOwnedBy: (ownedBy: number | null) => void,
   setRecipientId: (recipientId: number) => void,
   setSendFrom: (sendFrom: number | null) => void,
   setSendFromName: (sendFromName: string) => void,
   setSuccessMetric: (successMetric: string | null) => void,
   setTab: (tab: TabName) => void,
   setTagName: (tagName: string) => void,
   // actions
   resetForm: (user: UserUI | null) => void,
}

export const useExperimentStore = create<State>()((set, get) => ({
   // values
   addButton: null,
   audienceSize: 0,
   description: null,
   endOn: null,
   experimentId: 0,
   hypothesis: '',
   isDisabled: false,
   name: '',
   ownedBy: null,
   recipientId: 0,
   sendFrom: Number(process.env.REACT_APP_SEND_FROM),
   sendFromName: 'Lore Team',
   successMetric: null,
   tab: local.getItem(LocalItem.experimentTab, TabName.detail),
   tagName: '',
   // getters
   getAddButton: () => get().addButton,
   getAudienceSize: () => get().audienceSize,
   getDescription: () => get().description,
   getEndOn: () => get().endOn,
   getExperimentId: () => get().experimentId,
   getHypothesis: () => get().hypothesis,
   getIsDisabled: () => get().isDisabled,
   getName: () => get().name,
   getOwnedBy: () => get().ownedBy,
   getRecipientId: () => get().recipientId,
   getSendFrom: () => get().sendFrom,
   getSendFromName: () => get().sendFromName,
   getSuccessMetric: () => get().successMetric,
   getTab: () => get().tab,
   getTagName: () => get().tagName,
   // setters
   setAddButton: addButton => set(() => ({ addButton })),
   setAudienceSize: audienceSize => set(() => ({ audienceSize })),
   setDescription: description => set(() => ({ description })),
   setEndOn: endOn => set(() => ({ endOn })),
   setExperimentId: experimentId => set(() => ({ experimentId })),
   setHypothesis: hypothesis => set(() => ({ hypothesis })),
   setIsDisabled: isDisabled => set(() => ({ isDisabled })),
   setName: name => set(() => ({ name })),
   setOwnedBy: ownedBy => set(() => ({ ownedBy })),
   setRecipientId: recipientId => set(() => ({ recipientId })),
   setSendFrom: sendFrom => set(() => ({ sendFrom })),
   setSendFromName: sendFromName => set(() => ({ sendFromName })),
   setSuccessMetric: successMetric => set(() => ({ successMetric })),
   setTab: tab => {
      local.setItem(LocalItem.experimentTab, tab);
      set(() => ({ tab }));
   },
   setTagName: tagName => set(() => ({ tagName })),
   // actions
   resetForm: user => {
      set(() => ({ description: null }));
      set(() => ({ endOn: dayjs().utc().add(14, 'day').format(Format.date) }));
      set(() => ({ isDisabled: false }));
      set(() => ({ name: '' }));
      set(() => ({ ownedBy: user?.id }));
      set(() => ({ sendFrom: Number(process.env.REACT_APP_SEND_FROM) }));
      set(() => ({ sendFromName: 'Lore Team' }));
      set(() => ({ successMetric: null }));
   },
}))