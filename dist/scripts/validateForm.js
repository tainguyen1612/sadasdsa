"use strict";var list=JSON.parse(localStorage.getItem("data"));function postData(e){var t=new XMLHttpRequest;t.open("POST","http://localhost:3000/paymentInfo",!0),t.setRequestHeader("Content-Type","application/json"),t.send(JSON.stringify(e))}function validateForm(r){var n=document.querySelector(r.form);function o(e,t){var n=e.parentElement.querySelector(r.errorSelector),t=t.test(e.value);return t?(n.innerText=t,e.parentElement.classList.add("errors")):(n.innerText="",e.parentElement.classList.remove("errors")),!t}n&&(n.onsubmit=function(e){e.preventDefault();var t=!0;r.rules.forEach(function(e){o(n.querySelector(e.input),e)||(t=!1)}),t?1==confirm("Bạn đồng ý thành toán")&&(e=n.querySelectorAll("[name]:not([disabel])"),(e=Array.from(e).reduce(function(e,t){return(e[t.name]=t.value)&&e},{})).product=list,postData(e),n.reset(),localStorage.clear(),window.location.href="jewelry.html"):alert("có lỗi")},r.rules.forEach(function(e){var t=n.querySelector(e.input);t&&(t.onblur=function(){o(t,e)},t.oninput=function(){t.parentElement.querySelector(r.errorSelector).innerText="",t.parentElement.classList.remove("errors")})}))}validateForm.isRequire=function(e){return{input:e,test:function(e){return e.trim()?void 0:"Bạn chưa nhập giá trị !!!"}}},validateForm.isEmail=function(e){return{input:e,test:function(e){if(""==e)return"Bạn chưa nhập giá trị !!!";return/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e)?void 0:"Vui lòng nhập đúng Email !!!"}}},validateForm.isPhone=function(e){return{input:e,test:function(e){if(""==e)return"Bạn chưa nhập giá trị !!!";return/((09|03|07|08|05)+([0-9]{8})\b)/g.test(e)?void 0:"Vui lòng nhập đúng Phone !!!"}}};