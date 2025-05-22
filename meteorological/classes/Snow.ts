import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial } from "three";
import Meteorological from "../types/Meteorological";
import SceneManager from "../scene.manager";

export default class Snow extends Meteorological {
    private static particles : Points;
    private static particleCount : number = 2000;

    constructor() {
        super(SceneManager.scene);
    }


    public init() : void {
        const geometry = new BufferGeometry();
        const positions = new Float32Array(Snow.particleCount * 3);

        for (let i = 0;  i < Snow.particleCount; i++) {
            positions[i * 3] = Math.random() * 100 - 50;
            positions[i * 3 + 1] = Math.random() * 100; 
            positions[i * 3 + 2] = Math.random() * 100 - 50; 
        }
        
        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
        
        const material = new PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            transparent: true,
            opacity: 0.8
        })

        Snow.particles = new Points(geometry, material);
        SceneManager.scene.add(Snow.particles);
    }



    public update(): void {
        const position = (Snow.particles.geometry.attributes.position as Float32BufferAttribute).array as Float32Array;

        // * Mover las particulas hacia abajo:
        for (let i = 0; i < Snow.particleCount; i++) {
            position[i * 3 + 1] -= 0.1; // ? Y - velocidad
            position[i * 3 + 0] = Math.sin(Date.now() * 0.001 + i) * 0.1; // ? Movimiento de las particulas lateral al viento

        }
        Snow.particles.geometry.attributes.position.needsUpdate = true; // ? Actualizar la posicion
    }

    
    public clear(): void {
        SceneManager.scene.remove(Snow.particles);
        Snow.particles.geometry.dispose();
    }
}