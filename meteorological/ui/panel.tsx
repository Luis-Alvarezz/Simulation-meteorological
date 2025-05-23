import { Component, ReactNode } from "react";

export default class Panel extends Component {
    public render(): ReactNode {
        return (
            <div id="panel">
                <h3 className="title">Creditos</h3>
                <div className="text">
                    <h2>Visualización de Fenomenos Meteorologicos</h2>
                    <h3>Proyecto creado por </h3>
                    <ul>
                        <li>
                            <strong>
                                Luis Angel Alvarez Vazquez - NUA 606175
                            </strong>
                        </li>
                        <li>
                            <strong>
                                Mario Geovani Cobian Ayala - NUA 381842
                            </strong>
                        </li>
                        <li>
                            <strong>
                                Dario Emilio Loza Hernandez - NUA 436795
                            </strong>
                        </li>
                    </ul>
                    <p className="title-school margin-top">Universidad de Guanajuato - FIMEE</p>
                    <p className="title-class">Graficos por Computadora</p>
                    <p className="margin-top">Docente: <strong>Valentina Ugarte Ortiz</strong></p>
                    <p className="margin-top size">
                        Para comprender la programacion de 3D
                        Es que se creo este proyecto con practicas 
                        de Three.js librería de JavaScript que nos facilita utilizar WebGL,
                        este ultimo es una clase de Three.js, un ‘Estándar’ en los navegadores 
                        que permite implementar el 3D en los navegadores.
                        Adicionando Framework de React.js para crear la interfaz de usuario.
                    </p>
                </div>
                <img src="/ui/textPanel.png" alt="Imagen Dialogo" />
            </div>
        )
    }
}