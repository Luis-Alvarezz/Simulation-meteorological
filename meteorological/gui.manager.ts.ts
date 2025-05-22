import State from "./states/state";
import States from "./states/states";

export class GUIManager {
    
    // * Metodos para manipular el DOM:
    public static menuButtons() {
        const menu = document.getElementById("menu");
        const credit = document.createElement("BUTTON");
        credit.className = 'button';
        credit.innerHTML = 'CREDITOS';
        credit.onclick = () => {
            State.setCurrent(States.credit);
        };

        const play = document.createElement("BUTTON");
        play.className = 'button';
        play.innerHTML = 'Visualizar Fenomenos';
        play.onclick = () => {
            State.setCurrent(States.play);
        }

        menu.append(play);
        menu.append(credit);
    }

    public static creditButtons(): void {
        const menu = document.getElementById("menu");
        const back = document.createElement("BUTTON");
        back.className = 'button';
        back.innerHTML = 'REGRESAR';
        back.onclick = () => {
            State.setCurrent(States.menu);
        };
        menu.appendChild(back);
    }

    public static removeMenuButtons() : void {
        const menu = document.getElementById("menu");
        menu.textContent = '';
    }


    public static showHTML(id: string, style = 'block') : void {
        const element = document.getElementById(id);
        element.style.display = style;
    }
    public static hiddenHTML(id: string) : void {
        const element = document.getElementById(id);
        element.style.display = 'none';
    }
} 