import Dioarama from "../classes/diorama";
import { GUIManager } from "../gui.manager";
import State from "./state";

export default class MenuState extends State {
    
    public static diorama: Dioarama;

    public enter(): void {
        GUIManager.menuButtons();
    }

    public exit(): void {
        GUIManager.removeMenuButtons();
    }
}
// * Este codigo es mas particular, dependiendo del contexto de cada estado