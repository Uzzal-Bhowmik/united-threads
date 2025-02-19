export type TStateProps<setType> = {
   state: boolean;
    setState: (collapsed: setType) => void;
  };