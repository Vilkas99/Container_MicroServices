import React, { useEffect } from 'react';

//Componente funcional que se encarga de vincular los scripts del proyecto de Micro con el Contenedor.
const MicroFrontend = ({ name, host, history }) => {
  //Hook que se ejecuta cada vez que hay un cambio en el nombre, host o history
  useEffect(() => {
    //Generamos el id del script (El cual debe coincidir con el del microFrontend)
    const scriptId = `micro-frontend-script-${name}`;
    //Método para rtenderizarlo
    const renderMicroFrontend = () => {
      window[`render${name}`] &&
        window[`render${name}`](`${name}-container`, history);
    };

    //Si en nuestro documento ya contamos con ese ID insertado, entonces lo renderizamos..
    if (document.getElementById(scriptId)) {
      renderMicroFrontend();
      return;
    }

    //Si no, entonces...
    //Realizamos un fetch al manifiesto json del host que se nos proporcionó a través del parámetro. 
    fetch(`${host}/asset-manifest.json`)
      //Lo transformamos a json
      .then(res => res.json())
      //Accedemos al manifiesto
      .then(manifest => {
        //Obtenemos todos aquellos elementos que tenga la key de "files" y los almacenamos en "promises"
        const promises = Object.keys(manifest['files'])
          .filter(key => key.endsWith('.js')) //Los filtramos para solo seleccionar los elementos que tengan extensión 'js'
          .reduce((sum, key) => { //Los reducimos a su "sum" (Contenido) y su key
            sum.push( //A cada contenido le añadimos...
              new Promise(resolve => { //Una nueva promesa
                const path = `${host}${manifest['files'][key]}`; //Creamos una variable que se llama path
                const script = document.createElement('script'); //Creamos un script
                if (key === 'main.js') { //Si la llave es "main.js" significa que habremos encontrado el script de código principal
                  script.id = scriptId; //Establecemos que su ID será el "scriptID" que creamos anteriormente
                }
                script.onload = () => {
                  resolve();
                };
                script.src = path;
                document.head.appendChild(script); //Añadimos el script al documento
              })
            );
            return sum;
          }, []);
        Promise.allSettled(promises).then(() => { //Una vez que todas las promesas se hayan cumplido...
          renderMicroFrontend(); //Renderizamos 
        });
      });

    return () => {
      window[`unmount${name}`] && window[`unmount${name}`](`${name}-container`);
    };
  }, [name, host, history]);

  return <main id={`${name}-container`} />;
};

export default MicroFrontend;