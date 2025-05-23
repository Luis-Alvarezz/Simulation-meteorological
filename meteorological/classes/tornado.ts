import {
    BufferGeometry,
    Float32BufferAttribute,
    Points,
    PointsMaterial
  } from "three";
import Meteorological from "../types/Meteorological";
import SceneManager from "../scene.manager";

export default class Tornado extends Meteorological {
    private static particles: Points;
    private static particleCount: number = 1500;
    private static radius: number = 10;
    private static height: number = 60;

    constructor() {
        super(SceneManager.scene);
    }

    public init(): void {
        const geometry = new BufferGeometry();
        const positions = new Float32Array(Tornado.particleCount * 3);
        const angles = new Float32Array(Tornado.particleCount);

        for (let i = 0; i < Tornado.particleCount; i++) {
            const height = Math.random() * Tornado.height;
            const radius = (1 - height / Tornado.height) * Tornado.radius; // más estrecho en la cima
            const angle = Math.random() * Math.PI * 2;

            const x = Math.cos(angle) * radius;
            const y = height;
            const z = Math.sin(angle) * radius;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            angles[i] = angle;
        }

        geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
        geometry.setAttribute("angle", new Float32BufferAttribute(angles, 1)); // Guardamos el ángulo inicial

        const material = new PointsMaterial({
            color: 0x888888,
            size: 0.2,
            transparent: true,
            opacity: 0.6
        });

        Tornado.particles = new Points(geometry, material);
        SceneManager.scene.add(Tornado.particles);
    }

    public update(): void {
        const geometry = Tornado.particles.geometry;
        const position = geometry.attributes.position.array as Float32Array;
        const angles = geometry.attributes.angle.array as Float32Array;

        for (let i = 0; i < Tornado.particleCount; i++) {
            const y = position[i * 3 + 1];
            const angle = angles[i] + 0.05; // gira lentamente
            angles[i] = angle;

            const radius = (1 - y / Tornado.height) * Tornado.radius;

            position[i * 3] = Math.cos(angle) * radius;
            position[i * 3 + 2] = Math.sin(angle) * radius;
            position[i * 3 + 1] += 0.2;

            // reiniciar si salen por arriba
            if (position[i * 3 + 1] > Tornado.height) {
                position[i * 3 + 1] = 0;
                angles[i] = Math.random() * Math.PI * 2;
            }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.angle.needsUpdate = true;
    }

    public clear(): void {
        SceneManager.scene.remove(Tornado.particles);
        Tornado.particles.geometry.dispose();
    }
}
