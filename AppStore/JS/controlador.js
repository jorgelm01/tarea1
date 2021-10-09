//Codigo para generar información de categorias y almacenarlas en un arreglo.
var categorias = []; //arreglo donde se guarda la base de datos generada aleatoriamente
var dbCategorias = []; //arreglo donde se guardará la base de datos tomada desde el indexedDB

(() => {
  //Este arreglo es para generar textos de prueba
  let textosDePrueba = [
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore, modi!",
    "Quos numquam neque animi ex facilis nesciunt enim id molestiae.",
    "Quaerat quod qui molestiae sequi, sint aliquam omnis quos voluptas?",
    "Non impedit illum eligendi voluptas. Delectus nisi neque aspernatur asperiores.",
    "Ducimus, repellendus voluptate quo veritatis tempora recusandae dolorem optio illum.",
  ];

  //Genera dinamicamente los JSON de prueba para esta evaluacion,
  //Primer ciclo para las categorias y segundo ciclo para las apps de cada categoria

  let contador = 1;
  for (let i = 0; i < 5; i++) {
    //Generar 5 categorias
    let categoria = {
      nombreCategoria: "Categoria " + i,
      descripcion: textosDePrueba[Math.floor(Math.random() * (5 - 1))],
      aplicaciones: [],
    };
    for (let j = 0; j < 10; j++) {
      //Generar 10 apps por categoria
      let aplicacion = {
        codigo: contador,
        nombre: "App " + contador,
        descripcion: textosDePrueba[Math.floor(Math.random() * (5 - 1))],
        icono: `img/app-icons/${contador}.webp`,
        instalada: contador % 3 == 0 ? true : false,
        app: "app/demo.apk",
        calificacion: Math.floor(Math.random() * (5 - 1)) + 1,
        descargas: 1000,
        desarrollador: `Desarrollador ${(i + 1) * (j + 1)}`,
        imagenes: [
          "img/app-screenshots/1.webp",
          "img/app-screenshots/2.webp",
          "img/app-screenshots/3.webp",
        ],
        comentarios: [
          {
            comentario: textosDePrueba[Math.floor(Math.random() * (5 - 1))],
            calificacion: Math.floor(Math.random() * (5 - 1)) + 1,
            fecha: "12/12/2012",
            usuario: "Juan",
          },
          {
            comentario: textosDePrueba[Math.floor(Math.random() * (5 - 1))],
            calificacion: Math.floor(Math.random() * (5 - 1)) + 1,
            fecha: "12/12/2012",
            usuario: "Pedro",
          },
          {
            comentario: textosDePrueba[Math.floor(Math.random() * (5 - 1))],
            calificacion: Math.floor(Math.random() * (5 - 1)) + 1,
            fecha: "12/12/2012",
            usuario: "Maria",
          },
        ],
      };
      contador++;
      categoria.aplicaciones.push(aplicacion);
    }
    categorias.push(categoria);
  }

})()
  
  /*llenamos el indexedDB conlos datos del arreglo categorias*/
    
  const indexedDB = window.indexedDB;

 if (indexedDB) {
      
    cargarTodo();
    let db;
    let conexion = indexedDB.open("appStore", 1);
    conexion.onsuccess = () => {
      db = conexion.result;
      console.log("base de datos abierta", db);
      agregar();
      leerDatos();
    };

    conexion.onupgradeneeded = () => {
      db = conexion.result;
      const coleccionObjetos = db.createObjectStore("categorias", {
        keyPath: "nombreCategoria",
      });
      console.log("base de datos creada", db);
    };

    conexion.onerror = (error) => {
      console.log("error", error);
    };


    /*Aqui estan los metodos CRUD*/

    //funcion para agregar elementos a la base de datos appStore indexedDB
    const agregar = () => {
      const transaction = db.transaction(["categorias"], "readwrite");
      const objectStore = transaction.objectStore("categorias");

      for (let i = 0; i < categorias.length; i++) {
        const request = objectStore.add(categorias[i]);
      }

    };

    /*toma los datos del indexedDB y los guarda en la base de datos dbCategorias*/
    const leerDatos = () => {
        const transaccion = db.transaction(["categorias"], "readonly");
        const coleccionObjetos = transaccion.objectStore("categorias");
       const conexion = coleccionObjetos.openCursor();
  
        conexion.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            dbCategorias.push(cursor.value)
            cursor.continue()
          } else {
            console.log("no hay categorias en la lista");
          }
        };
        console.log(dbCategorias)
    }
  
    


    /* const actualizar = () => {};
    const eliminar = () => {};
       };*/
  }


 


     
    
    function cargarTodo() {
        let aplicaciones = ''
       for(let i=0;i<categorias.length;i++){
                categorias[i].aplicaciones.forEach(function(app){
                    aplicaciones += 
                    `<div class="card col-xl-2 col-lg-2 col-sm-3" style="width: 18rem; " data-toggle="modal" data-target="#exampleModal">
                        <img src="${app.icono}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${app.nombre}</h5>
                            <p class="card-text">${app.desarrollador}</p>
                            <p href="#" class="card-text">${app.calificacion}</p>
                        </div>
                    </div>`
                })
        }
        document.getElementById('cards').innerHTML = aplicaciones

        //cargar las categorias existentes
        let listaCategorias = document.getElementById('sl-categorias').innerHTML = `<option value='categorias'>Categorias</option></option>`      
        for(let i=0;i<=4;i++){
            listaCategorias += `<option value='${i}'>${categorias[i].nombreCategoria}</option>`;
        }
        document.getElementById("sl-categorias").innerHTML = listaCategorias 
    }

    //funcion para mostrar solo las aplicaciones de la categoria seleccionada
    var select = document.getElementById('sl-categorias');
    select.addEventListener('change',
    function(){
        let stringHTML = ''
        var selectedOption = this.options[select.selectedIndex]; 

        if(selectedOption.value == 'categorias'){
            document.getElementById('sl-categorias').innerHTML = ''
            document.getElementById('sl-categorias').innerHTML = `<option value='categorias'>Categorias</option></option>`
            cargarTodo()
        }else{
            console.log(selectedOption)
            categorias[selectedOption.value].aplicaciones.forEach(function(app){
                stringHTML += 
                    `<div class="card col-xl-2 col-lg-2" style="width: 18rem;" data-toggle="modal" data-target="#exampleModal">
                        <img src="${app.icono}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${app.nombre}</h5>
                            <p class="card-text">${app.desarrollador}</p>
                            <p href="#" class="card-text">Puntuación: ${app.calificacion}</p>
                        </div>
                    </div>`
                })
        document.getElementById("cards").innerHTML = stringHTML

        }   
    })
    ;


;
