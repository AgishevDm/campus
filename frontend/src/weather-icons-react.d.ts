declare module 'weather-icons-react' {
  import * as React from 'react';
  export interface IconProps {
    color?: string;
    size?: string | number;
    className?: string;
  }
  export const WiDaySunny: React.ComponentType<IconProps>;
  export const WiCloudy: React.ComponentType<IconProps>;
  export const WiRain: React.ComponentType<IconProps>;
  export const WiSnow: React.ComponentType<IconProps>;
}
