import '../styles/index.css';
import '../styles/menu.css';
import '../styles/panel.css';
import { JSX } from 'react'; // * para indicar el tipo de retorno de render
import App from 'next/app';

export default class MyApp extends App {
   public render() : JSX.Element {
      const { Component, pageProps } = this.props; 
      return (
         <Component {...pageProps} /> // * { ...pageProps } is a spread operator that passes all the properties of pageProps to Component }
      )
   }
}