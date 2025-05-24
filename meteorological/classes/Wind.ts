import {
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  TextureLoader, // ¡Importar TextureLoader!
  AdditiveBlending, // Opcional, para un efecto más brillante
} from "three";
import Meteorological from "../types/Meteorological";
import SceneManager from "../scene.manager";

export default class Wind extends Meteorological {
  private static particles: Points;
  private static particleCount: number = 500; // Puedes ajustar esto
  private static textureLoader = new TextureLoader(); // Añadir instancia de TextureLoader

  constructor() {
      super();
  }

  // Nueva función para cargar texturas (similar a tu clase Rain)
  private async loadTexture(path: string): Promise<any> {
      return new Promise((resolve, reject) => {
          Wind.textureLoader.load(path, resolve, undefined, reject);
      });
  }

  public async init(): Promise<void> { // Cambiado a async para esperar la textura
      // Carga tu textura de partícula de viento
      // Reemplaza '/textures/wind-particle.png' con la ruta a tu textura
      const windTexture = await this.loadTexture('/textures/wind-particle.png').catch(error => {
          console.error("Error loading wind texture:", error);
          return null; // Maneja el error si la textura no carga
      });

      const geometry = new BufferGeometry();
      const positions = new Float32Array(Wind.particleCount * 3);
      const sizes = new Float32Array(Wind.particleCount);
      // Para movimiento más variado, podemos añadir propiedades por partícula
      const customSpeed = new Float32Array(Wind.particleCount);
      const animationOffset = new Float32Array(Wind.particleCount); // Para desfasar animaciones

      for (let i = 0; i < Wind.particleCount; i++) {
          positions[i * 3] = Math.random() * 120 - 60;     // X (rango ampliado)
          positions[i * 3 + 1] = Math.random() * 40 - 20;  // Y (rango ajustado)
          positions[i * 3 + 2] = Math.random() * 100 - 50; // Z
          
          sizes[i] = Math.random() * 1.5 + 0.5; // Tamaños más variados y visibles
          customSpeed[i] = 0.3 + Math.random() * 0.5; // Velocidades individuales
          animationOffset[i] = Math.random() * Math.PI * 2; // Desfase aleatorio para ondulaciones
      }

      geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
      geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1)); // Three.js usará esto si sizeAttenuation es true y no hay shader que lo anule
      geometry.setAttribute("customSpeed", new Float32BufferAttribute(customSpeed, 1));
      geometry.setAttribute("animationOffset", new Float32BufferAttribute(animationOffset, 1));


      const material = new PointsMaterial({
          // color: 0xffffff, // El color puede venir de la textura
          map: windTexture,         // ¡Usar la textura cargada!
          size: 2,                  // Tamaño base de las partículas, ajusta según tu textura y escena
          transparent: true,
          opacity: 0.6,             // Opacidad general
          blending: AdditiveBlending, // Prueba esto para un efecto de "brillo" si tu textura es clara y el fondo oscuro
          sizeAttenuation: true,    // Las partículas lejanas se ven más pequeñas
          depthWrite: false,        // Ayuda con la transparencia y el blending
      });

      Wind.particles = new Points(geometry, material);
      SceneManager.scene.add(Wind.particles);
  }

  public update(): void {
      if (!Wind.particles) return; // Asegurarse de que las partículas existen

      const positions = (Wind.particles.geometry.attributes.position as Float32BufferAttribute).array as Float32Array;
      const customSpeeds = (Wind.particles.geometry.attributes.customSpeed as Float32BufferAttribute).array as Float32Array;
      const animationOffsets = (Wind.particles.geometry.attributes.animationOffset as Float32BufferAttribute).array as Float32Array;
      
      const time = Date.now() * 0.001;

      for (let i = 0; i < Wind.particleCount; i++) {
          const i3 = i * 3; // Índice base para posiciones (x, y, z)
          const i1 = i;     // Índice para atributos de 1 componente (customSpeed, animationOffset)

          // Movimiento principal en X con velocidad individual
          positions[i3] += customSpeeds[i1]; 

          // Movimiento ondulatorio en Y y Z más pronunciado y variado
          const particleXPos = positions[i3];
          const phase = animationOffsets[i1];

          positions[i3 + 1] += Math.sin(particleXPos * 0.1 + phase + time * 0.5) * 0.03; // Ondulación en Y
          positions[i3 + 2] += Math.cos(particleXPos * 0.05 + phase + time * 0.3) * 0.02; // Ondulación en Z

          // Reiniciar si salen de la zona (solo para X)
          if (positions[i3] > 60) { // Si la partícula se va por la derecha
              positions[i3] = -60; // La reinicia a la izquierda
              // Opcional: re-aleatorizar Y y Z para que no todas sigan el mismo camino exacto al reiniciar
              positions[i3 + 1] = Math.random() * 40 - 20;
              positions[i3 + 2] = Math.random() * 100 - 50; 
          }
      }

      Wind.particles.geometry.attributes.position.needsUpdate = true;
      // Si quisieras cambiar dinámicamente la opacidad o el tamaño general:
      // (Wind.particles.material as PointsMaterial).opacity = Math.abs(Math.sin(time * 0.5)) * 0.4 + 0.2; // Ejemplo de opacidad pulsante
  }

  public clear(): void {
      if (Wind.particles) {
          SceneManager.scene.remove(Wind.particles);
          Wind.particles.geometry.dispose();
          // También sería bueno desechar el material si ya no se va a usar
          // (Wind.particles.material as PointsMaterial).dispose();
      }
  }
}