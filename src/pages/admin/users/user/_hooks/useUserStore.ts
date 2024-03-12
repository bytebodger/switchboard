import { create } from 'zustand';
import type { UserDemographicUI } from '../../../../../common/interfaces/userDemographic/UserDemographicUI';

interface State {
   // values
   firstName: string,
   isDisabled: boolean,
   lastName: string,
   userDemographics: UserDemographicUI[],
   // getters
   getFirstName: () => string,
   getIsDisabled: () => boolean,
   getLastName: () => string,
   getUserDemographics: () => UserDemographicUI[],
   // setters
   setFirstName: (firstName: string) => void,
   setIsDisabled: (isDisabled: boolean) => void,
   setLastName: (lastName: string) => void,
   setUserDemographics: (userDemographics: UserDemographicUI[]) => void,
}

export const useUserStore = create<State>()((set, get) => ({
   // values
   firstName: '',
   isDisabled: false,
   lastName: '',
   userDemographics: [],
   // getters
   getFirstName: () => get().firstName,
   getIsDisabled: () => get().isDisabled,
   getLastName: () => get().lastName,
   getUserDemographics: () => get().userDemographics,
   // setters
   setFirstName: firstName => set(() => ({ firstName })),
   setIsDisabled: isDisabled => set(() => ({ isDisabled })),
   setLastName: lastName => set(() => ({ lastName })),
   setUserDemographics: userDemographics => set(() => ({ userDemographics })),
}))