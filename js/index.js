const CAR_PRODUCTO =  "cartProductsId";

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadProductCart();
    });

function getProductsDB(){
    const url ="../dbProducts.json";

return    fetch(url)
        .then(response => {return response.json();})
//estos 2 comandos siguientes el posible que no haga falta solo para logear
        .then(result => {return result;})
        
        .catch(err => {console.log(err)});
}

async function loadProducts(){
    const products = await getProductsDB();
    
    let html = '';
    products.forEach(product => {
        html += `
            <div class = "col-3 product-container">
                <div class = "card product">
                    <img
                        src = "${product.image}"
                        class = "card-img-top"
                        alt = "${product.name}"
                    />
                    <div class = "card-body">
                        <h5 class = "card-title">${product.name}</h5>
                        <p class = "card-text">${product.extraInfo}</p>
                        <p class = "card-text">${product.price} Eu / Unidad</p>
                        <button type = "button" class = "btn btn-primary btn-cart" onClick=(addProductCart(${product.id}))>agregar al carro</button>
                    </div>
                </div>
            </div>    
        `;
        
    });
    document.getElementsByClassName("products")[0].innerHTML = html;
}

function openCloseCart(){
    const containerCart = document.getElementsByClassName("cart-products")[0];

    containerCart.classList.forEach(
        item => {
            if (item ==="hidden"){
                containerCart.classList.remove("hidden");
                containerCart.classList.add("active");
            }

            if (item ==="active"){
                containerCart.classList.remove("active");
                containerCart.classList.add("hidden");
            }

        }
    );
}

function addProductCart(idProduct){
   let arrayProductsId = [];
    let localStorageItems = localStorage.getItem(CAR_PRODUCTO);

    if(localStorageItems === null){
        arrayProductsId.push(idProduct);
        localStorage.setItem(CAR_PRODUCTO, arrayProductsId);
    }else {
        let productsId = localStorage.getItem(CAR_PRODUCTO);
        if(productsId.length > 0){
            productsId += "," + idProduct;
        }else {
            productsId = productsId;
        }
        localStorage.setItem(CAR_PRODUCTO, productsId);
    }
    loadProductCart();
}

async function loadProductCart(){
    const products = await getProductsDB();
 
    //se toma lo obtenido en el local storage y se transforma en array
    const localStorageItems = localStorage.getItem(CAR_PRODUCTO);


    let html = "";

    if(!localStorageItems){

        html = `
        <div class = "cart-product empty">
            <p>Carro de compras vacio</p>
        </div>
        
        `;

    }else {
        const idProductsSplit = localStorageItems.split(",");

    //eliminar ids duplicados, no se por que vienen duplicados
    const idProductsCart = Array.from(new Set(idProductsSplit));
    idProductsCart.forEach( id => {
        products.forEach(product => {
            if(id == product.id){
                const quantity = countDuplicatesId(id, idProductsSplit);
                const totalPrice = product.price * quantity;
                html += `
                <div class = "cart-product">
                    <img src = "${product.image}" alt = "${product.name}" />
                    <div class = "cart-product-info">
                        <span class = "quantity">${quantity}</span>
                        <p>${product.name}</p>
                        <p>${totalPrice.toFixed(2)}</p>
                        <p class = "change-quantity">
                            <button onClick = "desc(${product.id})">-</button>
                            <button onClick = "inc(${product.id})">+</button>
                        </p>
                        <p class = "cart-product-delete">
                            <button onClick = (deleteItem(${product.id}))>Eliminar</button>
                        </p>
                    </div>
                </div>
            `;
            }

        });

    

    });

    }
    document.getElementsByClassName("cart-products")[0].innerHTML = html;
}

function countDuplicatesId(value, arrayIds){
    let count = 0;
    arrayIds.forEach( id => {
        if(value == id){
            count++;
        }
    });
    return count;
}

function deleteItem(productId){
    const idProductCart = localStorage.getItem(CAR_PRODUCTO);
    const arrayProductCart = idProductCart.split(",");
    const resultIdDelete = deleteAllIds(productId, arrayProductCart);

    if(resultIdDelete){
       let count = 0;
       let idString ="";

       resultIdDelete.forEach( id => {
           count++;
           if(count < resultIdDelete.length){
            idString += id + ",";
           }else{
               idString += id;
           }
           
       });
       localStorage.setItem(CAR_PRODUCTO, idString);
    }
    // para verificar si tiene valores
    const tieneValores = localStorage.getItem(CAR_PRODUCTO);
    if(!tieneValores){
        localStorage.removeItem(CAR_PRODUCTO);
    }

    loadProductCart();
}

function deleteAllIds(id, arraysIds){
    return arraysIds.filter( itemId => {
        return itemId != id; 
    });
}

function inc(id){
    const idProductCart = localStorage.getItem(CAR_PRODUCTO);
    const arrayProductCart = idProductCart.split(",");
    arrayProductCart.push(id);
       let count = 0;
       let idString ="";

       arrayProductCart.forEach( id => {
           count++;
           if(count < arrayProductCart.length){
            idString += id + ",";
           }else{
               idString += id;
           }
           
       });
       localStorage.setItem(CAR_PRODUCTO, idString);
    

    loadProductCart();
}

function desc(id){
    /*
    const idProductCart = localStorage.getItem(CAR_PRODUCTO);
    const arrayProductCart = idProductCart.split(",");
    
    const deleteItem = id.toString();

    let index = arrayProductCart.indexOf(deleteItem);
    if(index > -1){
        arrayProductCart.splice(index, 1);
    }

    let count = 0;
    let idString ="";

       arrayProductCart.forEach( id => {
           count++;
           if(count < arrayProductCart.length){
            idString += id + ",";
           }else{
               idString += id;
           }

       });*/

//    localStorage.setItem(CAR_PRODUCTO, idString); 
    
    const idProductCart = localStorage.getItem(CAR_PRODUCTO);
    const arrayProductCart = idProductCart.split(",");
    arrayProductCart.pop(id);
       let count = 0;
       let idString ="";

       arrayProductCart.forEach( id => {
           count++;
           if(count < arrayProductCart.length){
            idString += id + ",";
           }else{
               idString += id;
           }
           
       });
       localStorage.setItem(CAR_PRODUCTO, idString);

    // para verificar si tiene valores
    
//    const tieneValores = localStorage.getItem(CAR_PRODUCTO);
/*const tieneValores = localStorage.getItem(CAR_PRODUCTO);
if(tieneValores === null){
    localStorage.removeItem(CAR_PRODUCTO);
}*/
    loadProductCart();
}
