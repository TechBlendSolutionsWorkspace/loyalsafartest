import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface Product3DGridProps {
  products: Product[];
  className?: string;
}

const Product3DCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Simple 3D jewelry representation
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });

    renderer.setSize(200, 200);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create jewelry geometry based on category
    let geometry: THREE.BufferGeometry;
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xFFD700,
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.5,
    });

    switch (product.category) {
      case 'ring':
        geometry = new THREE.TorusGeometry(0.8, 0.2, 8, 20);
        break;
      case 'necklace':
        geometry = new THREE.TorusGeometry(1.2, 0.1, 6, 20);
        break;
      case 'bracelet':
        geometry = new THREE.TorusGeometry(1.0, 0.15, 8, 18);
        break;
      default:
        geometry = new THREE.SphereGeometry(0.8, 16, 16);
    }

    const jewelry = new THREE.Mesh(geometry, material);
    scene.add(jewelry);

    // Add diamond accents
    const diamondGeometry = new THREE.OctahedronGeometry(0.1);
    const diamondMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 0.9,
      thickness: 0.5,
    });

    for (let i = 0; i < 5; i++) {
      const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
      const angle = (i / 5) * Math.PI * 2;
      diamond.position.x = Math.cos(angle) * 0.8;
      diamond.position.y = Math.sin(angle) * 0.8;
      diamond.position.z = Math.random() * 0.2 - 0.1;
      scene.add(diamond);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFD700, 1);
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);

    camera.position.z = 3;

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      jewelry.rotation.x += 0.01;
      jewelry.rotation.y += isHovered ? 0.02 : 0.005;
      
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      diamondGeometry.dispose();
      diamondMaterial.dispose();
    };
  }, [product.category, isHovered]);

  return (
    <Card 
      className={`group bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border-amber-500/20 hover:border-amber-400/60 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20 ${
        isHovered ? 'scale-105' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 overflow-hidden rounded-lg">
        {/* 3D Canvas */}
        <div className="relative h-64 flex items-center justify-center bg-gradient-to-br from-black/50 to-gray-900/50">
          <canvas ref={canvasRef} width={200} height={200} className="transition-transform duration-500" />
          
          {/* Hover Actions */}
          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center space-x-3 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black">
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
              {product.name}
            </h3>
            <p className="text-amber-400 font-semibold text-lg">{product.price}</p>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold">
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const Product3DGrid: React.FC<Product3DGridProps> = ({ products, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ${className}`}>
      {products.map((product, index) => (
        <Product3DCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};