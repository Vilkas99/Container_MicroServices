import React from 'react';
import { NavLink, BrowserRouter, Route, Switch } from 'react-router-dom';
import MicroFrontend from './MicroFrontend';

//Obtenemos la dirección de nuestro microFront por parte del .env
//En local, apuntamos al puerto 4000; en producción apuntaríamos a la URL que hostea a la aplicación.
const { REACT_APP_CREATEREACTAPP_HOST: microFrontHost } = process.env;


//Componente que requiere el "History" de la aplicación (Es decir, el registro de la URL en la que nos encontramos)
const MicroFront = ({ history }) => (
  //Llamaos a nuestro componente que posee todas las configuraciones para añadir al microfront
  //Le establecemos su historia, la dirección del host y el nombre del componente.
  <MicroFrontend
    history={history}
    host={microFrontHost}
    name="microfront"
  />
);

//Componente propio del proyecto que funje sólo para exponer como podemos combinar componentes de distintos proyectos.
const Hogar = () => (
  <>
    <p>
      Este es un componente dummy que tiene por objetivo exponer la
      intsersección entre componentes propios del proyecto, y aquellos
      pertenecientes a otro.
    </p>
  </>
);

//Aplicaciónb principal
const App = (props) => {
  return (
    <BrowserRouter>
      <h1>Este es un ejemplo de la arquitectura de "MicroFrontends"</h1>
      <p>
        Abajo encontrarán los siguientes links; "Hogar" carga un componente del
        propio contenedor, mientras que "MicroFrontEnd" carga un componente
        perteneciente a otro proyecto (Un MicroFrontEnd)
      </p>
      <ul>
        <li>
          <NavLink to="/hogar">Home</NavLink>
        </li>
        <li>
          <NavLink to="/microFront">Micro Frontend</NavLink>
        </li>
      </ul>

      <Switch>
        <Route path="/hogar" component={Hogar} />
        <Route path="/microFront" render={() => <MicroFront />} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
