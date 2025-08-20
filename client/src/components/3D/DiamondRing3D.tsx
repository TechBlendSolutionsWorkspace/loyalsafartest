import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

interface DiamondRing3DProps {
  className?: string;
  autoRotate?: boolean;
  interactive?: boolean;
}

export const DiamondRing3D: React.FC<DiamondRing3DProps> = ({ 
  className = '', 
  autoRotate = true, 
  interactive = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    ring: THREE.Group;
    diamond: THREE.Mesh;
    band: THREE.Mesh;
    mouseX: number;
    mouseY: number;
    isMouseDown: boolean;
    animationId: number | null;
  } | null>(null);

  const createDiamondGeometry = useCallback(() => {
    const geometry = new THREE.ConeGeometry(0.3, 0.8, 8);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 0.9,
      thickness: 0.5,
      envMapIntensity: 2,
      clearcoat: 1,
      clearcoatRoughness: 0,
      ior: 2.4,
    });
    return new THREE.Mesh(geometry, material);
  }, []);

  const createRingBand = useCallback(() => {
    const outerRadius = 1;
    const innerRadius = 0.85;
    const height = 0.15;
    
    const shape = new THREE.Shape();
    shape.moveTo(outerRadius, 0);
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    
    const hole = new THREE.Shape();
    hole.moveTo(innerRadius, 0);
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
    });
    
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xFFD700,
      metalness: 1,
      roughness: 0.1,
      envMapIntensity: 1.5,
    });
    
    return new THREE.Mesh(geometry, material);
  }, []);

  const initScene = useCallback(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });

    renderer.setSize(400, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    // Camera position
    camera.position.set(0, 0, 3);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFD700, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xFFFFFF, 0.8, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xFFD700, 0.6, 10);
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);

    // Create ring group
    const ring = new THREE.Group();
    
    // Create diamond
    const diamond = createDiamondGeometry();
    diamond.position.set(0, 0.6, 0);
    diamond.castShadow = true;
    ring.add(diamond);

    // Create band
    const band = createRingBand();
    band.rotation.x = Math.PI / 2;
    band.castShadow = true;
    band.receiveShadow = true;
    ring.add(band);

    scene.add(ring);

    // Environment map for reflections
    const loader = new THREE.CubeTextureLoader();
    const envMap = loader.load([
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRkZENzAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4K',
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRkZENzAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4K',
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRkZENzAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4K',
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRkZENzAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4K',
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRkZENzAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4K',
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRkZENzAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4K',
    ]);
    scene.environment = envMap;

    sceneRef.current = {
      scene,
      camera,
      renderer,
      ring,
      diamond,
      band,
      mouseX: 0,
      mouseY: 0,
      isMouseDown: false,
      animationId: null,
    };

    return sceneRef.current;
  }, [createDiamondGeometry, createRingBand]);

  const animate = useCallback(() => {
    if (!sceneRef.current) return;

    const { scene, camera, renderer, ring, diamond } = sceneRef.current;

    // Auto rotation
    if (autoRotate && !sceneRef.current.isMouseDown) {
      ring.rotation.y += 0.005;
      ring.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
    }

    // Diamond sparkle effect
    diamond.rotation.y += 0.02;
    
    // Render
    renderer.render(scene, camera);
    sceneRef.current.animationId = requestAnimationFrame(animate);
  }, [autoRotate]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!sceneRef.current || !interactive) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (sceneRef.current.isMouseDown) {
      const deltaX = x - sceneRef.current.mouseX;
      const deltaY = y - sceneRef.current.mouseY;
      
      sceneRef.current.ring.rotation.y += deltaX * 2;
      sceneRef.current.ring.rotation.x += deltaY * 2;
    }

    sceneRef.current.mouseX = x;
    sceneRef.current.mouseY = y;
  }, [interactive]);

  const handleMouseDown = useCallback(() => {
    if (sceneRef.current && interactive) {
      sceneRef.current.isMouseDown = true;
    }
  }, [interactive]);

  const handleMouseUp = useCallback(() => {
    if (sceneRef.current) {
      sceneRef.current.isMouseDown = false;
    }
  }, []);

  useEffect(() => {
    const sceneData = initScene();
    if (sceneData) {
      animate();

      if (interactive) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
      }
    }

    return () => {
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (interactive) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
      }
      if (sceneRef.current?.renderer) {
        sceneRef.current.renderer.dispose();
      }
    };
  }, [initScene, animate, handleMouseMove, handleMouseDown, handleMouseUp, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`${className} cursor-grab active:cursor-grabbing`}
      width={400}
      height={400}
    />
  );
};