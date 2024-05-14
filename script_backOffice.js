//COSTANTI e var_globali UTILIZZATE IN TUTTO LO SCRIPT
const URL_PRODUCTS_ENDPOINT = "https://striveschool-api.herokuapp.com/api/product/";
const KEY_PRODUCTS_ENDPOINT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNlNGI1OTcyYjNlYTAwMTU3MWZkNDQiLCJpYXQiOjE3MTUzNTg1NTMsImV4cCI6MTcxNjU2ODE1M30.vdzkWNpeUpxw5g9HITvnlbowagVxXxU6c1sAW-4IiAk";
const sections = document.getElementsByClassName("section");
const buttonUpdateForm = document.querySelector("#button_form_update"); //puntatore del vottone del form modifica
const buttonAddForm = document.getElementById("button_form_add");//puntatore del bottone del form aggiungi
var possiblyChoise = document.getElementsByClassName("choose");
var elementsToChange = document.getElementsByClassName("to_disappear");//da togliere
var elementsToInsert = document.getElementsByClassName("to_insert");//da inserire
var arrayProducts = [];//array globale di prodotti
/////////////////////////////////////////////////////////////////////////////////////////
// Funzione per mostrare il modale ad ogni operazione
var myModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
function showModal() {
    myModal.show();
  }
  function hideModal() {
    myModal.hide();
}
//READ//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//funzione renderDashboard
function renderDashboard(data) {//popola la dashboard
    const dashboard = document.getElementById("workstation_dashboard");
    dashboard.innerHTML = ""; // Pulisco la dashboard prima di popolarla

    data.forEach(product => {
        const row = `
            <tr>
                <td><span class="fw-bold"">ID:</span> ${product._id}</td>
                <td>${product.name}</td>
                <td>${product.brand}</td>
                <td>${product.price}</td>
                <td>${product.description}</td>
                <td><img src="${product.imageUrl}" alt="Product Image" style="width:50px; height:50px;"></td>
            </tr>
        `;
        dashboard.innerHTML += row;
    });
}

//funzione requestFetchGet
function requestFetchGet(URL_FETCH, KEY_FETCH) {//la funzione fetchGET prende come parametri URL e KEY (CReadUD)
    fetch(URL_FETCH, {
        headers: {
        "Authorization": `Bearer ${KEY_FETCH}`
         } } )
    .then(response => response.json())
    .then(data => {
        console.log("HEY API!: ", data);
        arrayProducts.push(...data);
        renderDashboard(arrayProducts);
        renderingDOM(arrayProducts);
    })
    .catch(error => console.error("Si è verificato un errore: ", error));
   
//    console.log("array", arrayProducts);
}  

async function renderingDOM(dataBase) {//popola la delete/modify section
    const workStation = document.getElementById("workstation");
    workStation.innerHTML = "";
    await dataBase.forEach(elemento => {
        workStation.innerHTML += 
        `
            <tr>
                <th scope="row">ID:${elemento._id}</th>
                <td>${elemento.name}</td>
                <td>${elemento.brand}</td>
                <td>${elemento.price}</td>
                <td scope="col"><i class="bi bi-trash3-fill action_delete"></i></td>
                <td scope="col"><i class="bi bi-gear action_modify"></i></td>
            </tr>
        `;
          //    console.log(workStation.lastElementChild); 
    }); 
        
        //aggiungo i gestori di eventi subito dopo la creazione degli elementi
         document.querySelectorAll('.action_delete').forEach(btn => {//DELETE
             btn.addEventListener('click', function(event) {
                const row = event.target.parentNode.parentNode;
                functionDelete(row.firstElementChild.textContent.slice(3));//do solo id
             });
         });

         document.querySelectorAll('.action_modify').forEach(btn => {//UPDATE
             btn.addEventListener('click', function(event) {
                const row = event.target.parentNode.parentNode;  
                functionModify(row);//do intera riga
             });
         });
 }

function inputOfFilter(punct) { // Ritorna la selezione da ricercare
    return punct.value; // Ritorna il campo di ricerca
}

// Funzione per pulire il campo di ricerca e ristabilire il DOM
function resetSearchBarAndDOM(dom_dash) {
    if(dom_dash == 1){
    const barSearch = document.getElementById("research");
    barSearch.value = ""; // Pulisco la barra di ricerca
    renderingDOM(arrayProducts); // E rirenderizzo il DOM con tutti i prodotti
    }else{
        const barSearchTwo = document.getElementById("research_two");
        barSearchTwo.value = ""; // Pulisco la barra di ricerca della dashboard
        renderDashboard(arrayProducts); // E rirenderizzo la dashboard con tutti i prodotti
    }
    
   
}

// Funzione di ricerca 
function returnArrayNew(key, array, researchInputUser) {
    const newArray = [];
    key = key.trim();
    array.forEach(elemento => {
        if (key === "price") {
            // Converto il valore dell'input e il prezzo dell'elemento in numeri
            const searchPrice = parseFloat(researchInputUser);
            const productPrice = parseFloat(elemento[key]);
            console.log(searchPrice, productPrice);
            // Controllo uguaglianza
            if ( productPrice === searchPrice) {
                newArray.push(elemento);
            }
        } else {
            // Per tutte le altre chiavi
            if (elemento[key].toLowerCase().includes(researchInputUser.toLowerCase())) {
                newArray.push(elemento);
            }
        }
    });

    return newArray;
}

document.addEventListener("DOMContentLoaded", function() {
    requestFetchGet(URL_PRODUCTS_ENDPOINT, KEY_PRODUCTS_ENDPOINT);
    const select_one = document.getElementById("filtro"); // Punto SELECT - OPTIONS
    const select_two = document.getElementById("filtro_two"); // Punto SELECT - OPTIONS
    const barSearch = document.getElementById("research"); // Punto INPUT per delete
    const barSearchTwo = document.getElementById("research_two"); // Punto INPUT per dashboard
    let keyCurrent = inputOfFilter(select_one);

    select_one.addEventListener("change", function() { // Evento sulla chiave
        keyCurrent = inputOfFilter(select_one);
        resetSearchBarAndDOM(1); // Pulisco la barra di ricerca e rirenderizzo il DOM
    });
    select_two.addEventListener("change", function() { // Evento sulla chiave
        keyCurrent = inputOfFilter(select_two);
        resetSearchBarAndDOM(2); // Pulisco la barra di ricerca e rirenderizzo il DOM
    });

    barSearch.addEventListener("input", function() { // Evento sulla barra di ricerca (ad ogni lettera inserita)
        renderingDOM(returnArrayNew(keyCurrent, arrayProducts, barSearch.value));
    });

    barSearchTwo.addEventListener("input", function() { // Evento sulla barra di ricerca della dashboard (ad ogni lettera inserita)
        renderDashboard(returnArrayNew(keyCurrent, arrayProducts, barSearchTwo.value));
    });
});

 
//CREATE//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//funzione e puntatore al form crea ...................................................
buttonAddForm.addEventListener("click", function(){//al click lancia submitProduct
    const objectX = submitProduct();
    requestFetchPost(URL_PRODUCTS_ENDPOINT, KEY_PRODUCTS_ENDPOINT, objectX);
    inputFieldClean();//pulisce il form
})
//
//funzione submitProduct.............
function submitProduct(){//funzione estrai dati dal form (CreateRUD)
const punctForm = document.getElementById("productForm");
    const newObjProduct =
    {
        name: document.getElementById("input_name").nextElementSibling.value,
        description: punctForm.elements['input_description_form'].value,
        brand: document.getElementById("input_brand").nextElementSibling.value,
        imageUrl: document.getElementById("input_url_img").nextElementSibling.value,
        price: punctForm.elements['numberInput'].value

    }
    // console.log(newObjProduct);
    return newObjProduct;
}
//funzione richiesta requestFetchPOST............
async function requestFetchPost(URL_FETCH, KEY_FETCH, objectX) {//la funzione fetchPOST prende come parametri URL e KEY e oggetto(CreateRUD)
    try {
        const response = await fetch(URL_FETCH, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KEY_FETCH}`  
            },
            body: JSON.stringify(objectX)     
        });
        if (!response.ok) {
            throw new Error('Ci sono stati problemi con la fetch: ' + response.statusText);
          }else{
            const data = await response.json(); 
            arrayProducts.push(data);
            showModal();//operazione eseguita con successo!
            hideModal();
            renderingDOM(arrayProducts);//rireinderizzo il dom
            renderDashboard(arrayProducts);//rireinderizzo la dashboard
          }
        console.log("Response:", response);
        console.log("Data returned:", data); // Stampa i dati restituiti
    } 
    catch (error) {
        console.error("Error:", error);
    }
}
//A QUESTO PUNTO PRODOTTO CREATO E SPEDITO AL SERVER api
/////////////////////////////////////////////////////////
//........
//UPDATE
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// extractMyProduct cerca l'oggetto attraverso l'id
function esxtractMyProduct(ID, flag) {//2 funzioni se flag=0 da oggetto; se flag = 1 da indice in array
    for (let i=0; i<arrayProducts.length; i++) {//scorro l'array per trovare il prodotto voluto

        if (arrayProducts[i]._id.trim() === ID.trim()) {//.trim elimina spazi che mi davano problemi
            if( flag == 0){
                return arrayProducts[i];
            }else{
                return i;
            }    
        }
    }
    return null; //caso in cui non trova nulla
}
//.......
//toggleCreate_Modify modifica l'aspetto form modifica-crea
function toggleCreate_Modify(){
    for( let i=0; i<elementsToChange.length; i++){
        elementsToChange[i].classList.toggle("d-none");
        elementsToInsert[i].classList.toggle("d-none");
    }    
}
//.......
//pulisce dati form
function inputFieldClean( ){
    // name:........................................................= ""
    document.getElementById("input_name").nextElementSibling.value = "";
    // description:.....................................= ""
    document.getElementById("input_description_form").value = "";
    // brand:.......................................................= ""
    document.getElementById("input_brand").nextElementSibling.value = "";
    // imageUrl:.......................................................= ""
    document.getElementById("input_url_img").nextElementSibling.value = "";
    // price:...............................= ""
    document.getElementById("numberInput").value = "objectX.price";
}
//.......
//processazione dei dati e chiamata alla funzione che effettua la fetch PUT
function functionModify( row ){
    //1)passa alla sezione form
    const pagDelete = document.getElementById("main_delete");
    pagDelete.classList.add("d-none");
    const pagForm = document.getElementById("main_form");
    pagForm.classList.remove("d-none");
    //2)modifico l'aspetto del form aggiungi
    toggleCreate_Modify();//cambia aspetto form
    document.querySelector(".choose_jolly").classList.add("clicked");//toggle a choose jolly
    for( let i=0; i<possiblyChoise.length; i++ ){//rimuovo il "clicked" da tutti gli altri
        possiblyChoise[i].classList.remove("clicked");
    }
    //3)mi porto dietro l'id del prodotto e lo utilizzo per inserire i vecchi dati nel form
    const objectX = esxtractMyProduct(row.firstElementChild.textContent.slice(3), 0);//in objectX adesso ho il prodotto selezionato
    // console.log(objectX);
    // name:........................................................= oggetto.nome
    document.getElementById("input_name").nextElementSibling.value = objectX.name;
    // description:.....................................= oggetto.descrizione
    document.getElementById("input_description_form").value = objectX.description;
    // brand:.......................................................= oggetto.marca
    document.getElementById("input_brand").nextElementSibling.value = objectX.brand;
    // imageUrl:.......................................................= oggetto.URLImg
    document.getElementById("input_url_img").nextElementSibling.value = objectX.imageUrl;
    // price:...............................= oggetto.prezzo
    document.getElementById("numberInput").value = objectX.price;

    buttonUpdateForm.addEventListener("click", function(){
        const objectX = submitProduct();
        requestFetchPut( URL_PRODUCTS_ENDPOINT, KEY_PRODUCTS_ENDPOINT, row.firstElementChild.textContent.slice(3), objectX);
        inputFieldClean();//pulisco il form(fa capire che è stato aggiornato)
       
    })
    
}
//.......
//function requestFetchPut
async function requestFetchPut(URL_FETCH, KEY_FETCH, objectID, objectX) {//la funzione fetchPUT prende come parametri URL e KEY e ID(CRUpdateD)
    try {
        console.log(objectID, objectX);
        const response = await fetch(`${URL_FETCH}${objectID}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KEY_FETCH}`  
            },
            body: JSON.stringify(objectX)     
        });
        if (!response.ok) {
            throw new Error('Ci sono stati problemi con la fetch:' + response.statusText);
          }else{
            const data = await response.json(); 
            arrayProducts.splice(esxtractMyProduct(objectID,1), 1);//toglie l'elemento dal var globale
            arrayProducts.push(data);
            showModal();//operazione eseguita con successo!
            hideModal();
            renderingDOM(arrayProducts);//rireinderizzo il dom
            renderDashboard(arrayProducts);//rireinderizzo la dashboard
          }
    } 
    catch (error) {
        console.error("Error:", error);
    }
}
//DELETE//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //function requestFetchDelete
   async function requestFetchDelete(URL_FETCH, KEY_FETCH, objectID) {//la funzione fetchDelete prende come parametri URL e KEY e ID(CRUpdateD)
    try {
        const response = await fetch(`${URL_FETCH}${objectID}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${KEY_FETCH}`  
            }    
        });
        if (!response.ok) {
            throw new Error('Ci sono stati problemi con la fetch:' + response.statusText);
          }else{
            showModal();//operazione eseguita con successo!
            hideModal();
          }
    } 
    catch (error) {
        console.error("Error:", error);
    }
}


function functionDelete(id){
    requestFetchDelete(URL_PRODUCTS_ENDPOINT, KEY_PRODUCTS_ENDPOINT, id);//elimina da api
    arrayProducts.splice(esxtractMyProduct(id,1), 1);//toglie l'elemento dal var globale
    renderingDOM(arrayProducts);//rireinderizzo il dom
    renderDashboard(arrayProducts);//rireinderizzo la dashboard
}

//...............................................................................................................................................
////////////////////////////////////////////////////////////////
/////////////GESTIONE SEZIONI DEL BACKOFFICE////////////////////
////////////////////////////////////////////////////////////////

function checkSectionCorrect(classSectionResearch) {
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].classList.contains(classSectionResearch)) {
            sections[i].classList.remove("d-none");
        } else {
            sections[i].classList.add("d-none");
        }
    }

}

// console.log(possiblyChoise);
for (let i = 0; i < possiblyChoise.length; i++) {
    possiblyChoise[i].addEventListener("click", function(event) {
        // Rimuove la classe "clicked" da tutti gli elementi con la classe "choose"
        for (let j = 0; j < possiblyChoise.length; j++) {
            possiblyChoise[j].classList.remove("clicked");
        }

        // Aggiunge la classe "clicked" solo all'elemento cliccato
        event.target.classList.add("clicked");

        // Mostra/nasconde le sezioni in base alla scelta
        if (event.target.classList.contains("create")) {
            checkSectionCorrect("create");
            if( document.querySelector("#button_form_add").classList.contains("d-none")){//solo se si passa da una precedente modifica
                toggleCreate_Modify();
            }
            document.querySelector(".choose_jolly").classList.remove("clicked");//remove a choose-jolly
        }else
        if (event.target.classList.contains("delete")) {
            checkSectionCorrect("delete");
            document.querySelector(".choose_jolly").classList.remove("clicked");//remove a choose-jolly
        }else
        if( event.target.classList.contains("dashboard") ) {
            checkSectionCorrect("dashboard");
            document.querySelector(".choose_jolly").classList.remove("clicked");//remove a choose-jolly
        }

    });
}