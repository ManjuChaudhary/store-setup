
class WarrantyFeature extends HTMLElement {
    constructor() {
        super();
        // document.querySelector(".zip-code-form button").addEventListener("click", this.zipCodeSubmitHandler.bind(this));
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
      _this.addProduct(evt);
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
 async addProduct(evt) {
  let _this = this;
  console.log(_this.popupModel);
    evt.preventDefault();
    let productForm = document.querySelector('.product-form form');
    let checkWarrantyCheckbox = Utility.getCookie("warranty-checkbox");
    let checkWarrantyProductId = Utility.getCookie("warranty-product-id");
    let checkWarrantyProductHandle = Utility.getCookie("warranty-product-handle");
    let mainProductId;
    let mainProductHandle;
    if(checkWarrantyCheckbox){
     mainProductId = checkWarrantyProductId;
     mainProductHandle = checkWarrantyProductHandle;
    }
    else{
      mainProductId = productForm.querySelector('[name="id"]').value;
      mainProductHandle = productForm.dataset.handle;
    }
    console.log(mainProductHandle);
    const addItems = [];
    const submitButton = productForm.querySelector('[type="submit"]');
    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('loading');
 
    addItems.push(JSON.parse(serializeForm(productForm)))

    const allLocalZipCodes = window.globalVariables.zip_codes;
    let zipCodefiled = document.querySelector('[name="zip-code"]');
    let zipCode = zipCodefiled.value;
    const warrantyForm = document.querySelector(".warranty_product");
    let variantId = warrantyForm.dataset.variantId;
    if(allLocalZipCodes.indexOf(zipCode) === -1 )
    {
     document.querySelector(".warrenty-success").classList.add("d-none");
     if(warrantyForm){
            if(variantId){
              let addOnJSON = {
                id: variantId,
                quantity:1,
                properties: {
                    'Main Product': mainProductId,
                    "Main Product Handle" : mainProductHandle
                  }
              }
              addItems.push(addOnJSON);
         }
      }
    }
    else if(allLocalZipCodes.indexOf(zipCode) >= 0 ){
      document.querySelector(".warrenty-success").classList.remove("d-none");
      const data = JSON.stringify({
        id: variantId,
        quantity: 0
    });
      if (warrantyForm) {
        fetch(routes.cart_change_url, {
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
        submitButton.classList.remove('loading');
        submitButton.removeAttribute('disabled');
      });
  }

  async showZipCodePopup(){
    Utility.removeCookie("warranty-checkbox");
    Utility.removeCookie("warranty-product-id");
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