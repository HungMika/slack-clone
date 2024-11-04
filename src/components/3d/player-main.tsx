"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Player() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Kiểm tra xem renderer đã được khởi tạo chưa
    if (rendererRef.current) {
      containerRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }

    // Thiết lập scene, camera, và renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Thiết lập màu nền trắng
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Thêm ánh sáng
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Tạo DRACOLoader và liên kết với GLTFLoader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    // Tải mô hình 3D
    loader.load(
      "https://storage.googleapis.com/download/storage/v1/b/rely-media/o/synode%2F202%2Fassets%2F667b01f5698be1bffb3b0c8a%2F66e265fa4eb88415e4851443%2F66e265fa4eb88415e4851443.glb?generation=1726113421254372&alt=media",
      (gltf: GLTF) => {
        scene.add(gltf.scene);
        animate();
      },
      undefined,
      (error: unknown) => {
        console.error("Error loading 3D model:", error);
      },
    );

    camera.position.z = 5;
    rendererRef.current = renderer; // Lưu renderer vào ref
    sceneRef.current = scene; // Lưu scene vào ref
    cameraRef.current = camera; // Lưu camera vào ref

    // Khởi tạo OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls; // Lưu controls vào ref

    // Hàm animation
    function animate() {
      requestAnimationFrame(animate);
      controlsRef.current?.update();
      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
    }

    // Cập nhật kích thước canvas khi thay đổi kích thước cửa sổ
    const handleResize = () => {
      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", handleResize);

    // Dọn dẹp khi component bị unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current) {
        containerRef.current?.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
        rendererRef.current = null; // Đặt lại renderer để không gây lỗi khi sử dụng lại
      }
      controlsRef.current?.dispose();
      sceneRef.current = null; // Đặt lại scene
      cameraRef.current = null; // Đặt lại camera
    };
  }, []);

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}
