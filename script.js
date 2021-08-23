const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);
let modalQt = 1;
let cart = [];
let modalKey= 0;


pizzaJson.map((item, index) => {
  let pizzaItem = c(".models .pizza-item").cloneNode(true);
  //preencher as informações em pizza item e mostrar na tela
  
  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = 'R$ ' + item.price.toFixed(2);
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
  pizzaItem.querySelector('a').addEventListener('click', (e)=>{
    e.preventDefault();
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
   //variavel criada para guardar a qtd de pizzas
    modalQt = 1;
    //variavel criada para guardar o id da pizza
    modalKey = key;

      
    c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    c('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    c('.pizzaBig img').src = pizzaJson[key].img;
    c('.pizzaInfo--pricearea .pizzaInfo--actualPrice').innerHTML = 'R$ ' + pizzaJson[key].price.toFixed(2);
   //resetar modal para sempre abrir padronizado
    c('.pizzaInfo--size.selected').classList.remove('selected');
   
  cs('.pizzaInfo--size').forEach((size,sizeindex)=>{

  if(sizeindex == 2){
    size.classList.add('selected');
  }
  cs('.pizzaInfo--size span')[sizeindex].innerHTML = pizzaJson[key].sizes[sizeindex];
  });

  c('.pizzaInfo--qt').innerHTML = modalQt;

    c('.pizzaWindowArea').style.opacity = 0;
    c('.pizzaWindowArea').style.display = 'flex';
    setTimeout(()=>{
      c('.pizzaWindowArea').style.opacity = 1;
    },200);
    
  });
  c('.pizza-area').append(pizzaItem);

});

//Eventos do Modal

function closeModal() {
  c('.pizzaWindowArea').style.opacity = 0;
  setTimeout (() =>{
    c('.pizzaWindowArea').style.display = 'none';
  }, 500);
}
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=>{
  item.addEventListener('click',closeModal)
})
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
  if (modalQt > 1){
    modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt;
    console.log(modalQt);
  } else{
    closeModal();
  }

});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
  modalQt++;
  c('.pizzaInfo--qt').innerHTML = modalQt;

});

cs('.pizzaInfo--size').forEach((size, sizeindex)=>{
  size.addEventListener('click', (e) =>{
    c('.pizzaInfo--size.selected').classList.remove('selected');
  size.classList.add('selected');
  });
});

cs('.pizzaInfo--size').forEach((size, sizeindex)=>{
  size.addEventListener('click', (e) =>{
    c('.pizzaInfo--size.selected').classList.remove('selected');
  size.classList.add('selected');
  });
});
//carrinho de compras
c('.pizzaInfo--addButton').addEventListener('click',()=>{
  //Criada variavel tipo array para reunir as informações da pizza
  //informações necessárias: qual pizza? adicionada variavel para guardar o id
  //tamanho? buscar pela classe selecionada
  let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
  //quantidade já existe a variavel modalQt
  
  let identifier = pizzaJson[modalKey].id+'@'+size;

  let key = cart.findIndex((item)=>{
    return item.identifier == identifier
  });

  if (key > -1){
    
    cart[key].qt += modalQt;

  }else{

    cart.push({
     identifier,
      id: pizzaJson[modalKey].id,
      size,
     qt: modalQt
    });
  }
  updateCart();
  closeModal();

});
c('.menu-openner').addEventListener('click', ()=>{
  if(cart.length > 0){
    c('aside').style.left = '0';
  }
});
c('.menu-closer').addEventListener('click', ()=>{
  c('aside').style.left = '100vw';
})

function updateCart(){
  c('.menu-openner span').innerHTML = cart.length;
  
  if(cart.length > 0){
    c('aside').classList.add('show');
    //zerar o carrinho de compras
    c('.cart').innerHTML = '';

    //criar variavei para calculos antes do for
    let subTotal = 0;
    let desconto = 0;
    let total = 0;

    for(let i in cart) {
      let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
      subTotal += pizzaItem.price * cart[i].qt;
      let cartItem = c('.models .cart--item').cloneNode(true);
     //Criar variavel para receber nome e tamanho da pizza
     
     let pizzaSizeName;
     switch(cart[i].size){
       case 0:
          pizzaSizeName = 'P';
          break;
        case 1:
          pizzaSizeName = 'M';
          break;
        case 2:
          pizzaSizeName = 'G';
          break;
 
     }

     let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
     
      //adcionar os itens
      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{

        if(cart[i].qt > 1){
          cart[i].qt--;
        }else{
          cart.splice(i , 1);
        }
          updateCart();
        

      });
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
        cart[i].qt++;
        updateCart()
    });

      c('.cart').append(cartItem);
              
      
     }
     desconto = subTotal * 0.1;
     total = subTotal - desconto;

     c('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
     c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
     c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    c('aside').classList.remove('show');
    c('aside').style.left = '100vw';
  }

}

