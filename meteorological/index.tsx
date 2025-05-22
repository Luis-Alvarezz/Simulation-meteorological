import { Component, ReactNode } from "react"
import RendererManager from "./renderer.manager"
import Panel from "./ui/panel";
import { Menu } from "./ui/menu";

export default class MeteorologicalComponent extends Component {
    public componentDidMount() : void { // * Metodo de React para cuando se monta el componente por unica vez
        RendererManager.startGame();
    }

    public render() : ReactNode {
      return (
         <div>
            <canvas id="simulation" className="fullscreen" />
            <Panel />
            <Menu />
         </div>
      )
   }
}