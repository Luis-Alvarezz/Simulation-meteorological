import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Scene, Texture, TextureLoader } from "three";
import Meteorological from "../types/Meteorological";
import Rain from "./Rain";
import SceneManager from "../scene.manager";

export default class ViewStart extends Meteorological {
    private static rain: Rain;
    private backgroundMesh : Mesh;


    constructor() {
        super();
        ViewStart.rain = new Rain();
    }


    public async init() : Promise<void> {
        this.createBackground();

        ViewStart.rain.init();

        SceneManager.camera.position.set(0, 5, 15); // ? Posicion de la camara
        SceneManager.camera.lookAt(0, 0, 0); // ? Mirar hacia el origen
    }

    public async update() : Promise<void> {
        // ViewStart.rain.update();
    }

    public async clear() : Promise<void> {
        ViewStart.rain.clear();
        if (this.backgroundMesh) {
            SceneManager.scene.remove(this.backgroundMesh)
        }
        
    }


    private createBackground() : void {
        const geometry = new PlaneGeometry(30,20);
        const material = new MeshBasicMaterial({
            map: new TextureLoader().load('/textures/docklands_02_4k.jpg'), // ? Textura de fondo
            side: DoubleSide,
            transparent: true
        })
        this.backgroundMesh = new Mesh(geometry, material);
        this.backgroundMesh.position.z = -10;
        this.backgroundMesh.rotation.y = Math.PI / 2; // ? Rotación de 90 grados
        SceneManager.scene.add(this.backgroundMesh); // ? Añadir la lluvia a la escena
    }
}