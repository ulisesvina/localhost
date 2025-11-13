"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage } from "@react-three/drei";
import { CanvasTexture } from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function LaptopModel() {
  const [scene, setScene] = useState<any | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textureRef = useRef<CanvasTexture | null>(null);

  const images = [
    "/api/image-proxy?url=https%3A%2F%2Fstatic.ulisesv.com%2Fimgs%2Fceluzen.png",
    "/api/image-proxy?url=https%3A%2F%2Fstatic.ulisesv.com%2Fimgs%2Fprotego247.png",
    "/api/image-proxy?url=https%3A%2F%2Fstatic.ulisesv.com%2Fimgs%2Fchilangohacks.png",
    "/api/image-proxy?url=https%3A%2F%2Fstatic.ulisesv.com%2Fimgs%2Fshelly.png",
  ];

  useEffect(() => {
    const loader = new GLTFLoader();
    const url = `${window.location.origin}/models/imac.glb`;

    loader.load(
      url,
      (gltf: any) => {
        const cloned = gltf.scene.clone(true);
        setScene(cloned);
        console.log("✅ GLTF loaded:", url);
      },
      undefined,
      (err: any) => {
        console.error("Failed to load GLTF:", err);
      }
    );
  }, []);

  useEffect(() => {
    if (!scene) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1024;
    canvas.height = 1024;

    const texture = new CanvasTexture(canvas);
    textureRef.current = texture;

    const screenMesh = scene.getObjectByName("Screen_Screen_0");

    if (screenMesh && "material" in screenMesh) {
      screenMesh.material = screenMesh.material.clone();
      screenMesh.material.map = texture;
      screenMesh.material.needsUpdate = true;
      console.log("✅ Screen mesh found:", screenMesh.name);
    } else {
      console.warn("⚠️ Screen mesh not found!");
    }

    let currentIndex = 0;
    let img = new Image();
    img.crossOrigin = "anonymous"; // important for cross-domain images

    const drawImage = () => {
      img.src = images[currentIndex];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        texture.needsUpdate = true;
      };
      currentIndex = (currentIndex + 1) % images.length;
    };

    drawImage();
    const interval = setInterval(drawImage, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [scene]);

  if (!scene) return <canvas ref={canvasRef} style={{ display: "none" }} />;

  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 2], fov: 35 }}>
        <Stage environment="city" intensity={0.9}>
          <group scale={[6, 6, 6]} rotation={[0, -1.7, 0]} position={[0, -0.3, 0]}>
            <primitive object={scene} />
          </group>
        </Stage>
      </Canvas>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
}