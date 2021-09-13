window.onload = function() {
    let data = null;
    let dataFilter = null;

    function loadAjax() {
        var xmlhttp = new XMLHttpRequest();
        var url = "http://localhost:3000/product";
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(this.responseText);
                getDataLocal();
                loadProduct(data);
                loadFilter();
                showCart();
                detailCart();
                pagination();
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send(); 
    }
    loadAjax();

    // localstore variable
    let id = 0;
    let list=[];
    let store;
    let obj;
    // pagination variable
    let perPage = 6;
    let currentPage = 1;
    let start = 0;
    let end = perPage;
    let totalPage;
    
    function getDataLocal() {
        store = localStorage.getItem('data');
        if(store){
            list = JSON.parse(store);
        } else {
            list = [];
        }
    }

    function loadProduct(data) {
        var item = document.querySelector(".list__row");
        var content = data.map( (item, index) => {
            if (index >= start && index < end) {
                return `<div class="col-lg-4 col-md-6 d-none d-lg-block">
                            <div class="card">
                                <img class="card-img-top" alt="khong co anh" src=${item.img} />
                                <div class="card-body">
                                    <h5 class="card-title">${item.name}</h5>
                                    <h3 class="card-text">${item.type}</h3>
                                    <h3 class="card-text"><span class="me-2">${item.price}đ</span><span class="products__hover">450.000đ</span></h3>
                                </div>
                                <div class="card-footer">
                                    <a class="btn btn-outline-dark" href="/detail.html">MUA HÀNG</a><a class="btn btn-outline-dark cart__add" data-id="${item.id}"><i class="fa fa-heart"></i></a><a class="btn btn-outline-dark" href="#"><i class="fa fa-sync"></i></a>
                                </div>
                            </div>
                        </div>`
            }
        });
        item ? item.innerHTML = content.join("") : "";
        addCart();
    }

    const reloadData = document.querySelector(".list__type__check1");
    reloadData ? reloadData.addEventListener("click",loadAll) : "";
    
    function loadAll() {
        loadProduct(data);
        dataFilter = null;
        pagination();
        sort.value = "0";
    }
  
    function loadFilter() {
        let item = document.querySelector("#flush-collapseOne > ul");

        let cleanData = data.filter( (item, index) => {
            return index === data.findIndex( (el) => {
                return el.type === item.type;
            });
        });

        item ? item.innerHTML = cleanData.map( (item) => {
            return `<li> ${item.type} </li>`;
        }).join('') :  "";
        
        filterProduct();
    }

    function filterProduct() {
        let list = document.querySelectorAll("#flush-collapseOne li");
        
        list ? list.forEach( (element) => {
            element.onclick = () => {
                sort.value = "0";
                const active = document.querySelector(".activeClick");
                active !== null ? active.classList.remove('activeClick') : undefined;
                element.classList.add('activeClick');

                dataFilter = data.filter( (item) => {
                    return item.type === element.innerText;
                });

                loadProduct(dataFilter);
                pagination();
            };
        }) : "";
    }   

    let sort = document.getElementById("sortPrice");
    sort ? sort.addEventListener("change", sortPrice) : "";

    function sortPrice() {
        var selectSort = parseInt(sort.value);
        let sortFilter = null;

        switch(selectSort) {
            case 1:
                sortFilter = [...data] ? [...data].sort( (a,b) => a.price - b.price ) : "";
                loadProduct(sortFilter);
                sortFilter = [...dataFilter] ? [...dataFilter].sort( (a,b) => a.price - b.price ) : "";
                loadProduct(sortFilter);
                break;
            case 2:
                sortFilter = [...data] ? [...data].sort( (a,b) => b.price - a.price ) : "";
                loadProduct(sortFilter);
                sortFilter = [...dataFilter] ? [...dataFilter].sort( (a,b) => b.price - a.price ) : "";
                loadProduct(sortFilter);
                break;
            case 0 :
                loadProduct(data);
                loadProduct(dataFilter);
                break;
        } 
    }

    function pagination() {
        const btnNext = document.querySelector(".page-item:last-child");
        const btnPrev = document.querySelector(".page-item:first-child");

        function getCurrentPage(data, indexPage) {
            start = (indexPage - 1) * perPage;
            end = indexPage * perPage;
            totalPage = Math.ceil(data.length / perPage);
        };
    
        btnNext ? btnNext.addEventListener("click", () => {
            if(dataFilter !== null ){
                getCurrentPage(dataFilter, currentPage);
            }

            currentPage++;

            if(currentPage > totalPage) {
                currentPage = totalPage;
            }

            getCurrentPage(data, currentPage);
            sortPrice();
        }) : "";
    
        btnPrev ? btnPrev.addEventListener("click", () => {            
            if(dataFilter !== null ){
                getCurrentPage(dataFilter, currentPage);
                currentPage--;

                if(currentPage <= 1) {
                    currentPage = 1;
                };
            } else {
                currentPage--;

                if(currentPage <= 1) {
                    currentPage = 1;
                };
                getCurrentPage(data, currentPage);
            }
           
            sortPrice();
        }) : "";
                
        function loadIndexPage() {
            const listPage = document.querySelector(".page__number");

            if(dataFilter !== null) {
                getCurrentPage(dataFilter, currentPage)
            } else {
                getCurrentPage(data, currentPage);
            }

            let content = "";
            content = `<li class="page-item actice"><a class="page-link">${1}</a></li>`

            for (let i = 2; i <= totalPage; i++) {
                content += `<li class="page-item"><a class="page-link">${i}</a></li>`; 
            }

            listPage ? listPage.innerHTML = content : "";
            changeIndexPage();
        }

        loadIndexPage();

        function changeIndexPage() {
            const pageIndex = document.querySelectorAll(".page__number .page-item");

            pageIndex.forEach((element, index) => {
                element ? element.addEventListener("click", () => {
                    document.querySelector('.actice').classList.remove('actice');
                    element.classList.add('actice');

                    let val = index + 1;
                    currentPage = val;
                    
                    if(dataFilter !== null) {
                        getCurrentPage(dataFilter, currentPage)
                    } else {
                        getCurrentPage(data, currentPage);
                    }
                    sortPrice();
                }) : "";
            })
        }
    }

    function addCart() {
        const cart = document.querySelectorAll(".cart__add");
        let cartNumber = document.querySelector(".fa-shopping-cart > span");

        const alertMessage = createNotification({
            closeOnClick: true,
            displayCloseButton: false,
            positionClass: 'nfc-top-right',
            onclick: false,
            showDuration: 3500,
            theme: "success",
        });

        cart.forEach((element) => {
            element ? element.onclick = (e) => {
                id = parseInt(e.currentTarget.getAttribute('data-id'));

                if(list.length===0 || list.every(el => el.id !== data[id-1].id)) {
                    list.push(data[id-1]);
                    showCart();
                    showPrice();
                }else {
                    obj = list.find(el => el.id === data[id-1].id);
                    obj.quantity++;
                    showCart();
                    showPrice(); 
                }

                alertMessage({
                    title: "Thành công",
                    message: "Bạn đã thêm sản phẩm vào giỏ hàng thành công !!"
                });
                localStorage.setItem("data", JSON.stringify(list));
            } : "";
        });

        list.length > 0 ? cartNumber.className = "number__cart" : cartNumber.className = null; 
        cartNumber.innerHTML = list.reduce((count, element) => {return count + element.quantity}, null);
    }
   
    function showCart() {
        const cartItem = document.querySelector(".dropdown__cart ul");
        const cartPay = document.querySelector(".payment__cart ul");
        const footerCart = document.querySelector(".dropdown__cart-total");
        let cartNumber = document.querySelector(".fa-shopping-cart > span");
        
        if(list.length === 0) {
            cartNumber.className = null;
            cartItem.className = null;
            footerCart.style.setProperty('display', 'none', 'important');
        } else{
            cartNumber.className = "number__cart";
            cartItem.className = "dropdown__iconcart";
            footerCart.style.setProperty('display', 'block', 'important');
            cartNumber.innerHTML = list.reduce((count, el) => {return count + el.quantity}, null);
        }
        
        let content = list ? list.map((items) => {
            return `
                <li class="dropdown__cart-item" data-id=${items.id} >
                    <div class="dropdown__box">
                        <div class="dropdown__image">
                            <img src=${items.img} alt="khong co anh"/>
                        </div>
                        <div class="dropdown__content">
                            <h2>${items.name}<br><p class="mt-2">( x ${items.quantity} )</p></h2>
                            <h3>${items.price}<sup>đ</sup></h3>
                        </div>
                        <div class="dropdown__icon">
                            <i class="fa fa-times"></i>
                        </div>
                    </div>
                </li>`
        }) : "";

        cartItem ? cartItem.innerHTML = content.join('') : "";
        cartPay ? cartPay.innerHTML = content.join('') : "";

        showPrice();
        deleteCart();
    }
    
    function showPrice () {
        const totalPrice = document.getElementById("totalPrice");
        const total = document.getElementById("total");

        let content = list ? list.reduce((total,el) => {
            return total + el.price * el.quantity;
        },0) : "";

        totalPrice ? totalPrice.innerHTML = content + `<sup>đ</sup>` : "";
        total ? total.innerHTML = content + `<sup>đ</sup>` : "";
    }

    function deleteCart () {
        const delCart = document.querySelectorAll(".dropdown__icon i");
        let cartNumber = document.querySelector(".fa-shopping-cart > span");

        delCart.forEach((element, index) => {
            element ? element.onclick = () => {
                if(confirm("Bạn thự sựu muốn xoá ?") == true) {
                    list.splice(index, 1);
                    localStorage.setItem('data', JSON.stringify(list));
                    cartNumber.innerHTML = list.reduce((count, el) => {return count + el.quantity}, null);
                    showCart();
                    detailCart();
                };
            } : "";
        })
    }

    function detailCart() {
        const info = document.getElementById("cartInfo");

        const content = list ? list.map((items) => {
            return `
                <tr data-id=${items.id}>
                    <td>
                        <img src=${items.img} alt="shopping cart"/>
                    </td>
                    <td> ${items.name} </td>
                    <td class="cart__price price__default">${items.price}<sup>đ</sup></td>
                    <td>
                        <input class="quantity" type="number" name="quantity" value=${items.quantity} step="1" min=1/>
                    </td>
                        <td class="cart__price price__total">${items.price * items.quantity}<sup>đ</sup></td>
                    <td><a class="fa fa-trash-alt"></a></td>
                </tr>`;
        }) : "";
        
        info ? info.innerHTML = content.join('') : "";
        
        if(list.length == 0) {
            info ? info.innerHTML = `<tr align="center"><td colspan="6">KHÔNG CÓ SẢN PHẨM NÀO CẢ !!!</td></tr>` : "";
        }
        
        changePrice();
        delTableCart();
    }

    function delTableCart() {
        const delTableCart = document.querySelectorAll(".fa-trash-alt");

        delTableCart.forEach((element, index) => {
            element ? element.onclick = () => {
                if(confirm("Bạn thực sư muốn xoá?") == true) {
                    list.splice(index, 1);
                    localStorage.setItem('data', JSON.stringify(list));
                    detailCart();
                    showCart();
                };
            } : "";
        });
    };

    function changePrice() {
        const input = document.querySelectorAll(".quantity");
        const price = document.querySelectorAll(".price__default");
        let total = document.querySelectorAll(".price__total");
        let cartNumber = document.querySelector(".fa-shopping-cart > span");

        input.forEach((element,i) => {
            element ? element.oninput = () => {
                total[i].innerHTML = input[i].value * price[i].innerText.split('').slice(0, price[i].innerText.length-1).join('') + `<sup>đ</sup>`;
                list[i].quantity = parseInt(input[i].value);
                localStorage.setItem("data",JSON.stringify(list));
                showCart();
                cartNumber.innerHTML = list.reduce((count, el) => {return count + el.quantity}, null);
            } : "";
        });
    };

    validateForm({
        form: "#formPayment",
        errorSelector: '.form-text',
        rules: [
            validateForm.isRequire('#inputName'),
            validateForm.isEmail("#inputEmail"),
            validateForm.isRequire('#inputAddress'),
            validateForm.isPhone('#inputPhone'),
        ],
    })
}
