import { Component, ReactNode } from "react";

export default class Panel extends Component {
    public render(): ReactNode {
        return (
            <div id="panel">
                <h3 className="title">Creditos</h3>
                <div className="text">
                    <p>Proyecto creado por: </p>
                    <p>Luis Alvarez</p>
                    <p>Mario Cobian</p>
                    <p>Dario Hernandez</p>
                    <p>Universidad de Guanajuato - FIMEE</p>
                    <p>Graficos por Computadora</p>
                    <p>Docente: <strong>Valentina Ugarte Ortiz</strong></p>
                    <p>
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