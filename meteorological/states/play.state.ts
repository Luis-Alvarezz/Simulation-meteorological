import Play from "../classes/play";
import MenuState from "./menu.state";
import State from "./state";

export default class PlayState extends State {

    public static play : Play;

    public enter() : void {
        MenuState.diorama.clear();
        PlayState.play.init();
    }

    public exit() : void {

    }
}