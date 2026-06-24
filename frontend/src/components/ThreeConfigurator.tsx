import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeConfiguratorProps {
  productId: string;
  materialType: string;
  color: string;
  engravedText: string;
  autoRotate: boolean;
}

export const ThreeConfigurator: React.FC<ThreeConfiguratorProps> = ({
  productId,
  materialType,
  color,
  engravedText,
  autoRotate,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const textTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const textCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const materialRef = useRef<THREE.Material | null>(null);

  // Helper to draw text texture
  const updateTextCanvas = (text: string, tintColor: string, materialName: string) => {
    const canvas = textCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 512;
    // Base texture color based on material
    let bgStyle = '#05070f';
    if (materialName === 'obsidian') bgStyle = '#0d0d13';
    if (materialName === 'matte-gold') bgStyle = '#2a220a';
    if (materialName === 'hologram') bgStyle = '#0c1a30';

    ctx.fillStyle = bgStyle;
    ctx.fillRect(0, 0, size, size);

    // Draw tech grid on texture
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < size; i += 32) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke();
    }

    // Border glowing line
    ctx.strokeStyle = tintColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, size - 40, size - 40);

    // Subtle corner brackets
    ctx.fillStyle = tintColor;
    const bracketSize = 30;
    // TL
    ctx.fillRect(20, 20, bracketSize, 6);
    ctx.fillRect(20, 20, 6, bracketSize);
    // TR
    ctx.fillRect(size - 20 - bracketSize, 20, bracketSize, 6);
    ctx.fillRect(size - 20, 20, 6, bracketSize);
    // BL
    ctx.fillRect(20, size - 20 - 6, bracketSize, 6);
    ctx.fillRect(20, size - 20 - bracketSize, 6, bracketSize);
    // BR
    ctx.fillRect(size - 20 - bracketSize, size - 20 - 6, bracketSize, 6);
    ctx.fillRect(size - 20, size - 20 - bracketSize, 6, bracketSize);

    // Label text
    ctx.font = 'bold 20px Orbitron';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.textAlign = 'center';
    ctx.fillText('SPHEREMEDIA LABS', size / 2, 80);

    // Custom client text
    ctx.font = 'bold 36px Orbitron';
    ctx.fillStyle = tintColor;
    ctx.shadowColor = tintColor;
    ctx.shadowBlur = 12;
    ctx.fillText(text.toUpperCase() || 'CLIENT CORE', size / 2, size / 2 + 10);
    ctx.shadowBlur = 0; // reset

    // Status label
    ctx.font = '16px Orbitron';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillText(`SYS_ACTIVE_MOD: ${materialName.toUpperCase()}`, size / 2, size - 80);

    if (textTextureRef.current) {
      textTextureRef.current.needsUpdate = true;
    }
  };

  // Re-draw text canvas when text, color or material changes
  useEffect(() => {
    updateTextCanvas(engravedText, color, materialType);
  }, [engravedText, color, materialType]);

  // Handle Material Properties updates dynamically
  useEffect(() => {
    if (!materialRef.current) return;
    const mat = materialRef.current;
    
    // Dispose previous materials if we want, but since they are StandardMaterials we just mutate parameters
    const standardMat = mat as THREE.MeshStandardMaterial;
    
    const baseColor = new THREE.Color(color);

    if (materialType === 'neon') {
      standardMat.roughness = 0.2;
      standardMat.metalness = 0.1;
      standardMat.emissive = baseColor;
      standardMat.emissiveIntensity = 0.55;
      standardMat.color = new THREE.Color('#111111');
      standardMat.transparent = false;
      standardMat.opacity = 1;
    } else if (materialType === 'matte-gold') {
      standardMat.roughness = 0.3;
      standardMat.metalness = 0.95;
      standardMat.color = new THREE.Color('#d4af37'); // Classic gold
      standardMat.emissive = new THREE.Color('#3a2c00');
      standardMat.emissiveIntensity = 0.1;
      standardMat.transparent = false;
      standardMat.opacity = 1;
    } else if (materialType === 'obsidian') {
      standardMat.roughness = 0.05;
      standardMat.metalness = 0.9;
      standardMat.color = new THREE.Color('#0d0e14'); // Charcoal dark
      standardMat.emissive = new THREE.Color('#000000');
      standardMat.emissiveIntensity = 0;
      standardMat.transparent = false;
      standardMat.opacity = 1;
    } else if (materialType === 'hologram') {
      standardMat.roughness = 0.1;
      standardMat.metalness = 0.2;
      standardMat.color = baseColor;
      standardMat.emissive = baseColor;
      standardMat.emissiveIntensity = 0.8;
      standardMat.transparent = true;
      standardMat.opacity = 0.45;
    }
    
    standardMat.needsUpdate = true;
  }, [materialType, color]);

  // Create geometry dynamically when product changes
  useEffect(() => {
    if (!meshGroupRef.current) return;
    const group = meshGroupRef.current;

    // Clear old children
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    }

    const mat = materialRef.current;
    if (!mat) return;

    // Build shape based on Product ID
    if (productId === 'prod-1') {
      // Interactive Hologlobe: Sphere mesh surrounded by a technological cage
      const sphereGeo = new THREE.SphereGeometry(2.2, 32, 32);
      const innerMesh = new THREE.Mesh(sphereGeo, mat);
      group.add(innerMesh);

      // Outer rings/cage
      const ringGeo1 = new THREE.TorusGeometry(3.0, 0.06, 8, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: color, wireframe: false });
      const ring1 = new THREE.Mesh(ringGeo1, ringMat);
      ring1.rotation.x = Math.PI / 2;
      group.add(ring1);

      const ringGeo2 = new THREE.TorusGeometry(2.7, 0.04, 8, 48);
      const ring2 = new THREE.Mesh(ringGeo2, ringMat);
      ring2.rotation.y = Math.PI / 4;
      group.add(ring2);

      // Add a particle core inside the globe
      const pGeometry = new THREE.BufferGeometry();
      const pCount = 200;
      const pPositions = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const dist = Math.random() * 2.0;
        pPositions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
        pPositions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
        pPositions[i * 3 + 2] = dist * Math.cos(phi);
      }
      pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
      const pMat = new THREE.PointsMaterial({ color: color, size: 0.1, transparent: true, opacity: 0.8 });
      const pCore = new THREE.Points(pGeometry, pMat);
      group.add(pCore);

    } else if (productId === 'prod-2') {
      // Brand Box: Chamfered cube with text texture on the front
      const boxGeo = new THREE.BoxGeometry(3.6, 3.6, 3.6);
      
      // Materials array (6 faces)
      // We map the canvas texture only to the front face (face index 4 or custom order)
      const textTexture = textTextureRef.current;
      const faceMaterials = [];
      for (let i = 0; i < 6; i++) {
        if (i === 4) { // Front face
          faceMaterials.push(new THREE.MeshStandardMaterial({
            map: textTexture,
            roughness: 0.1,
            metalness: 0.6,
          }));
        } else {
          faceMaterials.push(mat);
        }
      }
      
      const boxMesh = new THREE.Mesh(boxGeo, faceMaterials);
      group.add(boxMesh);

    } else if (productId === 'prod-3') {
      // Quantum SEO: Tetrahedral core with orbit rings
      const coneGeo = new THREE.ConeGeometry(2.3, 3.5, 4);
      const pyramid = new THREE.Mesh(coneGeo, mat);
      pyramid.rotation.x = Math.PI / 6;
      group.add(pyramid);

      // Faint helper lines
      const wireframe = new THREE.WireframeGeometry(coneGeo);
      const line = new THREE.LineSegments(wireframe);
      const lineMat = line.material as THREE.LineBasicMaterial;
      lineMat.color.set(color);
      lineMat.transparent = true;
      lineMat.opacity = 0.5;
      pyramid.add(line);

    } else if (productId === 'prod-4') {
      // Campaign Prism: 4-sided double pyramid / octahedron
      const octaGeo = new THREE.OctahedronGeometry(2.6);
      const octaMesh = new THREE.Mesh(octaGeo, mat);
      group.add(octaMesh);

      // Add horizontal glowing rings
      const torusGeo = new THREE.TorusGeometry(3.2, 0.05, 8, 32);
      const torusMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(torusGeo, torusMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

    } else {
      // General package: Intersecting rings
      const torusGeo = new THREE.TorusGeometry(2.2, 0.4, 16, 64);
      const mainMesh = new THREE.Mesh(torusGeo, mat);
      group.add(mainMesh);
    }
  }, [productId, color]);

  // Primary Canvas Mounting Loop
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 500;
    const height = mountRef.current.clientHeight || 450;

    // Canvas texture creation
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 512;
    textCanvas.height = 512;
    textCanvasRef.current = textCanvas;
    
    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTextureRef.current = textTexture;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(color, 0.7);
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);

    // Default Material
    const standardMat = new THREE.MeshStandardMaterial({
      roughness: 0.2,
      metalness: 0.8,
      color: new THREE.Color('#3b82f6'),
    });
    materialRef.current = standardMat;

    // Create central mesh group
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    meshGroupRef.current = meshGroup;

    // Seed the initial geometry
    updateTextCanvas(engravedText, color, materialType);
    
    // Mouse interaction controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = () => { isDragging = true; };
    const handleMouseUp = () => { isDragging = false; };
    const handleMouseMove = (e: MouseEvent) => {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y,
      };

      if (isDragging) {
        meshGroup.rotation.y += deltaMove.x * 0.007;
        meshGroup.rotation.x += deltaMove.y * 0.007;
      }

      previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY,
      };
    };

    const domElement = renderer.domElement;
    domElement.style.cursor = 'grab';
    domElement.addEventListener('mousedown', handleMouseDown);
    domElement.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate light to make highlights dynamic
      const time = clock.getElapsedTime();
      dirLight1.position.x = 5 * Math.sin(time * 0.5);
      dirLight1.position.z = 5 * Math.cos(time * 0.5);

      // Optional auto rotation
      if (autoRotate && !isDragging) {
        meshGroup.rotation.y += 0.005;
        // Float effect
        meshGroup.position.y = Math.sin(time * 1.5) * 0.15;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', handleMouseDown);
      domElement.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);

      if (mountRef.current && domElement) {
        mountRef.current.removeChild(domElement);
      }

      scene.remove(meshGroup);
      standardMat.dispose();
      textTexture.dispose();
      renderer.dispose();
    };
  }, [productId]); // Rebuild context only if product changes (switches active shape)

  return (
    <div ref={mountRef} className="configurator-view" style={{ minHeight: '400px', width: '100%', height: '100%' }} />
  );
};
