import Dioarama from "../classes/diorama";
import Rain from "../classes/Rain";
import { GUIManager } from "../gui.manager";
import State from "./state";

export default class MenuState extends State {
    private static rain: Rain;
    
    public static diorama: Dioarama;

    public enter(): void {
        // this.showMainMenu();
        this.initRainEffect();
        GUIManager.menuButtons();
    }

    public exit(): void {
        GUIManager.removeMenuButtons();
        MenuState.rain?.clear();
    }

    private initRainEffect() : void {
        MenuState.rain = new Rain(); 
        MenuState.rain.init();
    }
}
// * Este codigo es mas particular, dependiendo del contexto de cada estado