declare module 'react-confetti' {
  import type { ComponentType, CSSProperties } from 'react';

  export interface ConfettiProps {
    width?: number;
    height?: number;
    numberOfPieces?: number;
    recycle?: boolean;
    colors?: string[];
    style?: CSSProperties;
  }

  const Confetti: ComponentType<ConfettiProps>;
  export default Confetti;
}
