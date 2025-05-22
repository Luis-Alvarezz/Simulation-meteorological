import { Scene } from "three";

// * Interfaz para indicar a las clases la forma o métodos que deben tener
export default abstract class Meteorological {
    protected static scene : Scene;

    // Métodos abstractos que implementarán las clases hijas:
    public abstract init(...args: Array<any>): void; // * Flojo de funcion que recibe cantidad intedeterminada de argumentos y recibe un arreglo de lo que sea
    public abstract update(...agrs: Array<any>): void;
    public abstract clear(...agrs: Array<any>): void;
    
}