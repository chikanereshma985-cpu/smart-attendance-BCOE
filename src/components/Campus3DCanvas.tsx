import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Campus3DCanvasProps {
  height?: number | string;
  interactive?: boolean;
}

export const Campus3DCanvas: React.FC<Campus3DCanvasProps> = ({
  height = 280,
  interactive = true
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    const width = container.clientWidth || 300;
    const h = typeof height === 'number' ? height : container.clientHeight || 280;

    const camera = new THREE.PerspectiveCamera(45, width / h, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. 3D Elements
    // Central Hologram Core (Academic Knowledge Crystal)
    const coreGeometry = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
      emissive: 0x083344
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Inner Solid Glowing Sphere
    const innerGeometry = new THREE.SphereGeometry(0.85, 24, 24);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // Orbiting Rings
    const ring1Geo = new THREE.TorusGeometry(2.5, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(3.1, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.4 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 5;
    scene.add(ring2);

    // 4 Orbiting Academic Satellite Nodes
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    const satGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const satColors = [0x10b981, 0x06b6d4, 0xf59e0b, 0xa855f7];
    const satellites: THREE.Mesh[] = [];

    for (let i = 0; i < 4; i++) {
      const satMat = new THREE.MeshBasicMaterial({ color: satColors[i] });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      const angle = (i * Math.PI) / 2;
      satMesh.position.set(Math.cos(angle) * 2.5, Math.sin(angle) * 1.2, Math.sin(angle) * 2.2);
      satelliteGroup.add(satMesh);
      satellites.push(satMesh);
    }

    // Ambient floating starfield / data particles
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.7
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 2, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x6366f1, 2, 20);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Mouse Tracking for Interactive 3D Parallax Tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouseX = (x / rect.width) * 2 - 1;
      mouseY = -(y / rect.height) * 2 + 1;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();
        mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      }
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchmove', handleTouchMove);
    }

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = typeof height === 'number' ? height : container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation towards mouse
      targetX = targetX + (mouseX * 0.8 - targetX) * 0.05;
      targetY = targetY + (mouseY * 0.5 - targetY) * 0.05;

      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(scene.position);

      // Core rotation
      coreMesh.rotation.x = elapsedTime * 0.25;
      coreMesh.rotation.y = elapsedTime * 0.35;

      innerMesh.rotation.y = -elapsedTime * 0.4;
      innerMesh.rotation.z = elapsedTime * 0.2;

      // Rings rotation
      ring1.rotation.z = elapsedTime * 0.3;
      ring2.rotation.z = -elapsedTime * 0.25;

      // Orbit satellite group
      satelliteGroup.rotation.y = elapsedTime * 0.5;
      satelliteGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;

      // Gentle wave for starfield
      particleSystem.rotation.y = -elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchmove', handleTouchMove);
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      satGeo.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [height, interactive]);

  return (
    <div
      ref={mountRef}
      className="w-full relative flex items-center justify-center overflow-hidden rounded-3xl cursor-grab active:cursor-grabbing"
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    />
  );
};
