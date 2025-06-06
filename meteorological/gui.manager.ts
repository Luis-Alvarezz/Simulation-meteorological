import PhoenomenonManager from "./Phoenomenon.manager";
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
        play.innerHTML = 'Fenomenos Meteorologicos';
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

    public static showPhenomenonMenu(): void {
        const menu = document.getElementById("menu");
        menu.textContent = '';

        const rainBtn = this.createButton('lluvia', () => {
            PhoenomenonManager.showRain();
        });

        const snowBtn = this.createButton('nieve', () => {
            PhoenomenonManager.showSnow();
        });

        const windBtn = this.createButton('viento', () => {
            PhoenomenonManager.showWind();
        });

        const stormBtn = this.createButton('tormenta', async () => {
            await PhoenomenonManager.showStorm();
        });

        const tornadoBtn = this.createButton('tornado', async() => {
            await PhoenomenonManager.showTornado();
        });
        
        const backBtn = this.createButton('regresar', () => {
            GUIManager.removeMenuButtons();
            State.setCurrent(States.menu);
        });

        menu.append(rainBtn, snowBtn, windBtn, stormBtn, tornadoBtn, backBtn);
    }

    private static createButton(text: string, onClick: () => void): HTMLElement  {
        const button = document.createElement("BUTTON") as HTMLButtonElement;
        button.className = 'button';
        button.innerHTML = text;
        button.onclick = onClick;
        return button;
    }
}