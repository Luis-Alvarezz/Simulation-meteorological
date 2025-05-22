import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial } from "three";
import Meteorological from "../types/Meteorological";
import SceneManager from "../scene.manager";

export default class Rain extends Meteorological {
    private static particles : Points;
    private static particleCount : number = 1000;
    

    constructor() {
        super(SceneManager.scene);
    }

    // * Inicializar la lluvia
    public init(): void {
        const geometry = new BufferGeometry();
        const positions = new Float32Array(Rain.particleCount * 3);
        const sizes = new Float32Array(Rain.particleCount);

        // * Posiciones de las particulas
        for (let i = 0;  i < Rain.particleCount; i++) {
            positions[i * 3] = Math.random() * 100 - 50; // ? X
            positions[i * 3 + 1] = Math.random() * 100 - 50; // ? Y
            positions[i * 3 + 2] = Math.random() * 100 - 50; // ? Z
            sizes[i] = Math.random() * 5 + 1; // ? Tamaño
            // sizes[i] = 0.1;
        }
        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1));

        // * Material Particulas:
        const material = new PointsMaterial( {
            color: 0xaaaaaa,
            size: 0.1,
            transparent: true
        });

        Rain.particles = new Points(geometry, material);
        SceneManager.scene.add(Rain.particles); // ? Añadir la lluvia a la escena
    }


    // * Actualizar la lluvia
    public update(): void {
        const position = (Rain.particles.geometry.attributes.position as Float32BufferAttribute).array as Float32Array;

        // * Mover las particulas hacia abajo:
        for (let i = 0; i < Rain.particleCount; i++) {
            position[i * 3 + 1] -= 0.3; // ? Y - velocidad
            
            // * Reiniciar la posicion de las particulas cuando salen de la pantalla:
            if (position[i * 3 + 1] < - 10) {
                position[i * 3 + 1] = Math.random() * 50 + 10; // ? Reiniciar la posicion
            }
        }
        Rain.particles.geometry.attributes.position.needsUpdate = true; // ? Actualizar la posicion
    }


    // * Limpiar la lluvia
    public clear(): void {
        SceneManager.scene.remove(Rain.particles); // ? Eliminar la lluvia de la escena
        Rain.particles.geometry.dispose(); // ? Limpiar la geometria
    }
}