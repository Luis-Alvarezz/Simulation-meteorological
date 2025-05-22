import { Component, ReactNode } from "react";
import dynamic from "next/dynamic";

const MeteorologicalComponent = dynamic(() => import('../meteorological'), {ssr: false}); // * ssr es para que no se renderice en el servidor

export default class Home extends Component {
   public render() : ReactNode { // * Return JSX
      return (
         // <div>Hola</div>
         <MeteorologicalComponent />
      )
   }
}