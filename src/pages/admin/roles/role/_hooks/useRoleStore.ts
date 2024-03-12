import { create } from 'zustand';

interface State {
   // values
   description: string,
   isDisabled: boolean,
   name: string,
   // getters
   getDescription: () => string,
   getIsDisabled: () => boolean,
   getName: () => string,
   // setters
   setDescription: (description: string) => void,
   setIsDisabled: (isDisabled: boolean) => void,
   setName: (name: string) => void,
}

export const useRoleStore = create<State>()((set, get) => ({
   // values
   description: '',
   isDisabled: false,
   name: '',
   // getters
   getDescription: () => get().description,
   getIsDisabled: () => get().isDisabled,
   getName: () => get().name,
   // setters
   setDescription: description => set(() => ({ description })),
   setIsDisabled: isDisabled => set(() => ({ isDisabled })),
   setName: name => set(() => ({ name })),
}))