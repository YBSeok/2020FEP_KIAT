

//===========================
//Main Page
//===========================

let products = [];
let cart = [];

$.get('store.json').then((data)=>{

  products = data.products;

  //Main page
  data.products.forEach((a, i) => {
    $('.product-list').append(`
      <div class="col-md-3">
        <div class="item" draggable="true" data-id="${a.id}">
          <img src="${a.photo}">
          <h4>${a.title}</h4>
          <h4>${a.brand}</h4>
          <p>가격 : ${a.price}</p>
          <button class="add" data-id="${a.id}">담기</button>
        </div>
      </div>`)
  });


  //========================
  //ADD Button
  //========================

  $('.add').click(function(e){

    let productId = e.target.dataset.id;

    let 몇번째 = cart.findIndex((a)=>{ return a.id == productId })

    if (몇번째 == -1) {
      let 현재상품 = products.find((a)=> { return a.id == productId });
      현재상품.count = 1;
      cart.push(현재상품);
    } else {
      cart[몇번째].count++;
    }

    $('.basket').html('');
    cart.forEach((a, i)=>{
      $('.basket').append(`
        <div class="col-md-3 bg-white">
          <img src="${a.photo}">
          <h4>${a.title}</h4>
          <h4>${a.brand}</h4>
          <p>${a.price}</p>
          <input type="number" value="${a.count}" class="item-count w-100">
        </div>
      `);
    });

    가격계산();

    $('.item-count').on('input', function(){
      가격계산();
    });

    
  });




  //===================
  //drag and drop event
  //===================


  $('.item').on('dragstart', function(e){
    e.originalEvent.dataTransfer.setData('id', e.target.dataset.id);
  });

  $('.basket').on('dragover', function(e){
    e.preventDefault();
  });

  $('.basket').on('drop', function(e){

    let productId = e.originalEvent.dataTransfer.getData('id');
    $('.add').eq(productId).click();
  });

  



});






//===========================
//Total Price
//===========================


function 가격계산(){
  
  let finalPrice = 0;
  
  for (let i = 0; i < $('.item-count').length; i++){
    var price = $('.item-count').eq(i).val();
    var count = $('.item-count').eq(i).siblings('p').text();
    finalPrice += parseFloat(price * count);
  }

  $('.final-price').html('합계 ' + finalPrice)
}
     



//===========================
//Receipt
//=========================== 

 

$('.buy').click(function(){
  $('.modal1').css('display', 'block');

});

let 성함 = '';
let 연락처 = '';

$('#name').on('input', function(){
  성함 = $('#name').val();
});

$('#phone').on('input', function(){
  연락처 = $('#phone').val();
});

$('.show-receipt').click(function(){
  $('.modal1').css('display', 'none');
  $('.modal2').css('display', 'block');

  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  c.font = '16px dotum';
  c.fillText('구매자 : ' + 성함, 20, 30);
  c.fillText('연락처 : ' + 연락처, 20, 60); 
  c.fillText($('.final-price').html(), 20, 90); 

  
})






//===========================
//Search
//=========================== 

$('#search').on('input', function(){
  let 검색어 = $('#search').val();
  
  let newProducts = products.filter((a)=>{
    return a.title.includes(검색어) || a.brand.includes(검색어)
  });

  $('.product-list').html('');
  newProducts.forEach((a, i) => {
    $('.product-list').append(`
      <div class="col-md-3">
        <img src="">
        <h4>${a.title}</h4>
        <h4>${a.brand}</h4>
        <p>가격 : ${a.price}</p>
        <button class="add" data-id="${a.id}">담기</button>
      </div>`)
  });

  $('.product-list h4').each(function(i, html요소){
    let title = html요소.innerHTML;
    title = title.replace(검색어, `<span style="background : yellow">${검색어}</span>`);

    html요소.innerHTML = title;
  })
});


//===========================
//Close Modal
//===========================

$('.close').click(function(e){
  $(e.target).parents('.modal1').css('display', 'none');
  $(e.target).parents('.modal2').css('display', 'none');
});


