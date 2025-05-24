import {
    BufferGeometry,
    Float32BufferAttribute,
    Points,
    PointsMaterial,
  } from "three";
  import Meteorological from "../types/Meteorological";
  import SceneManager from "../scene.manager";
  
  export default class Wind extends Meteorological {
    private static particles: Points;
    private static particleCount: number = 1000;
  
    constructor() {
      super(SceneManager.scene);
    }
  
    public init(): void {
      const geometry = new BufferGeometry();
      const positions = new Float32Array(Wind.particleCount * 3);
      const sizes = new Float32Array(Wind.particleCount);
  
      for (let i = 0; i < Wind.particleCount; i++) {
        positions[i * 3] = Math.random() * 100 - 50;     // X
        positions[i * 3 + 1] = Math.random() * 50 - 25;  // Y
        positions[i * 3 + 2] = Math.random() * 100 - 50; // Z
        sizes[i] = Math.random() * 5 + 1;
      }
  
      geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
      geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));
  
      const material = new PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.5,
      });
  
      Wind.particles = new Points(geometry, material);
      SceneManager.scene.add(Wind.particles);
    }
  
    public update(): void {
      const positions = (Wind.particles.geometry.attributes
        .position as Float32BufferAttribute).array as Float32Array;
  
      for (let i = 0; i < Wind.particleCount; i++) {
        const index = i * 3;
        positions[index] += 0.5; // Mover en X
        positions[index + 1] += Math.sin(index + Date.now() * 0.001) * 0.01; // Ondulación en Y
  
        // Reiniciar si salen de la zona
        if (positions[index] > 60) {
          positions[index] = -60;
          positions[index + 1] = Math.random() * 50 - 25;
          positions[index + 2] = Math.random() * 100 - 50;
        }
      }
  
      Wind.particles.geometry.attributes.position.needsUpdate = true;
    }
  
    public clear(): void {
      SceneManager.scene.remove(Wind.particles);
      Wind.particles.geometry.dispose();
    }
  }
  