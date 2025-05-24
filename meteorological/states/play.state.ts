import Play from "../classes/play";
import { GUIManager } from "../gui.manager";
import PhoenomenonManager from "../Phoenomenon.manager";
import MenuState from "./menu.state";
import State from "./state";

export default class PlayState extends State {

    public static play : Play;

    public enter() : void {
        // MenuState.diorama.clear();
        // PlayState.play.init();
        GUIManager.showPhenomenonMenu();
        PhoenomenonManager.showRain();
    }

    public exit() : void {
        PhoenomenonManager.clearCurrent();
    }
}