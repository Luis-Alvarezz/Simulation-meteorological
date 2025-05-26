import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, Texture, TextureLoader } from "three";
import Meteorological from "../types/Meteorological";
import SceneManager from "../scene.manager";

export default class Rain extends Meteorological {
    private static particles: Points;
    private static particleCount: number = 35000;
    private static textureLoader = new TextureLoader();

    constructor() {
        super();
    }

    public async init(): Promise<void> {
        let snowFlakeTexture: Texture | null = null; 
        
        try {
            snowFlakeTexture = await this.loadTexture('/textures/rain-preview.png');
        } catch (e) {
            console.error("Rain.ts: Failed to load rain texture. Using fallback.", e);
        }

        const geometry = new BufferGeometry();
        const positions = new Float32Array(Rain.particleCount * 3);
        const sizes = new Float32Array(Rain.particleCount);

        // Modificado para que el rango vertical cubra toda la pantalla
        const spawnWidth = 400;
        const initialSpawnMinY = -100;       // Desde el suelo
        const initialSpawnMaxY = 500;     // Hasta lo más alto visible o más

        // * Posiciones de las particulas
        for (let i = 0; i < Rain.particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * spawnWidth;
            positions[i * 3 + 1] = initialSpawnMinY + Math.random() * (initialSpawnMaxY - initialSpawnMinY);
            positions[i * 3 + 2] = (Math.random() - 0.5) * spawnWidth;
        }

        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

        const material = new PointsMaterial({
            map: snowFlakeTexture,
            color: 0x88aadd,
            size: snowFlakeTexture ? 1.2 : 0.15,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true,
            depthWrite: false,
        });

        Rain.particles = new Points(geometry, material);
        SceneManager.scene.add(Rain.particles);
    }

    public update(delta: number): void {
        if (!Rain.particles) return;

        const positionAttribute = Rain.particles.geometry.attributes.position as Float32BufferAttribute;
        const positions = positionAttribute.array as Float32Array;
        const time = Date.now() * 0.0005;

        const baseFallSpeed = 50;
        const randomFallVariance = 25;
        const windStrengthX = 18;
        const windStrengthZ = 10;

        // Ahora las gotas caen hasta más abajo
        const fallLimitY = -100;
        const respawnAreaWidth = 400;
        const respawnMinY = 500;   // Las nuevas gotas nacen desde bien arriba
        const respawnMaxY = 600;

        for (let i = 0; i < Rain.particleCount; i++) {
            const fallSpeed = (baseFallSpeed + Math.random() * randomFallVariance) * delta;
            positions[i * 3 + 1] -= fallSpeed;

            positions[i * 3] += Math.sin(time + i * 0.1) * windStrengthX * delta;
            positions[i * 3 + 2] += Math.cos(time * 0.7 + i * 0.05) * windStrengthZ * delta;

            if (positions[i * 3 + 1] < fallLimitY) {
                positions[i * 3] = (Math.random() - 0.5) * respawnAreaWidth;
                positions[i * 3 + 1] = respawnMinY + Math.random() * (respawnMaxY - respawnMinY);
                positions[i * 3 + 2] = (Math.random() - 0.5) * respawnAreaWidth;
            }
        }
        positionAttribute.needsUpdate = true;
    }

    public clear(): void {
        if (Rain.particles) {
            const parent = Rain.particles.parent;
            if (parent) {
                parent.remove(Rain.particles);
            }
            Rain.particles.geometry.dispose();
            if (Rain.particles.material instanceof PointsMaterial) {
                const mat = Rain.particles.material as PointsMaterial;
                if (mat.map) {
                    mat.map.dispose();
                }
                mat.dispose();
            }
        }
    }

    private loadTexture(path: string): Promise<Texture> {
        return new Promise((resolve, reject) => {
            Rain.textureLoader.load(
                path,
                texture => resolve(texture),
                undefined,
                errorEvent => {
                    console.error(`Rain.ts: Error loading texture at ${path}`, errorEvent);
                    reject(errorEvent);
                }
            );
        });
    }
}
