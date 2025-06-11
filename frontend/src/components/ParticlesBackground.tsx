import React, { useCallback, useContext } from 'react';
import Particles from 'react-tsparticles';
import type { Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';
import { ThemeContext } from '../ThemeContext';

export default function ParticlesBackground() {
  const { theme } = useContext(ThemeContext);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particleColor = theme === 'dark' ? '#ffffff' : '#000000';

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: { color: { value: 'transparent' } },
        particles: {
          number: { value: 40, density: { enable: true, value_area: 800 } },
          color: { value: particleColor },
          size: { value: 3 },
          links: { enable: true, color: particleColor, distance: 150 },
          move: { enable: true, speed: 1 },
        },
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
