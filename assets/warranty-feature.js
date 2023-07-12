let isTemplateProduct = window.globalVariables.isTemplateProduct;
class WarrantyFeature extends HTMLElement {
    constructor() {
        super();
        this.cartElement = document.querySelector('ajax-cart');
        const zipCodeForm =  document.querySelector(".zip-code-form button");
        if(zipCodeForm) zipCodeForm.addEventListener("click", this.zipCodeSubmitHandler.bind(this));
        this.popupZipCode = document.querySelector("#PopupModal-zipCode");
        if (this.popupZipCode) this.popupModel = this.popupZipCode.querySelector(".modal");
        document.addEventListener("DOMContentLoaded", this.showZipCodePopup.bind(this));
        
    }

  /**
   * Warranty Feature Check Zip Code Value and Set It As Cookies
   *
   * @param {evt} Event instance
   */
  async zipCodeSubmitHandler(evt){
    let _this = this;
    const allLocalZipCodes = window.globalVariables.zip_codes;
    let zipCodeInput = this.querySelector('[name="zip-code"]');
    let zipCodeValue =  null;
    if(zipCodeInput) zipCodeValue = zipCodeInput.value.trim();
    if(zipCodeValue != ""){
    setTimeout(()=>{
      _this.addProduct(evt, zipCodeValue);
    }, 2000);
    document.querySelector(".error_msg").classList.add("d-none");
  }
  else{
    document.querySelector(".error_msg").classList.remove("d-none");
  }
}

 /**
   * Add product.
   *
   * @param {evt} Event instance
   */
 async addProduct(evt, zipCodeValue) {
  let _this = this;
  console.log(_this.popupModel);
    evt.preventDefault();
    let addItems = [];
    console.log(isTemplateProduct);
    if(isTemplateProduct == true){
      let productForm = document.querySelector('.product-form form');
      let submitButton = productForm.querySelector('[type="submit"]');
       submitButton.setAttribute('disabled', true);
       submitButton.classList.add('loading');
       let mainProductId = productForm.querySelector('[name="id"]').value;
       let mainProductHandle = productForm.dataset.handle;
       addItems.push(JSON.parse(serializeForm(productForm)));
       const allLocalZipCodes = window.globalVariables.zip_codes;
       const warrantyForm = document.querySelector(".warranty_product");
       let variantId = warrantyForm.dataset.variantId;
       if(allLocalZipCodes.indexOf(zipCodeValue) === -1 )
       {
        document.querySelector(".warrenty-success").classList.add("d-none");
        let quantity = [];
        let cartItems = window.globalVariables.cart.items;
        const warrantyProductHandle =[];
        for (let j = 0; j < cartItems.length; j++) {
          if (cartItems[j].properties && cartItems[j].properties["main-product-handle"]) {
            warrantyProductHandle.push(cartItems[j].properties["main-product-handle"]);
          }
        }
        if (warrantyProductHandle.length > 0 || warrantyProductHandle != 'undefined' ) {
             if(warrantyProductHandle.includes(mainProductHandle))
             {
              quantity.push("0");
             }
         }  
         else{
          quantity.push("1");
         }
        console.log(quantity);
        if(warrantyForm){
               if(variantId){
                 let addOnJSON = {
                   id: variantId,
                   quantity:quantity[0],
                   properties: {
                       'main-product': mainProductId,
                       "main-product-handle" : mainProductHandle
                     }
                 }
                 addItems.push(addOnJSON);
            }
         }
       }
       else if(allLocalZipCodes.indexOf(zipCodeValue) >= 0 ){
        console.log("0 index");
         document.querySelector(".warrenty-success").classList.remove("d-none");
         console.log(variantId);
         const data = JSON.stringify({
           id: variantId,
           quantity: 0
         });
         if (warrantyForm) {
           fetch(`${routes.cart_change_url}`, {
             method: "POST",
             body: data,
             headers: {
               "Content-Type": "application/json"
             }
           })
             .then((response) => response.json())
             .then((responseData) => {
             })
             .catch((error) => {
               console.error(error);
             });
         }
      }
   
       const body = JSON.stringify({
        items: addItems
      });
      console.log(addItems);

      fetch(`${routes.cart_add_url}`, { ...fetchConfig(), body })
        .then((response) => response.json())
        .then(() => {
          if(document.querySelector('#PopupModal-quickshop')){
            document.querySelector('#PopupModal-quickshop .close-quickshop').dispatchEvent(new Event('click'))
          }
          this.cartElement.getCartData('open_drawer');
          document.body.classList.remove('overflow-hidden');
          _this.popupModel.classList.remove('open');
          siteOverlay.prototype.hideOverlay();
          Utility.removeTrapFocus();
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          submitButton.classList.remove('loading');
          submitButton.removeAttribute('disabled');
        });
     }

    let checkWarrantyCheckbox = Utility.getCookie("warranty-checkbox");
    if(checkWarrantyCheckbox){
      _this.addWarrantyProduct(zipCodeValue);
    }
  }

  async addWarrantyProduct(zipCodeValue){
    let addItems = [];
    let _this = this;
    let checkWarrantyProductId = Utility.getCookie("warranty-product-id");
    let checkWarrantyProductHandle = Utility.getCookie("warranty-product-handle");
    console.log(checkWarrantyProductHandle);
    let mainProductId = checkWarrantyProductId;
    let mainProductHandle = checkWarrantyProductHandle;
    const allLocalZipCodes = window.globalVariables.zip_codes;
    const warrantyForm = document.querySelector(".warranty_product");
    let variantId = warrantyForm.dataset.variantId;
    if(allLocalZipCodes.indexOf(zipCodeValue) === -1 )
    {
     document.querySelector(".warrenty-success").classList.add("d-none");
     let quantity = [];
     let cartItems = window.globalVariables.cart.items;
     const warrantyProductHandle =[];
     for (let j = 0; j < cartItems.length; j++) {
       if (cartItems[j].properties && cartItems[j].properties["main-product-handle"]) {
         warrantyProductHandle.push(cartItems[j].properties["main-product-handle"]);
       }
     }
     if (warrantyProductHandle.length > 0 || warrantyProductHandle != 'undefined' ) {
          if(warrantyProductHandle.includes(mainProductHandle))
          {
           quantity.push("0");
          }
      }  
      else{
       quantity.push("1");
      }
     if(warrantyForm){
            if(variantId){
              let addOnJSON = {
                id: variantId,
                quantity:quantity[0],
                properties: {
                    'main-product': mainProductId,
                    "main-product-handle" : mainProductHandle
                  }
              }
              addItems.push(addOnJSON);
         }
      }
    }
    else if(allLocalZipCodes.indexOf(zipCodeValue) >= 0 ){
      document.querySelector(".warrenty-success").classList.remove("d-none");
      const data = JSON.stringify({
        id: variantId,
        quantity: 0
    });
      if (warrantyForm) {
        fetch(`${routes.cart_change_url}`, {
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then((response) => response.json())
          .then((responseData) => {
          })
          .catch((error) => {
            console.error(error);
          });
      }
   }

    const body = JSON.stringify({
      items: addItems
    });
    

    fetch(`${routes.cart_add_url}`, { ...fetchConfig(), body })
      .then((response) => response.json())
      .then(() => {
        if(document.querySelector('#PopupModal-quickshop')){
          document.querySelector('#PopupModal-quickshop .close-quickshop').dispatchEvent(new Event('click'))
        }
        this.cartElement.getCartData('open_drawer');
        document.body.classList.remove('overflow-hidden');
        _this.popupModel.classList.remove('open');
        siteOverlay.prototype.hideOverlay();
        Utility.removeTrapFocus();
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
      });
  }


  async showZipCodePopup(){
    Utility.removeCookie("warranty-checkbox");
    Utility.removeCookie("warranty-product-id");
    Utility.removeCookie("warranty-product-handle");
    document.addEventListener("change", function(event) {
      if (event.target.matches("[data-cart-form] [name=warranty]")) {
        var clickedItem = event.target;
        Utility.setCookie("warranty-checkbox" , clickedItem.checked);
        Utility.setCookie("warranty-product-id" , clickedItem.value);
        Utility.setCookie("warranty-product-handle" , clickedItem.dataset.handle);
        let popupZipCode = document.querySelector("#PopupModal-zipCode");
        if(popupZipCode){
        let popupModel = popupZipCode.querySelector(".modal");
        if (clickedItem.checked) {
          console.log("clicked");
          popupModel.classList.add('open');
                  siteOverlay.prototype.showOverlay();
                  Utility.trapFocus(popupModel);
                  Utility.forceFocus(popupModel.querySelector('[id^="ModalClose-"]'));
        }
       }
      }
    });
  }

}

customElements.define('feature-waranty', WarrantyFeature);