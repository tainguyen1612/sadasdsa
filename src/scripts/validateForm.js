let list = JSON.parse(localStorage.getItem('data'));

function postData(data) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://localhost:3000/paymentInfo", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));
}

function validateForm(option) {
    const formValidate = document.querySelector(option.form);
    // ham thu hien validate
    function validate(inputElement , rule) {
        const errorElement = inputElement.parentElement.querySelector(option.errorSelector);
        const errorMes = rule.test(inputElement.value);

        if(errorMes) {
            errorElement.innerText = errorMes;
            inputElement.parentElement.classList.add('errors')
        } else {
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove('errors')
        }

        return !errorMes;
    }
    //  lấy element của form cần validate
    if(formValidate) {
        formValidate.onsubmit = (e) => {
            e.preventDefault();
            let isFormValid = true;
            // lap qua tung rule va validate
            option.rules.forEach((rule) => {
                const inputElement = formValidate.querySelector(rule.input);
                let isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false
                }
            });

            if(isFormValid) {
                if(confirm("Bạn đồng ý thành toán") == true) {
                    let dataInput = formValidate.querySelectorAll("[name]:not([disabel])");
                    let customer = Array.from(dataInput).reduce((value,dataInput) => { return (value[dataInput.name] = dataInput.value) && value }, {})
                    customer.product = list;
                    postData(customer);
                    formValidate.reset();
                    localStorage.clear();
                    window.location.href = "jewelry.html";
                };
            } else {
                alert("có lỗi");
            };
        };

        option.rules.forEach((rule) => {
            const inputElement = formValidate.querySelector(rule.input);

            if(inputElement) {
                inputElement.onblur = () => {
                    validate(inputElement, rule);
                };

                inputElement.oninput = () => {
                    const errorElement = inputElement.parentElement.querySelector(option.errorSelector);
                    errorElement.innerText = "";
                    inputElement.parentElement.classList.remove('errors')
                };
            };
        });
    };
};

validateForm.isRequire = function (input) {
    return {
        input: input,
        test: function(value) {
            return value.trim() ? undefined : "Bạn chưa nhập giá trị !!!";
        }
    }
}

validateForm.isEmail = function (input) {
    return {
        input: input,
        test: function(value) {
            if(value != "") {
                const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return regexEmail.test(value) ? undefined : "Vui lòng nhập đúng Email !!!";
            }else {
                return "Bạn chưa nhập giá trị !!!"
            }
        }
    }
}

validateForm.isPhone = function (input) {
    return {
        input: input,
        test: function(value) {
            if(value != "") {
                const regexPhone = /((09|03|07|08|05)+([0-9]{8})\b)/g;
                return regexPhone.test(value) ? undefined : "Vui lòng nhập đúng Phone !!!";
            }else {
                return "Bạn chưa nhập giá trị !!!"
            }
        }
    }
}
