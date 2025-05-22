import CreditState from "./creditos.state";
import MenuState from "./menu.state";
import PlayState from "./play.state";

export default class States {
    // * Class para crear instancia de los estados
    public static menu = new MenuState;
    public static play = new PlayState;
    public static credit = new CreditState;
}