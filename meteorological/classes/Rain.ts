import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, TextureLoader } from "three";
import Meteorological from "../types/Meteorological";
import SceneManager from "../scene.manager";

export default class Rain extends Meteorological {
    private static particles : Points;
    private static particleCount : number = 10000;
    private static textureLoader = new TextureLoader();
    

    constructor() {
        super();
    }

    // * Inicializar la lluvia
    public async init(): Promise<void> {
        const snowFlakeTexture = await this.loadTexture('/textures/rain-preview.png');

        const geometry = new BufferGeometry();
        const positions = new Float32Array(Rain.particleCount * 3);
        const sizes = new Float32Array(Rain.particleCount);
        const opacities = new Float32Array(Rain.particleCount);
        const rotations = new Float32Array(Rain.particleCount);
        const rotationSpeeds = new Float32Array(Rain.particleCount);

        // * Posiciones de las particulas
        for (let i = 0;  i < Rain.particleCount; i++) {
            positions[i * 3] = Math.random() * 200 - 100; // ? X
            positions[i * 3 + 1] = Math.random() * 100 - 50; // ? Y
            positions[i * 3 + 2] = Math.random() * 100 - 50; // ? Z
            
            sizes[i] = Math.random() * 5 + 1; // ? Tamaño
            opacities[i] = 0.3 + Math.random() * 0.7; // Variación de opacidad
            rotations[i] = Math.random() * Math.PI * 2; // Rotación inicial
            rotationSpeeds[i] = (Math.random() - 0.5) * 0.01; // Velocidad de rotación
        }

        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('opacity', new Float32BufferAttribute(opacities, 1));
        geometry.setAttribute('rotation', new Float32BufferAttribute(rotations, 1));
        geometry.setAttribute('rotationSpeed', new Float32BufferAttribute(rotationSpeeds, 1));

        // * Material Particulas:
        const material = new PointsMaterial( {
            map: snowFlakeTexture,
            color: 0x88aadd,
            size: 0.25,
            transparent: false,
            opacity: 0.8,
            sizeAttenuation: true, // * Hacer que las particulas se vean mas grandes cuando estan mas cerca de la camara
            alphaTest: 0.1 // * Transparencias
        });

        Rain.particles = new Points(geometry, material);
        SceneManager.scene.add(Rain.particles); // ? Añadir la lluvia a la escena
    }


    // * Actualizar la lluvia
    public update(): void {
        const position = (Rain.particles.geometry.attributes.position as Float32BufferAttribute).array as Float32Array;

        const time = Date.now() * 0.0005;

        // * Mover las particulas hacia abajo:
        for (let i = 0; i < Rain.particleCount; i++) {
            position[i * 3 + 1] -= 1.8 + Math.random() * 0.6; // * Y - velocidad
            
            // * Viento más intenso y consistente (50% más fuerte)
            position[i * 3] += Math.sin(time + i * 0.1) * 0.35; // Eje X (movimiento lateral)

            // * Ligero movimiento en Z para efecto 3D
            position[i * 3 + 2] += Math.cos(time * 0.7 + i * 0.05) * 0.15;

            // * Reiniciar la posicion de las particulas cuando salen de la pantalla:
            if (position[i * 3 + 1] < -15) { // 25% más cerca del límite inferior
                position[i * 3] = Math.random() * 250 - 125; // Área más amplia
                position[i * 3 + 1] = Math.random() * 30 + 120; // Altura inicial mayor
                position[i * 3 + 2] = Math.random() * 250 - 125;
            }
        }
        Rain.particles.geometry.attributes.position.needsUpdate = true; // ? Actualizar la posicion
    }


    // * Limpiar la lluvia
    public clear(): void {
        SceneManager.scene.remove(Rain.particles); // ? Eliminar la lluvia de la escena
        Rain.particles.geometry.dispose(); // ? Limpiar la geometria
    }

    private loadTexture(path: string): Promise<any> {
        return new Promise((resolve) => {
            Rain.textureLoader.load(path, resolve);
        });
    }
}