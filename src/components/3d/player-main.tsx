"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@/hooks/use-three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Player() {
  const containerRef = useRef<HTMLDivElement>(null);
  // const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  // const sceneRef = useRef<THREE.Scene | null>(null);
  // const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  // const controlsRef = useRef<OrbitControls | null>(null);

  const { scene, camera, renderer, controls } = useThree(containerRef);
  const animate = () => {
    requestAnimationFrame(animate);
    controls?.update(); // Cập nhật controls
    renderer?.render(scene!, camera!); // Render scene với camera
  };
  useEffect(() => {
    if (!scene || !camera || !renderer || !controls) return;

    // Tải mô hình 3D
    const loader = new GLTFLoader();
    loader.load(
      "https://storage.googleapis.com/download/storage/v1/b/rely-media/o/synode%2F202%2Fassets%2F667b01f5698be1bffb3b0c8a%2F66e265fa4eb88415e4851443%2F66e265fa4eb88415e4851443.glb?generation=1726113421254372&alt=media",
      (gltf) => {
        scene.add(gltf.scene);
      },
      undefined,
      (error) => {
        console.error("Error loading 3D model:", error);
      }
    );

    animate();

    // Cleanup khi component bị unmount
    return () => {
      renderer.dispose();
      controls.dispose();
    };
  }, [scene, camera, renderer]);

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}
