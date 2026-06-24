import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ChartDataPoint {
  label: string;
  value: number; // 0 - 100
  color: string;
}

interface ThreeChartProps {
  data: ChartDataPoint[];
}

export const ThreeChart: React.FC<ThreeChartProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 250;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Orthographic-like angle for isometric 3D chart projection
    camera.position.set(5, 6, 8);
    camera.lookAt(0, 1.2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(4, 8, 4);
    scene.add(dirLight);

    // Faint Grid Floor
    const gridHelper = new THREE.GridHelper(8, 8, 0x00f0ff, 0x071e3d);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Create Bars
    const barWidth = 0.5;
    const spacing = 1.0;
    const bars: THREE.Mesh[] = [];
    const targetHeights = data.map(d => (d.value / 100) * 3); // max height of 3 units

    const startX = -((data.length - 1) * spacing) / 2;

    data.forEach((item, index) => {
      // Geometry (initially flat, height 0.01)
      const geo = new THREE.BoxGeometry(barWidth, 0.01, barWidth);
      
      // Cyber Neon Material
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(item.color),
        roughness: 0.2,
        metalness: 0.8,
        emissive: new THREE.Color(item.color),
        emissiveIntensity: 0.3,
      });

      const bar = new THREE.Mesh(geo, mat);
      
      // Position bar along X axis
      bar.position.set(startX + index * spacing, 0.005, 0);
      scene.add(bar);
      bars.push(bar);

      // Add a small glowing floating cap above each bar
      const capGeo = new THREE.BoxGeometry(barWidth * 1.1, 0.05, barWidth * 1.1);
      const capMat = new THREE.MeshBasicMaterial({ color: item.color, transparent: true, opacity: 0.9 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(startX + index * spacing, 0.1, 0);
      scene.add(cap);

      // Link cap to bar to animate together
      bar.userData = { cap, targetHeight: targetHeights[index] };
    });

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      
      // Slow tilt orbit
      scene.rotation.y = Math.sin(elapsedTime * 0.15) * 0.2;

      // Animate Bar growth
      bars.forEach(bar => {
        const target = bar.userData.targetHeight;
        const currentHeight = bar.scale.y;
        
        if (currentHeight < target) {
          // Grow smoothly
          const nextHeight = currentHeight + (target - currentHeight) * 0.08;
          bar.scale.y = nextHeight;
          // Re-adjust position so the base rests on the grid (y=0)
          bar.position.y = nextHeight / 2;
          
          // Position cap above the bar
          if (bar.userData.cap) {
            bar.userData.cap.position.y = nextHeight + 0.05;
          }
        } else {
          // Hover pulse once grown
          const pulse = Math.sin(elapsedTime * 3 + bar.position.x) * 0.03;
          if (bar.userData.cap) {
            bar.userData.cap.position.y = target + 0.05 + pulse;
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      bars.forEach(b => {
        b.geometry.dispose();
        if (Array.isArray(b.material)) {
          b.material.forEach(m => m.dispose());
        } else {
          b.material.dispose();
        }
        if (b.userData.cap) {
          b.userData.cap.geometry.dispose();
          b.userData.cap.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [data]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '220px' }} />
      {/* Dynamic Overlay Labels */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '0',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        pointerEvents: 'none',
        fontFamily: 'var(--font-display)',
        fontSize: '10px',
        color: 'var(--text-secondary)'
      }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: item.color, fontWeight: 'bold' }}>{item.value}%</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
