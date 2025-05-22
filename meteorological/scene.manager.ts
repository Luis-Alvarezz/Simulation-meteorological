import State from "./states/state";
import States from "./states/states";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Color, HemisphereLight, PerspectiveCamera, PMREMGenerator, Scene, WebGLRenderer } from "three";
import Dioarama from "./classes/diorama";
import MenuState from "./states/menu.state";

export default class SceneManager {
    public static scene : Scene;
    public static camera : PerspectiveCamera;
    public static renderer : WebGLRenderer;


    public static async init(renderer: WebGLRenderer) {
        SceneManager.renderer = renderer;
        SceneManager.createScene();
        SceneManager.createCamera();
        // SceneManager.createLighs();
        SceneManager.onReady();

        await this.loadHDRI();

        // const diorama = new Dioarama(this.scene);
        // diorama.init();
    }

    private static createScene() : void {
        SceneManager.scene = new Scene();
        SceneManager.scene.background = new Color(0x000000); // ? Color de fondo
    }

    private static createCamera() : void {
        SceneManager.camera = new PerspectiveCamera(
            88, // * Perpectiva
            window.innerWidth / window.innerHeight,
            0.1, // * Planos near -> distancia minima de renderizado
            1000 // * Planos far -> distancia maxima de renderizado
        );
        SceneManager.camera.position.set(30, 25, 30); // ? Posicion de la camara
        SceneManager.camera.lookAt(0, 0, 0); // ? Mirar hacia el origen
        SceneManager.scene.add(SceneManager.camera); // ? Añadir la camara a la escena
    }

    private static createLighs() : void {
        const ligth = new HemisphereLight(0xffffff, 0.2);
        ligth.position.set(100,100,100);
        SceneManager.scene.add(ligth);
    }


    private static async loadHDRI() : Promise<void> {
        const loader = new RGBELoader();
        const path = '/textures/rogland_clear_night_4k.hdr';
        const hdriTexture = await loader.loadAsync(path);

        // Rotar la textura 90 grados en el eje Y (ajusta el ángulo según necesites)
        hdriTexture.rotation = Math.PI / 2; // 90 grados en radianes

        const pmremGenerator = new PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();

        const envMap = pmremGenerator.fromEquirectangular(hdriTexture).texture;
        SceneManager.scene.environment = envMap; // ? Asignar el mapa de entorno a la escena, es decir la iluminacion
        SceneManager.scene.background = envMap; // ? Fondo
    }

    private static onReady() : void {
        // * Aqui se puede añadir codigo que se ejecute cuando la escena este lista:
        MenuState.diorama = new Dioarama();
        State.setCurrent(States.menu);
        MenuState.diorama.init();
    }
}