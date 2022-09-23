/**
 * A: xử lý Blur
 * B: xử lý tránh ghi đè func
 * C: xử lý đăng ký
 */
function Validator(options){

    var selectorRules = {}; //B - 1. Đặt biến lưu tất cả Rule để không bị ghi đè func
    
    //Get Parent của attribute
    function getParent(element, selector){
        while(element.parentElement){ //Lặp vô hạn đến khi gặp parent
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }

            element = element.parentElement;
        }
    }

    //Tách riêng hàm kiểm tra input
    function validate(inputElement, rule){
        //Bỏ giá trị ng dùng nhập vào func test()
        // var errMessage = rule.test(inputElement.value); //Thực thi rule
        
        //Đặt biến errE = input trỏ -> E cha -> lấy E con
        // var errElement = inputElement.parentElement.querySelector('.form-message')
        var errElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errMessage;

        
        //B - 3. Lấy ra các rules & lặp qua các rule
        var rules = selectorRules[rule.selector]
       
        for(var i =0 ; i<rules.length; i++){
            errMessage = rules[i](inputElement.value); 
            if(errMessage) 
                break;
        }

        // console.log(rule.selector) //Lấy id khi blur
        // console.log(rules) //Lấy rule khi blur

        //Nếu nhập vào sai thì báo lỗi
        if(errMessage){
            errElement.innerText = errMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        }   
        //Nếu nhập vào đúng hoặc chuỗi rỗng
        else{
            errElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        //C - 3. Return lỗi. !! convert -> boolean
        return !errMessage;

    }
// ---------------------------------------------------------//

    //Get element của form
    var formElement = document.querySelector(options.form);

    if(formElement){

        //Nút đăng ký
        formElement.onsubmit = function(e){
            e.preventDefault();

            var isFormValid = true;

            //C - 1. Lặp qua từng rule và validate
            options.rules.forEach(function (rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                
                //Nếu có 1 cái k đúng
                if(!isValid){
                    isFormValid = false;
                }
            });

            //C - 2. Kiểm tra form (Submit với Javascript )
            if(isFormValid){
                if(typeof options.onSubmit === 'function'){
                    //Lấy Nodelist các e input
                    var Inputs = formElement.querySelectorAll('[name]:not([disable]');

                    //Nên phải convert -> arr để reduce
                    var formValues = Array.from(Inputs).reduce(function (values, input){
                        //gán input.value cho object values && return 
                        values[input.name] = input.value
                        return values;
                    }, {});
                    
                    options.onSubmit(formValues);
                }
            } //Submit với hành vi mặc định HTML
            else{
                // formElement.submit();
            }
        }

        //Duyệt qua từng phần tử trong rules
        options.rules.forEach(function (rule){

            // selectorRules[rule.selector] = rule.test;
            // console.log(selectorRules[rule.selector]) //Lúc này object trả ra mảng undefined vì chưa gán test()
            
            //B - 2. Lưu lại các rule cho mỗi input
            //Nếu là mảng thì push test()
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }
            //Nếu k phải là mảng thì gán mảng test()
            else{
                selectorRules[rule.selector] = [rule.test];
            }

            //Get E của form input
            var inputElement = formElement.querySelector(rule.selector);

            if(inputElement){
                //A - 1. Xử lý blur ra khỏi form nhập
                inputElement.onblur = function(){
                    validate(inputElement, rule);
                }

                //A - 2. Xử lý khi nhập vào input thì xóa validate
                inputElement.oninput = function(){
                    var errElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
                    errElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            }
        });
        // console.log(selectorRules); //Lấy dc object các rule
    }
}

//  ------------Các rules----------------------------------------------------//
Validator.isRequired = function(selector){
    return{
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : 'Vui lòng nhập trường này'

        }
    }
}

Validator.isEmail = function(selector){
    return {
        selector: selector,
        //js email regex
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Vui lòng nhập đúng email'
        }}
}

Validator.minLength = function(selector){
    return {
        selector: selector,
        //js password regex
        test: function(value){
            var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
            return regex.test(value) ? '' : 'Mật khẩu phải trên 8 ký tự, bao gồm 1 chữ thường, 1 in hoa và 1 chữ số'
        }}
}

Validator.isPassConfirm = function(selector, getComfirmValue, message){
    return {
        selector: selector,
        //js password regex
        test: function(value){
            return value === getComfirmValue() ? '' : message || 'Giá trị nhập vào không đúng'
}
}}
