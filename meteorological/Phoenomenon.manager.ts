import Rain from "./classes/Rain";
import Snow from "./classes/Snow";
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

    public static clearCurrent() : void {
        if (this.current) {
            this.current.clear();
            this.current = null;
        }
    }

    public static update() : void {
        if (this.current) {
            this.current.update();
        }
    }
}