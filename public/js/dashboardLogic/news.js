// Ejecutando funciones al cargar la pagina
window.onload = getNews();
// Ejecutando funciones al cargar la pagina
// Funcion para cerrar la sesion del usuario
async function logOut() {
    await firebase.auth().signOut().then(() => {
        alert('Hasta la próxima');
        location.href="../authentication/provider/adminLogin.html";
    }).catch((error) => {
        alert('Ha ocurrido un error durante el cierre de sesión');
    });
}
// Funcion para cerrar la sesion del usuario
// Funcion para crear elementos en el DOM
function createDOMElements(itemToCreate) {
    const elementToCreate = document.createElement(itemToCreate);
    return elementToCreate;
}
// Funcion para crear elementos en el DOM
// Funcion para crear una noticia
async function createNews() {
    // Extrayendo datos del formulario
    const newsTitle = document.getElementById('newsTitle').value;
    const newsDate = document.getElementById('newsDate').value;
    const newsDescription = document.getElementById('newsDescription').value;
    const newsContent = document.getElementById('newsContent').value;
    // Extrayendo datos del formulario
    // Creando codigo unico para la noticia
    const newsCode = Date.now();
    // Creando codigo unico para la noticia
    // Creando registro en la base de datos
    await firebase.database().ref('covid19Platform/news/' + newsCode + '/').set({
        newsTitle: newsTitle,
        newsDate: newsDate,
        newsDescription: newsDescription,
        newsContent: newsContent,
        newsCode: newsCode,
        newsPicture: '../src/img/newsDefault.jpg',
    })
    // Creando registro en la base de datos
    // Alertando al administrador
    .then(() => {
        alert('Noticia creada exitosamente');
        window.location.reload();
    });
    // Alertando al administrador
}
// Funcion para crear una noticia
// Funcion para listar las noticias
async function getNews() {
    await firebase.database().ref('covid19Platform/news/').once('value').then((resultData) => {
        const newsList = Object.values(resultData.val());
        for (let index = 0; index < newsList.length; index++) {
            const element = newsList[index];
            console.log(element);
            // Creando elementos en el DOM
            // Creando columnas
            var appColumn = createDOMElements("div");
            appColumn.setAttribute("class", "col-10 col-sm-9 col-md-6 col-lg-5 col-xl-3");
            // Creando columnas
            // Creando tarjetas
            var appCard = createDOMElements("div");
            appCard.setAttribute("class", "card mb-4 shadow-sm");
            // Creando tarjetas
            // Creando etiqueta
            const newsLabel = createDOMElements('label');
            newsLabel.setAttribute('class', 'cardImage2');
            // Creando etiqueta
            // Creando selector
            const fileChooser = createDOMElements('input');
            fileChooser.setAttribute('type', 'file');
            fileChooser.setAttribute('hidden', '');
            fileChooser.setAttribute('onchange', 'uploadFile(event, ' + element.newsCode + ')');
            // Creando selector
            // Creando imagenes
            var appImage = createDOMElements("img");
            appImage.setAttribute("class", "cardImage2");
            appImage.setAttribute("src", element.newsPicture);
            // Creando imagenes
            // Creando un cuerpo de tarjeta
            var appCardBody = createDOMElements("div");
            appCardBody.setAttribute("class", "card-body");
            // Creando un cuerpo de tarjeta
            // Creando titulo para la tarjeta
            var appCardTitle = createDOMElements("h6");
            appCardTitle.setAttribute("class", "card-title");
            appCardTitle.innerText = element.newsTitle;
            // Creando titulo para la tarjeta
            // Creando listado de informaciones
            var pTag1 = createDOMElements("p");
            pTag1.setAttribute("class", "p-0 m-0");
            pTag1.innerText = element.newsDescription;
            // Creando listado de informaciones
            // Creando contenedor para los botones
            var buttonContainer = createDOMElements("div");
            buttonContainer.setAttribute("class", "d-flex justify-content-between align-items-center mt-3");
            // Creando contenedor para los botones
            // Creando grupo para los botones
            var buttonGroup = createDOMElements("div");
            buttonGroup.setAttribute("class", "btn-group");
            // Creando grupo para los botones
            // Creando los botones
            var cardButton1 = document.createElement("button");
            cardButton1.innerText = "Editar";
            cardButton1.setAttribute("class", "btn btn-sm btn-outline-secondary");
            cardButton1.setAttribute("onclick", "saveData("+ element.newsCode +")");
            var cardButton2 = createDOMElements("button");
            cardButton2.innerText = "Eliminar";
            cardButton2.setAttribute("class", "btn btn-sm btn-outline-secondary");
            cardButton2.setAttribute("onclick", "deleteNews("+ element.newsCode +")");
            // Creando los botones
            // Creando fecha de registro
            var registerDate = createDOMElements("small");
            registerDate.setAttribute("class", "text-muted");
            registerDate.innerText = element.newsDate;
            // Creando fecha de registro
            // Creando los appendChilds
            appCard.appendChild(newsLabel);
            newsLabel.appendChild(appImage);
            newsLabel.appendChild(fileChooser);
            appCard.appendChild(appCardBody);
            appCardBody.appendChild(appCardTitle);
            appCardBody.appendChild(pTag1);
            appCardBody.appendChild(buttonContainer);
            buttonContainer.appendChild(buttonGroup);
            buttonGroup.appendChild(cardButton1);
            buttonGroup.appendChild(cardButton2);
            buttonContainer.appendChild(registerDate);
            appColumn.appendChild(appCard);
            listOfCols.appendChild(appColumn)
            // Creando los appendChilds
            // Creando elementos en el DOM
        }
    });
}
// Funcion para listar las noticias
// Funcion para eliminar noticias
async function deleteNews(newsCode) {
    await firebase.database().ref('covid19Platform/news/' + newsCode + '/').remove()
    .then(() => {
        alert('Noticia eliminada exitosamente');
        window.location.reload();
    });
}
// Funcion para eliminar noticias
// Funcion para subir una nueva foto
async function uploadFile(event, newsCode) {
    const fileToUpload = event.target.files[0];
    const fileName = (Date.now()).toString();
    const fileReference = firebase.storage().ref().child('covid19Dashboard/multimediaContent/news/' + fileName + '/');
    let uploadTask = fileReference.child(fileName).put(fileToUpload);
    uploadTask.on('state_changed', (returnedData) => {
        
    }, (error) => {
        alert('Hubo un error al subir la imagen');
        console.log(error);
    }, () => {
        fileReference.child(fileName).getDownloadURL().then(async (url) => {
            await firebase.database().ref('covid19Platform/news/' + newsCode + '/').update({
                newsPicture: url,
            }).then(() => {
                alert('Foto agregada exitosamente');
                window.location.reload();
            });
        });
    })
}
// Funcion para subir una nueva foto
// Funcion para editar una noticia
function saveData(newsCode) {
    localStorage.setItem('editionCode', JSON.stringify(newsCode));
    const specialButton = document.getElementById('specialButton').click();
}
async function editNews() {
    // Extrayendo datos del formulario
    const newsDate = document.getElementById('editionNewsDate').value;
    const newsTitle = document.getElementById('editionNewsTitle').value;
    const newsDescription = document.getElementById('editionNewsDescription').value;
    const newsContent = document.getElementById('editionNewsContent').value;
    // Extrayendo datos del formulario
    const newsCode = JSON.parse(localStorage.getItem('editionCode'));
    // Creando registro en la base de datos
    await firebase.database().ref('covid19Platform/news/' + newsCode + '/').update({
        newsTitle: newsTitle,
        newsDate: newsDate,
        newsDescription: newsDescription,
        newsContent: newsContent,
    })
    // Creando registro en la base de datos
    // Notificando al usuario
    .then(() => {
        alert('Edicion exitosa');
        window.location.reload();
    });
    // Notificando al usuario
}
// Funcion para editar una noticia