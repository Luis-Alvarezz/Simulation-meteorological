import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, Color, TextureLoader, AdditiveBlending, Vector3, Object3D, Group, Texture, LinearFilter } from "three";
import Meteorological from "../types/Meteorological";
import SceneManager from "../scene.manager";

export default class Tornado extends Meteorological {
    private static particleSystem: Group;
    private static baseParticles: Points;
    private static debrisParticles: Points;
    private static particleCount: number = 8000;
    private static debrisCount: number = 2000;
    private static baseRadius: number = 18;
    private static topRadius: number = 1.5;
    private static height: number = 100;
    private static rotationSpeed: number = 0.12;
    private static ascentSpeed: number = 0.18;
    private static turbulenceFactor: number = 0.4;
    private static time: number = 0;
    private static textureLoader = new TextureLoader();
    private static windForce: Vector3 = new Vector3(0.02, 0, 0.02);

    constructor() {
        super();
    }

    private async loadTexture(path: string): Promise<Texture> {
        return new Promise((resolve, reject) => {
            Tornado.textureLoader.load(
                path,
                (texture) => {
                    texture.minFilter = LinearFilter;
                    texture.magFilter = LinearFilter;
                    resolve(texture);
                },
                undefined,
                (error) => reject(error)
            );
        });
    }

    public async init(): Promise<void> {
        try {
            Tornado.particleSystem = new Group();

            Tornado.particleSystem.position.z = -30;
            
            const [dustTexture, debrisTexture] = await Promise.all([
                this.loadTexture('/textures/Dust-particles.jpg'),
                this.loadTexture('/textures/Debris-particles.jpg')
            ]);
    
            this.createBaseParticles(dustTexture);
            this.createDebrisParticles(debrisTexture);
            
            if (!Tornado.baseParticles || !Tornado.debrisParticles) {
                throw new Error("Failed to create particles");
            }
            
            SceneManager.scene.add(Tornado.particleSystem);
        } catch (error) {
            console.error("Failed to initialize tornado:", error);
            // Manejar el error apropiadamente
        }
    }

    private createBaseParticles(texture: Texture | null): void {
        const geometry = new BufferGeometry();
        const positions = new Float32Array(Tornado.particleCount * 3);
        const angles = new Float32Array(Tornado.particleCount);
        const speeds = new Float32Array(Tornado.particleCount);
        const colors = new Float32Array(Tornado.particleCount * 3);
        const randoms = new Float32Array(Tornado.particleCount);
        const sizes = new Float32Array(Tornado.particleCount);

        const baseColor = new Color(0x6A5C4D);
        const midColor = new Color(0x8A7D6F);
        const topColor = new Color(0xD0D0D0);

        for (let i = 0; i < Tornado.particleCount; i++) {
            const height = Math.pow(Math.random(), 1.5) * Tornado.height;
            const t = height / Tornado.height;
            const radius = this.getCurrentRadius(t);
            
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.4 + Math.random() * 0.6;
            const randomOffset = (Math.random() - 0.5) * Tornado.turbulenceFactor * 2;
            
            positions[i * 3] = Math.cos(angle) * (radius + randomOffset);
            positions[i * 3 + 1] = height;
            positions[i * 3 + 2] = Math.sin(angle) * (radius + randomOffset);
            
            angles[i] = angle;
            speeds[i] = speed;
            randoms[i] = Math.random();
            sizes[i] = 0.2 + Math.random() * 0.3;
            
            const color = t < 0.5 ? 
                baseColor.clone().lerp(midColor, t * 2) : 
                midColor.clone().lerp(topColor, (t - 0.5) * 2);
            
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
        geometry.setAttribute("angle", new Float32BufferAttribute(angles, 1));
        geometry.setAttribute("speed", new Float32BufferAttribute(speeds, 1));
        geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
        geometry.setAttribute("random", new Float32BufferAttribute(randoms, 1));
        geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));

        const material = new PointsMaterial({
            size: 0.25,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            sizeAttenuation: true,
            map: texture,
            alphaTest: 0.01,
            blending: AdditiveBlending,
            depthWrite: false
        });

        Tornado.baseParticles = new Points(geometry, material);
        Tornado.baseParticles.position.y = -5; // Bajar un poco el tornado
        Tornado.particleSystem.add(Tornado.baseParticles);
    }

    private createDebrisParticles(texture: Texture | null): void {
        const geometry = new BufferGeometry();
        const positions = new Float32Array(Tornado.debrisCount * 3);
        const angles = new Float32Array(Tornado.debrisCount);
        const speeds = new Float32Array(Tornado.debrisCount);
        const randoms = new Float32Array(Tornado.debrisCount * 2); // Para más variación
        const sizes = new Float32Array(Tornado.debrisCount);

        for (let i = 0; i < Tornado.debrisCount; i++) {
            const height = Math.pow(Math.random(), 3) * Tornado.height * 0.8;
            const t = height / Tornado.height;
            const radius = this.getCurrentRadius(t) * (0.8 + Math.random() * 0.4);
            
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.3 + Math.random() * 0.7;
            
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = height;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
            
            angles[i] = angle;
            speeds[i] = speed;
            randoms[i * 2] = Math.random();
            randoms[i * 2 + 1] = Math.random();
            sizes[i] = 0.5 + Math.random() * 1.5; // Escombros más grandes
        }

        geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
        geometry.setAttribute("angle", new Float32BufferAttribute(angles, 1));
        geometry.setAttribute("speed", new Float32BufferAttribute(speeds, 1));
        geometry.setAttribute("random", new Float32BufferAttribute(randoms, 2));
        geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));

        const material = new PointsMaterial({
            size: 0.6,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true,
            map: texture,
            alphaTest: 0.05,
            depthWrite: false
        });

        Tornado.debrisParticles = new Points(geometry, material);
        Tornado.particleSystem.add(Tornado.debrisParticles);
    }

    private getCurrentRadius(t: number): number {
        // Función no lineal para el radio que crea un efecto más orgánico
        const easedT = Math.pow(t, 1.5);
        return Tornado.baseRadius * (1 - easedT) + Tornado.topRadius * easedT;
    }

    public update(): void {
        if (!Tornado.particleSystem || !Tornado.baseParticles || !Tornado.debrisParticles) return;
        
        Tornado.time += 0.016; // Asumiendo 60fps
        Tornado.windForce.x = Math.sin(Tornado.time * 0.3) * 0.03;
        Tornado.windForce.z = Math.cos(Tornado.time * 0.2) * 0.03;

        this.updateParticles(Tornado.baseParticles, true);
        this.updateParticles(Tornado.debrisParticles, false);
    }

    private updateParticles(particles: Points, isBase: boolean): void {
        const geometry = particles.geometry;
        const positions = geometry.attributes.position.array as Float32Array;
        const angles = geometry.attributes.angle.array as Float32Array;
        const speeds = geometry.attributes.speed.array as Float32Array;
        const randoms = geometry.attributes.random.array as Float32Array;
        const particleCount = isBase ? Tornado.particleCount : Tornado.debrisCount;

        for (let i = 0; i < particleCount; i++) {
            const idx = isBase ? i : i * 2;
            const y = positions[i * 3 + 1];
            const t = y / Tornado.height;
            
            const radius = this.getCurrentRadius(t);
            const rotationSpeed = Tornado.rotationSpeed * speeds[i] * 
                                (1 - t * 0.5) * 
                                (0.9 + randoms[idx] * 0.2);
            
            angles[i] += rotationSpeed;
            
            // Turbulencia más compleja
            const turbulenceX = Math.sin(Tornado.time * 0.5 + randoms[idx] * 10) * Tornado.turbulenceFactor * (1 - t);
            const turbulenceZ = Math.cos(Tornado.time * 0.6 + randoms[idx] * 8) * Tornado.turbulenceFactor * (1 - t);
            
            // Aplicar fuerzas
            positions[i * 3] = Math.cos(angles[i]) * (radius + turbulenceX) + Tornado.windForce.x;
            positions[i * 3 + 2] = Math.sin(angles[i]) * (radius + turbulenceZ) + Tornado.windForce.z;
            
            // Movimiento ascendente con variación
            const ascentSpeed = Tornado.ascentSpeed * speeds[i] * (0.7 + 0.6 * randoms[idx]) * (isBase ? 1 : 0.8);
            positions[i * 3 + 1] += ascentSpeed;
            
            // Reiniciar partículas
            if (positions[i * 3 + 1] > Tornado.height) {
                positions[i * 3 + 1] = isBase ? 0 : -5 + Math.random() * 10;
                angles[i] = Math.random() * Math.PI * 2;
                
                const newRadius = this.getCurrentRadius(0) * (0.8 + Math.random() * 0.4);
                positions[i * 3] = Math.cos(angles[i]) * newRadius;
                positions[i * 3 + 2] = Math.sin(angles[i]) * newRadius;
                
                // Variación adicional para escombros
                if (!isBase) {
                    speeds[i] = 0.3 + Math.random() * 0.7;
                }
            }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.angle.needsUpdate = true;
    }

    public clear(): void {
        if (Tornado.particleSystem) {
            SceneManager.scene.remove(Tornado.particleSystem);
            
            [Tornado.baseParticles, Tornado.debrisParticles].forEach(particles => {
                if (particles) {
                    particles.geometry.dispose();
                    const material = particles.material as PointsMaterial;
                    if (material.map) material.map.dispose();
                    material.dispose();
                }
            });
            
            Tornado.particleSystem = null;
        }
    }
}