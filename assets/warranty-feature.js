
// class WarrantyFeature extends HTMLElement {
//     constructor() {
//         super();
//         // document.querySelector(".zip-code-form button").addEventListener("click", this.zipCodeSubmitHandler.bind(this));
//         this.popupWarranty = document.querySelector("#PopupModal-warrantyProduct");
//         if(this.popupWarranty) this.popupModel = this.popupWarranty.querySelector(".modal");
//         this.cartElement = document.querySelector('ajax-cart');
//     }

//   /**
//    * Zip Code Submit Event
//    *
//    * @param {evt} Event instance
//    */

//     async zipCodeSubmitHandler(){
//         let _this = this;
//         const allLocalZipCodes = window.globalVariables.zip_codes;
//         let zipCodeInput = this.querySelector('[name="zip-code"]');
//         let zipCodeValue = null
//         if(zipCodeInput) zipCodeValue = zipCodeInput.value;
//         console.log(allLocalZipCodes.indexOf(zipCodeValue));
        
//         if(allLocalZipCodes.indexOf(zipCodeValue) === -1 )
//         {
//           _this.showWarrentyPopup(); 
//           document.querySelector(".warrenty-details").classList.add("d-none");
//         }
//         else{
//           _this.addProduct();
//           document.querySelector(".warrenty-details").classList.remove("d-none");
//           document.querySelector(".current_zip_code").innerHTML = zipCodeValue;
//           document.querySelector(".change_zip_code").classList.add("d-none");
//         }
//     }


//    /**
//    * Show Warranty Popup
//    *
//    * @param {evt} Event instance
//    */
//     async showWarrentyPopup() {
//         if(this.popupWarranty) {
//             if(this.popupModel) {
//                 this.popupModel.classList.add('open');
//                 siteOverlay.prototype.showOverlay();
//                 Utility.trapFocus(this.popupModel);
//                 Utility.forceFocus(this.popupModel.querySelector('[id^="ModalClose-"]'));
//                 const warrantyForm = document.querySelector(".warranty-form");
//                 console.log(warrantyForm);
//                 let variantSwatch = warrantyForm.querySelectorAll('.variant_wrappers span');
//                 variantSwatch.forEach((variant)=>{
//                 variant.addEventListener("click" , function(){
//                   let variantId = this.dataset.variantId;
//                   console.log(variantId);
//                   document.querySelector("#currentVariant").value = variantId;
//                   this.classList.add("active");
//                   var siblings = this.parentNode.children;
//                   // Remove the class from the siblings
//                  for (var i = 0; i < siblings.length; i++) {
//                  if (siblings[i] !== this) {
//                         siblings[i].classList.remove("active");
//                     }
//                   }
//                  });
//               });
//              document.querySelector(".warranty-form").addEventListener("submit" , this.addProduct.bind(this));
//             }
//         }
//     }
    
//     /**
//    * Add product.
//    *
//    * @param {evt} Event instance
//    */
//     async addProduct(evt) {
//     evt.preventDefault();
//     let productForm = document.querySelector('.product-form form');
//     console.log(productForm);
//     console.log("sumit");
//     const addItems = [];
//     const submitButton = productForm.querySelector('[type="submit"]');
//     submitButton.setAttribute('disabled', true);
//     submitButton.classList.add('loading');

//     // warranty product get data //
//     addItems.push(JSON.parse(serializeForm(productForm)))

//     const warrantyForm = document.querySelector(".warranty-form");
//     if(warrantyForm){
//         let currentVariantId = document.querySelector("#currentVariant").value;
//         if(currentVariantId){
//           let addOnJSON = {
//             id: currentVariantId,
//             quantity:1
//           }
//           addItems.push(addOnJSON);
//         }
//     }

//     const body = JSON.stringify({
//       items: addItems
//     });


//     fetch(`${routes.cart_add_url}`, { ...fetchConfig(), body })
//       .then((response) => response.json())
//       .then(() => {
//         if(document.querySelector('#PopupModal-quickshop')){
//           document.querySelector('#PopupModal-quickshop .close-quickshop').dispatchEvent(new Event('click'))
//         }
//         this.cartElement.getCartData('open_drawer');
//         document.body.classList.remove('overflow-hidden');
//         this.popupModel.classList.remove('open');
//         siteOverlay.prototype.hideOverlay();
//         Utility.removeTrapFocus();
//       })
//       .catch((e) => {
//         console.error(e);
//       })
//       .finally(() => {
//         submitButton.classList.remove('loading');
//         submitButton.removeAttribute('disabled');
//       });
//   }
//  /**
//    * Submit Bundel Product.
//    *
//    * @param {evt} Event instance
//    */
// }

// customElements.define('zip-code', WarrantyFeature);