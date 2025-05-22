export default abstract class State {
    // * Almacenar el estado que se esta ejecutando:
    public static currentState: State |null = null;

    public static setCurrent(newState: State) {
        if (State.currentState === newState) return;
        
        if (State.currentState)  State.currentState.exit();

        State.currentState = newState;
        State.currentState.enter();
    }
    // * Para almacenar donde se esta ejecutando el estado:
    public abstract enter(): void;
    public abstract exit():  void;
}