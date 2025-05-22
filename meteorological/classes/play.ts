import { Clock } from "three";
import Meteorological from "../types/Meteorological";
import SceneManager from "../scene.manager";

export default class Play extends Meteorological {
    private stop : boolean = false;
    private clock : Clock = new Clock();


    public init() : void {
        this.stop = false;
        SceneManager.camera.position.set(0, 26, -8);
        SceneManager.camera.lookAt(0, 0, 0);
        this.update();    
    }


    public update() : void {
        if (this.stop) return;

        requestAnimationFrame(this.update.bind(this));
        const delta = this.clock.getDelta();
        
    }


    public clear() : void {
        this.stop = true;

    }
}