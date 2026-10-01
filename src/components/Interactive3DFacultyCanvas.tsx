import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCw, Eye, Maximize2, Minimize2, Cpu, Zap, Activity } from 'lucide-react';

interface Interactive3DFacultyCanvasProps {
  className?: string;
  variant?: 'banner' | 'standalone' | 'compact';
}

export const Interactive3DFacultyCanvas: React.FC<Interactive3DFacultyCanvasProps> = ({
  className = '',
  variant = 'banner'
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [active3DMode, setActive3DMode] = useState<'hologram' | 'matrix' | 'wave'>('hologram');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [telemetryStats, setTelemetryStats] = useState({
    activeNodes: 148,
    fps: 60,
    syncRate: '99.4%',
    rotationX: 0,
    rotationY: 0
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 260;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background

    // Clean container before appending
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Group for objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Core 3D Hologram (Icosahedron & Core Sphere)
    const icoGeometry = new THREE.IcosahedronGeometry(2, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
    mainGroup.add(icoMesh);

    // Inner Glowing Core
    const innerGeometry = new THREE.OctahedronGeometry(1.1, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x6366f1, // Indigo
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    mainGroup.add(innerMesh);

    // Center point
    const corePointGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const corePointMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: false
    });
    const corePoint = new THREE.Mesh(corePointGeo, corePointMat);
    mainGroup.add(corePoint);

    // 2. Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(2.7, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.5 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(3.1, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.45 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    // 3. Orbiting Data Satellites (Nodes representing Labs, Timetable, Attendance)
    const satellites: THREE.Mesh[] = [];
    const satCount = 3;
    const satColors = [0x10b981, 0x06b6d4, 0xf59e0b];
    for (let i = 0; i < satCount; i++) {
      const satGeo = new THREE.SphereGeometry(0.16, 12, 12);
      const satMat = new THREE.MeshBasicMaterial({ color: satColors[i] });
      const sat = new THREE.Mesh(satGeo, satMat);
      mainGroup.add(sat);
      satellites.push(sat);
    }

    // 4. Background Particle Constellation
    const particleCount = 180;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;

      originalPositions[i] = particlePositions[i];
      originalPositions[i + 1] = particlePositions[i + 1];
      originalPositions[i + 2] = particlePositions[i + 2];
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.8
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Interaction State
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.006;
      targetRotationX += deltaY * 0.006;

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domElem.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      frameCount++;
      const now = performance.now();
      if (now - lastFpsUpdate >= 1000) {
        setTelemetryStats(prev => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / (now - lastFpsUpdate)),
          rotationX: Math.round((mainGroup.rotation.x * 180) / Math.PI) % 360,
          rotationY: Math.round((mainGroup.rotation.y * 180) / Math.PI) % 360
        }));
        frameCount = 0;
        lastFpsUpdate = now;
      }

      // Smooth inertia rotation
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.08;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.08;

      // Auto rotation if enabled
      if (isRotating && !isDragging) {
        targetRotationY += 0.006 * rotationSpeed;
        targetRotationX += 0.002 * rotationSpeed;
      }

      // Internal sub-element animations
      innerMesh.rotation.x -= 0.012;
      innerMesh.rotation.y -= 0.015;
      ring1.rotation.z += 0.008;
      ring2.rotation.z -= 0.006;

      // Orbiting satellites calculation
      satellites.forEach((sat, idx) => {
        const angle = elapsedTime * (0.8 + idx * 0.4) + (idx * Math.PI * 2) / satCount;
        const radius = 2.6 + (idx % 2) * 0.4;
        sat.position.x = Math.cos(angle) * radius;
        sat.position.z = Math.sin(angle) * radius;
        sat.position.y = Math.sin(angle * 2) * 0.6;
      });

      // Particle animations based on active mode
      const positions = particlesGeo.attributes.position.array as Float32Array;
      if (active3DMode === 'wave') {
        for (let i = 0; i < particleCount * 3; i += 3) {
          const x = originalPositions[i];
          const z = originalPositions[i + 2];
          positions[i + 1] = Math.sin(elapsedTime * 2 + x * 0.8 + z * 0.8) * 0.8;
        }
        particlesGeo.attributes.position.needsUpdate = true;
      } else if (active3DMode === 'matrix') {
        particleSystem.rotation.y = elapsedTime * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      domElem.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);

      domElem.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      // Dispose three.js resources
      icoGeometry.dispose();
      icoMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      corePointGeo.dispose();
      corePointMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, [active3DMode, isRotating, rotationSpeed]);

  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#070c18] via-[#091124] to-[#040812] border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.12)] transition-all ${
        isExpanded ? 'h-[460px] sm:h-[520px]' : variant === 'compact' ? 'h-[220px]' : 'h-[280px] sm:h-[340px]'
      } ${className}`}
    >
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing z-0" />

      {/* Top 3D Control Bar & Telemetry HUD */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Status Badge */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/40 text-xs text-white shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono font-bold text-cyan-300">3D FACULTY HOLOGRAM</span>
          <span className="hidden sm:inline text-slate-500 font-mono">|</span>
          <span className="hidden sm:inline font-mono text-[10px] text-slate-400">
            {telemetryStats.fps} FPS · Active Nodes: {telemetryStats.activeNodes}
          </span>
        </div>

        {/* Right Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-indigo-950 p-1 rounded-2xl shadow-lg">
          
          {/* Mode Switcher */}
          <button
            onClick={() => setActive3DMode(prev => prev === 'hologram' ? 'matrix' : prev === 'matrix' ? 'wave' : 'hologram')}
            className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1 border border-cyan-500/30 transition-all"
            title="Toggle 3D View Mode"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="capitalize hidden md:inline">{active3DMode}</span>
          </button>

          {/* Rotation Toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-xl text-xs transition-all ${
              isRotating
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isRotating ? 'Pause 3D Spin' : 'Resume 3D Spin'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </button>

          {/* Expand / Minimize */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
            title={isExpanded ? 'Collapse 3D Window' : 'Expand 3D Window'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Floating 3D Telemetry Overlay on Bottom */}
      <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none flex flex-wrap items-end justify-between gap-3">
        
        {/* Interactive Instruction Hint */}
        <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Drag or swipe to rotate 3D model in real time</span>
        </div>

        {/* Live Academic Telemetry */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-indigo-900/60 text-[11px] text-slate-300 font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Sync: {telemetryStats.syncRate}</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">RotX: {telemetryStats.rotationX}°</span>
          <span className="text-slate-600">|</span>
          <span className="text-indigo-400">RotY: {telemetryStats.rotationY}°</span>
        </div>
      </div>
    </div>
  );
};
