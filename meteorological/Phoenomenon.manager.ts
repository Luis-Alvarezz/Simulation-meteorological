import Rain from "./classes/Rain";
import Snow from "./classes/Snow";
import Storm from "./classes/Storm";
import Tornado from "./classes/tornado";
import Wind from "./classes/Wind";
import SceneManager from "./scene.manager";

export default class PhoenomenonManager {
    private static current: any;

    public static showRain() : void {
        this.clearCurrent();
        this.current = new Rain();
        this.current.init();
    }

    public static showSnow() : void {
        this.clearCurrent();
        this.current = new Snow();
        this.current.init();
    }

    public static showWind() : void {
        this.clearCurrent();
        this.current = new Wind();
        this.current.init();
    }
    // public static async showStorm(): Promise<void> {
    //     this.clearCurrent();
    //     const storm = new Storm();
    //     await storm.init();
    //     this.current = storm;
    // }

    public static showStorm(): void {
        this.clearCurrent();
        this.current = new Storm();
        this.current.init();
    }

    public static showTornado(): void {
        this.clearCurrent();
        this.current = new Tornado();
        this.current.init();
    }

    public static clearCurrent() : void {
        if (this.current) {
            this.current.clear();
            this.current = null;
        }
    }

    public static update(delta: number): void {
        if (this.current) {
            this.current.update(delta);
        }
    }
}