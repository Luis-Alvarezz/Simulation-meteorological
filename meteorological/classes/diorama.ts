import { Clock, Vector3 } from "three";
import Meteorological from "../types/Meteorological"
import Rain from "./Rain"
import SceneManager from "../scene.manager";

export default class Dioarama extends Meteorological {
    private static rain: Rain;
    private stop: boolean = false;
    private clock: Clock = new Clock();
    private time: number = 0;
    private distance: number = 20; // * Distancia de la camara al objeto


    public init(): void {
        this.stop = false;
        Dioarama.rain = new Rain();
        this.update();
    }

    public update(): void {
        if (this.stop) return;

        requestAnimationFrame(this.update.bind(this)); // * bind para mantener el contexto de this
        const delta = this.clock.getDelta(); // ? Tiempo desde el ultimo frame
        this.time += delta; // ? Tiempo total

        this.rotateCamera();
    }

    public clear(): void {
        this.stop = true;
        Dioarama.rain.clear();    
    }


    private rotateCamera() : void {
        const offset = new Vector3(); // * offset: distancia de la camara al objeto
        offset.x = this.distance * Math.sin(this.time * 0.1);
        offset.y = -5;
        offset.z = this.distance * Math.cos(this.time * 0.1);
        
        SceneManager.camera.position.copy(offset);
        SceneManager.camera.lookAt(new Vector3(0, 0, 0)); // ? Mirar hacia el origen
    }
}