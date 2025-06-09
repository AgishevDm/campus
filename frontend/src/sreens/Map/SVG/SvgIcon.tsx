import React from 'react';
import { IconType } from 'react-icons';

interface SvgIconProps {
  x: number;
  y: number;
  size?: number;
  Icon: IconType;
}

const SvgIcon: React.FC<SvgIconProps> = ({ x, y, size = 30, Icon }) => (
  <foreignObject x={x} y={y} width={size} height={size} style={{ pointerEvents: 'none' }}>
    <Icon style={{ width: '100%', height: '100%' }} />
  </foreignObject>
);

export default SvgIcon;
