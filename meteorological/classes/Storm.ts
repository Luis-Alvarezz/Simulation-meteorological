import {
    BufferGeometry,
    Float32BufferAttribute,
    Points,
    PointsMaterial,
    TextureLoader,
    AdditiveBlending, // O NormalBlending según la textura y fondo
    Vector3,          // Podríamos usarlo para cálculos si es necesario
    Texture           // Tipado para la textura
} from "three";
import Meteorological from "../types/Meteorological"; // Asegúrate que esta ruta sea correcta
import SceneManager from "../scene.manager";     // Asegúrate que esta ruta sea correcta

// --- Constantes de Configuración para la Tormenta ---
const STORM_PARTICLE_COUNT = 3500; // Mayor cantidad de partículas
const STORM_TEXTURE_PATH = '/textures/storm-particle.png'; // ¡Necesitas crear esta textura! (ej. raya diagonal)

// Área de aparición y reciclaje
const SPAWN_AREA_WIDTH_X = 300;  // Ancho del área de aparición/reciclaje en X
const SPAWN_AREA_DEPTH_Z = 250;  // Profundidad del área en Z
const SPAWN_Y_TOP = 120;         // Altura Y máxima desde donde aparecen/reciclan
const SPAWN_Y_VARIATION = 40;    // Variación en la altura Y de aparición

// Límites para el reciclaje de partículas
const BOUNDARY_X = SPAWN_AREA_WIDTH_X / 2 + 60;
const BOUNDARY_Y_BOTTOM = -100; // Límite inferior para reciclar
const BOUNDARY_Z = SPAWN_AREA_DEPTH_Z / 2 + 60;

// Velocidades y Turbulencia
const WIND_SPEED_X_MIN = 1.5;
const WIND_SPEED_X_MAX = 3.0;
const DOWNFALL_SPEED_Y_MIN = -2.5; // Hacia abajo
const DOWNFALL_SPEED_Y_MAX = -4.0;
const WIND_DRIFT_Z_MIN = -0.5;
const WIND_DRIFT_Z_MAX = 0.5;

const TURBULENCE_X_AMP = 0.4;
const TURBULENCE_Y_AMP = 0.3;
const TURBULENCE_Z_AMP = 0.3;
// --- Fin de Constantes ---

export default class Storm extends Meteorological {
    private static particles: Points;
    private static particleCount: number = STORM_PARTICLE_COUNT;
    private static textureLoader = new TextureLoader();

    constructor() {
        super();
    }

    private async loadTexture(path: string): Promise<Texture | null> {
        return new Promise((resolve) => {
            Storm.textureLoader.load(
                path,
                (texture) => resolve(texture),
                undefined,
                (error) => {
                    console.error(`Storm: Error loading texture at ${path}`, error);
                    resolve(null); // Resuelve con null para manejar el error en init
                }
            );
        });
    }

    public async init(): Promise<void> {
        if (Storm.particles) this.clear(); // Limpiar si ya existe

        const stormTexture = await this.loadTexture(STORM_TEXTURE_PATH);
        if (!stormTexture) {
            console.error("Storm: Failed to initialize due to missing texture.");
            return;
        }

        const geometry = new BufferGeometry();
        const positions = new Float32Array(Storm.particleCount * 3);
        // Para tormenta, podríamos necesitar velocidades en 3D para cada partícula
        const velocities = new Float32Array(Storm.particleCount * 3); // [vx, vy, vz]
        const sizes = new Float32Array(Storm.particleCount);
        const animationPhases = new Float32Array(Storm.particleCount);

        for (let i = 0; i < Storm.particleCount; i++) {
            const i3 = i * 3;

            // Posiciones iniciales distribuidas
            positions[i3]     = (Math.random() - 0.5) * SPAWN_AREA_WIDTH_X;
            positions[i3 + 1] = SPAWN_Y_TOP - Math.random() * SPAWN_Y_VARIATION;
            positions[i3 + 2] = (Math.random() - 0.5) * SPAWN_AREA_DEPTH_Z;

            // Velocidades iniciales
            velocities[i3]     = (WIND_SPEED_X_MIN + Math.random() * (WIND_SPEED_X_MAX - WIND_SPEED_X_MIN)) * (Math.random() < 0.5 ? 1 : -0.7); // Viento fuerte, principalmente en una dirección
            velocities[i3 + 1] = DOWNFALL_SPEED_Y_MIN + Math.random() * (DOWNFALL_SPEED_Y_MAX - DOWNFALL_SPEED_Y_MIN); // Caída constante
            velocities[i3 + 2] = WIND_DRIFT_Z_MIN + Math.random() * (WIND_DRIFT_Z_MAX - WIND_DRIFT_Z_MIN);     // Ligero movimiento en Z

            sizes[i] = 1.5 + Math.random() * 2.0; // Partículas de tormenta pueden ser más grandes/visibles
            animationPhases[i] = Math.random() * Math.PI * 2; // Para desfasar la turbulencia
        }

        geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
        geometry.setAttribute("velocity", new Float32BufferAttribute(velocities, 3));
        geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));
        geometry.setAttribute("animationPhase", new Float32BufferAttribute(animationPhases, 1));

        const material = new PointsMaterial({
            map: stormTexture,
            size: 3.5, // Tamaño base, se multiplica por el atributo 'size'
            color: 0x88aadd, // Un color azul-grisáceo para la tormenta
            transparent: true,
            opacity: 0.6,
            blending: AdditiveBlending, // Probar también NormalBlending si Additive es muy brillante
            sizeAttenuation: true,
            depthWrite: false, // Importante para el blending correcto de partículas transparentes
        });

        Storm.particles = new Points(geometry, material);
        SceneManager.scene.add(Storm.particles);
    }

    public update(): void {
        if (!Storm.particles) return;

        const positions = (Storm.particles.geometry.attributes.position as Float32BufferAttribute).array as Float32Array;
        const velocities = (Storm.particles.geometry.attributes.velocity as Float32BufferAttribute).array as Float32Array;
        const phases = (Storm.particles.geometry.attributes.animationPhase as Float32BufferAttribute).array as Float32Array;

        const time = Date.now() * 0.0015; // La tormenta puede tener una "sensación" de tiempo más rápida

        for (let i = 0; i < Storm.particleCount; i++) {
            const i3 = i * 3;
            const phase = phases[i];

            // Actualizar posición con velocidad base
            positions[i3]     += velocities[i3];     // Movimiento X (viento)
            positions[i3 + 1] += velocities[i3 + 1]; // Movimiento Y (caída)
            positions[i3 + 2] += velocities[i3 + 2]; // Movimiento Z (deriva)

            // Añadir turbulencia
            positions[i3]     += Math.sin(time * 1.5 + phase) * TURBULENCE_X_AMP;
            positions[i3 + 1] += Math.cos(time * 1.2 + phase) * TURBULENCE_Y_AMP;
            positions[i3 + 2] += Math.sin(time * 1.8 + phase) * TURBULENCE_Z_AMP;

            // Lógica de Reciclaje
            let recycled = false;
            if (positions[i3 + 1] < BOUNDARY_Y_BOTTOM) {
                positions[i3 + 1] = SPAWN_Y_TOP + Math.random() * SPAWN_Y_VARIATION / 2; // Reset arriba
                recycled = true;
            }
            if (positions[i3] > BOUNDARY_X) {
                positions[i3] = -BOUNDARY_X + Math.random() * 20; // Reset al lado izquierdo
                recycled = true;
            } else if (positions[i3] < -BOUNDARY_X) {
                positions[i3] = BOUNDARY_X - Math.random() * 20;  // Reset al lado derecho
                recycled = true;
            }
            if (positions[i3 + 2] > BOUNDARY_Z) {
                positions[i3 + 2] = -BOUNDARY_Z + Math.random() * 20;
                recycled = true;
            } else if (positions[i3 + 2] < -BOUNDARY_Z) {
                positions[i3 + 2] = BOUNDARY_Z - Math.random() * 20;
                recycled = true;
            }

            if (recycled) {
                // Si se recicló por Y, re-aleatorizar X y Z completamente
                if (positions[i3+1] >= SPAWN_Y_TOP) {
                    positions[i3] = (Math.random() - 0.5) * SPAWN_AREA_WIDTH_X;
                    positions[i3 + 2] = (Math.random() - 0.5) * SPAWN_AREA_DEPTH_Z;
                }
                // Opcional: reajustar ligeramente las velocidades al reciclar para más dinamismo
                 velocities[i3]     = (WIND_SPEED_X_MIN + Math.random() * (WIND_SPEED_X_MAX - WIND_SPEED_X_MIN)) * (Math.random() < 0.5 ? 1 : -0.7);
                 velocities[i3 + 1] = DOWNFALL_SPEED_Y_MIN + Math.random() * (DOWNFALL_SPEED_Y_MAX - DOWNFALL_SPEED_Y_MIN);
            }
        }
        Storm.particles.geometry.attributes.position.needsUpdate = true;
    }

    public clear(): void {
        if (Storm.particles) {
            SceneManager.scene.remove(Storm.particles);
            Storm.particles.geometry.dispose();
            const material = Storm.particles.material as PointsMaterial;
            material.map?.dispose(); // Desechar la textura si no se usa en otro lugar
            material.dispose();
            // Storm.particles = undefined; // O null, para permitir reinicialización
        }
    }
}