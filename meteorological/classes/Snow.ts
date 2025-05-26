import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, TextureLoader, AdditiveBlending, Color, Texture } from "three";
import Meteorological from "../types/Meteorological";
import SceneManager from "../scene.manager";

export default class Snow extends Meteorological {
    private static particles: Points;
    private static particleCount: number = 5000;
    private static textureLoader = new TextureLoader();

    constructor() {
        super();
    }

    public async init(): Promise<void> {
        // Cargar textura de copo de nieve
        let snowFlakeTexture: Texture | null = null;

        try {
            snowFlakeTexture = await this.loadTexture('/textures/snow-preview.png');
        } catch (e) {
            console.error("Rain.ts: Failed to load rain texture. Using fallback.", e);
        }
        
        const geometry = new BufferGeometry();
        const positions = new Float32Array(Snow.particleCount * 3);
        const sizes = new Float32Array(Snow.particleCount);
        const opacities = new Float32Array(Snow.particleCount);
        const rotations = new Float32Array(Snow.particleCount);
        const rotationSpeeds = new Float32Array(Snow.particleCount);

        // * Distribución más natural en un volumen 3D
        for (let i = 0; i < Snow.particleCount; i++) {
            positions[i * 3] = Math.random() * 400 - 200; // X: -200 a 200
            positions[i * 3 + 1] = Math.random() * 200 - 50; // Y: 50 a 250
            positions[i * 3 + 2] = Math.random() * 400 - 200; // Z: -200 a 200
            
            sizes[i] = 0.5 + Math.random() * 2; // Tamaños variados
            opacities[i] = 0.3 + Math.random() * 0.7; // Variación de opacidad
            rotations[i] = Math.random() * Math.PI * 2; // Rotación inicial
            rotationSpeeds[i] = (Math.random() - 0.5) * 0.01; // Velocidad de rotación
        }
        
        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('opacity', new Float32BufferAttribute(opacities, 1));
        geometry.setAttribute('rotation', new Float32BufferAttribute(rotations, 1));
        geometry.setAttribute('rotationSpeed', new Float32BufferAttribute(rotationSpeeds, 1));

        const material = new PointsMaterial({
            map: snowFlakeTexture,
            size: 3,
            sizeAttenuation: true,
            transparent: true,
            alphaTest: 0.01,
            blending: AdditiveBlending,
            color: new Color(0xffffff),
            opacity: 1,
            depthWrite: false
        });

        Snow.particles = new Points(geometry, material);
        Snow.particles.frustumCulled = false;
        SceneManager.scene.add(Snow.particles);
    }

    private loadTexture(path: string): Promise<any> {
        return new Promise((resolve) => {
            Snow.textureLoader.load(path, resolve);
        });
    }

    public update(): void {
        if (!Snow.particles) return;
        
        const position = (Snow.particles.geometry.attributes.position as Float32BufferAttribute).array;
        
        const rotation = (Snow.particles.geometry.attributes.rotation as Float32BufferAttribute).array;
        const rotationSpeed = (Snow.particles.geometry.attributes.rotationSpeed as Float32BufferAttribute).array;
        const time = Date.now() * 0.0005;
        
        for (let i = 0; i < Snow.particleCount; i++) {
            // Movimiento vertical con variación aleatoria
            position[i * 3 + 1] -= 0.1 + Math.sin(time * 0.5 + i) * 0.05;
            
            // Movimiento horizontal con patron de viento
            position[i * 3 + 0] += Math.sin(time * 0.3 + i * 0.1) * 0.2;
            
            // Movimiento en profundidad
            position[i * 3 + 2] += Math.cos(time * 0.2 + i * 0.05) * 0.1;
            
            // Rotación de los copos
            rotation[i] += rotationSpeed[i];
            
            // Reset cuando caen demasiado
            if (position[i * 3 + 1] < -50) {
                position[i * 3 + 1] = Math.random() * 100 + 200;
                position[i * 3 + 0] = Math.random() * 400 - 200;
                position[i * 3 + 2] = Math.random() * 400 - 200;
            }
        }
        
        Snow.particles.geometry.attributes.position.needsUpdate = true;
        Snow.particles.geometry.attributes.rotation.needsUpdate = true;
    }

    public clear(): void {
        SceneManager.scene.remove(Snow.particles);
        
        // Asegurar que el material es PointsMaterial
        const pointsMaterial = Snow.particles.material as PointsMaterial;
        
        Snow.particles.geometry.dispose();
        
        if (pointsMaterial.map) {
            pointsMaterial.map.dispose();
        }
        
        pointsMaterial.dispose();
    }
}