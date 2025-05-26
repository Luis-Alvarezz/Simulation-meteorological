import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, Color } from "three";
import Meteorological from "../types/Meteorological";
import SceneManager from "../scene.manager";

export default class Thunderstorm extends Meteorological {
    private static flashes: Points;
    private static flashCount: number = 30;
    private static flashTimers: number[] = [];

    constructor() {
        super(SceneManager.scene);
    }

    // * Inicializar tormenta eléctrica
    public init(): void {
        const geometry = new BufferGeometry();
        const positions = new Float32Array(Thunderstorm.flashCount * 3);

        // * Posiciones de los rayos
        for (let i = 0; i < Thunderstorm.flashCount; i++) {
            positions[i * 3] = Math.random() * 100 - 50;   // X
            positions[i * 3 + 1] = Math.random() * 50 + 30; // Y (altas en el cielo)
            positions[i * 3 + 2] = Math.random() * 100 - 50; // Z

            Thunderstorm.flashTimers[i] = Math.random() * 100 + 30; // Tiempo aleatorio para el siguiente flash
        }

        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

        const material = new PointsMaterial({
            color: 0xffffcc,
            size: 2.5,
            transparent: true,
            opacity: 0
        });

        Thunderstorm.flashes = new Points(geometry, material);
        SceneManager.scene.add(Thunderstorm.flashes);
    }

    // * Actualizar tormenta eléctrica
    public update(): void {
        const flashPositions = (Thunderstorm.flashes.geometry.attributes.position as Float32BufferAttribute).array;
        const flashMaterial = Thunderstorm.flashes.material as PointsMaterial;

        for (let i = 0; i < Thunderstorm.flashCount; i++) {
            Thunderstorm.flashTimers[i] -= 1;

            if (Thunderstorm.flashTimers[i] <= 0) {
                // Flash de relámpago
                flashMaterial.opacity = Math.random() * 0.8 + 0.2; // Destello visible
                flashMaterial.color = new Color(0xffffcc); // Luz amarillenta/blanca
                Thunderstorm.flashTimers[i] = Math.random() * 200 + 100; // Reiniciar temporizador
            } else if (Thunderstorm.flashTimers[i] < 10) {
                // Apagando el flash
                flashMaterial.opacity *= 0.8;
            }
        }

        flashMaterial.needsUpdate = true;
    }

    // * Limpiar tormenta
    public clear(): void {
        SceneManager.scene.remove(Thunderstorm.flashes);
        Thunderstorm.flashes.geometry.dispose();
    }
}
