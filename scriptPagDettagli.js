const URL_PRODUCTS_ENDPOINT = "https://striveschool-api.herokuapp.com/api/product/";
const KEY_PRODUCTS_ENDPOINT = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNlNGI1OTcyYjNlYTAwMTU3MWZkNDQiLCJpYXQiOjE3MTUzNTg1NTMsImV4cCI6MTcxNjU2ODE1M30.vdzkWNpeUpxw5g9HITvnlbowagVxXxU6c1sAW-4IiAk"
const workStation = document.querySelector("#workstation");
const params = new URLSearchParams(window.location.search);
const ID_card = params.get("id");

function renderingDom(data, punct) {
    console.log(data, punct);
        punct.innerHTML +=
            `
            <div class="card position-relative" style="width: 15rem; height: 28rem; margin: auto; margin-top: 5rem;">
            <a href="/dettagli.html?id=${data._id}">
                <img style="height: 18rem; border-radius: 15px;" src="${data.imageUrl}" class="card-img-top" alt="${data.name}">
            </a>
            <div class="card-body">
                <h5 style="font-size: 3em; margin: 0.1%;" class="card-title">${data.name}</h5>
                <p class="card-text">Descrizione: ${data.description}</p>
                <p class="card-text">Prezzo: ${data.price}€</p>
            </div>
        </div>
        `;
   
}


fetch(`${URL_PRODUCTS_ENDPOINT}${ID_card}`,{
        headers: {
        "Authorization": `${KEY_PRODUCTS_ENDPOINT}`
          } 
        })
.then( response =>{ 
    if (!response.ok) {//se la risposta del server ha problemi
        throw new Error("Errore di rete: " + response.statusText);//butto giù l'errore
    }else{  
        return response.json();
    }     
})
.then(data => renderingDom(data, workStation))
.catch (error => console.error("Errore: ", error))
    