var selectedProduct = [];
var addOnSelectedProducts = [];
var currentVariant;
var quantity;
var addOns = [];
var finalItems;
class productFunnel extends HTMLElement {
    constructor() {
      super();
      this.funnel=document.querySelector('product-funnel');
      this.domEvents();
    }
    
    /**
     * Bind Events On page load
    */
    domEvents = () => {
        this.startSelection = this.querySelectorAll('[data-productSelection]');
        this.startSelection.forEach(button => button.addEventListener('click', this.chooseProduct.bind(this)));
        this.startAddOnSelection = this.querySelectorAll('[data-productAddOnSelection]');
        this.startAddOnSelection.forEach(button => button.addEventListener('click', this.chooseAddOnProduct.bind(this)));
        this.selectQuantity = this.querySelectorAll('[data-productAddOnSelection]');
        this.selectQuantity.forEach(button => button.addEventListener('click', this.chooseQuantity.bind(this)));
        this.nav_steps = this.querySelectorAll(`[data-nav_step]`);
        this.nav_steps.forEach(button => button.addEventListener('click', this._hideShowSteps.bind(this)));
        this.continue = this.querySelectorAll(`[data-continue]`);
        this.continue.forEach(button => button.addEventListener('click', this.continueToNext.bind(this)));
        this.back = this.querySelectorAll(`[data-back]`);
        this.back.forEach(button => button.addEventListener('click', this.continueToPrev.bind(this)));
        this.qtySelector = this.querySelectorAll('[data-qty]');
        this.qtySelector.forEach(button => button.addEventListener('click', this.continueToNext.bind(this)));
        this.add_to_cart=this.querySelector('[data-add_to_cart]');
        this.add_to_cart.addEventListener('click',this.addToCart.bind(this));   
    }
    /**
    * choose Product - step 1 
    * @param {*} event 
    */
    chooseProduct = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        let productJson ;
        
        let proId = event.target.closest('[data-productId]').getAttribute('data-productId');
        productJson =  this.querySelector(`[data-ProductJson="${proId}"]`).innerHTML;
        selectedProduct = JSON.parse(productJson);
        let nextStep = this._findNextStep(event);
        this.displayStep(nextStep);
        this._manageSelection(event,nextStep-1);
        this.manageBreadcrumbs(nextStep);
    }
    
    
    /** Step 1 END */

    /** Step 2 Start 
      * Choose Quantity 
      * @param {*} event 
     */
    chooseQuantity = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        quantity = parseInt(event.target.closest('[data-qty]').getAttribute('data-qty'));
        let nextStep = this._findNextStep(event);
        this.displayStep(nextStep);
        this._manageSelection(event,nextStep-1);
        this.manageBreadcrumbs(nextStep);
    }
      /** Step 2 End **/

     /** Step 3 Start 
      * Choose AddOns Product
      * @param {*} event 
     */
     chooseAddOnProduct = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        let addOnProductJson;
        let proId = event.target.closest('[data-productId]').getAttribute('data-productId');
        addOnProductJson =  this.querySelector(`[data-ProductJson="${proId}"]`).innerHTML;
        addOnSelectedProducts = JSON.parse(addOnProductJson);
        let nextStep = this._findNextStep(event);
        this._manageSelection(event,nextStep-1);
        this.orderSummary();
     }
   /** Step 3 END */

    /** Step 4 Start */
    /**
     * 
     * Order summary
    */
    orderSummary = () => {
        console.log(selectedProduct);
        let sumarrywrap = this.querySelector('[data-Summary]');
        sumarrywrap.querySelector('[data-selectedProductImg]').innerHTML = `<img  src="${selectedProduct.featured_image}" alt="${selectedProduct.title}">
        <h5 class="mb-2 mt-3" data-seleted_product_title>${selectedProduct.title}</h5>`
        if (sumarrywrap.querySelector('[data-selectedQty]') != null) {
            sumarrywrap.querySelector('[data-selectedQty]').innerHTML = `<p>${quantity}</p>`
        }
        if (sumarrywrap.querySelector('[data-selectedPrice]') != null) {
            sumarrywrap.querySelector('[data-selectedPrice]').innerHTML = `${Shopify.formatMoney(selectedProduct.price, window.globalVariables.money_format)}`
        }
    }
    /** Step 4 END */

   
    /** General Methods */
    /**
     * 
     * @param {index} - step index to be displayed 
    */    
    displayStep = (index) => {
        this.querySelectorAll('[data-selector]').forEach ( ele => {
            ele.classList.add('d-none');
        }) 
        this.querySelector(`[data-selector="${index}"]`).classList.remove('d-none');
    }
    /**
     * Manage a breadcrumbs based on selected steps
     * @param {active_ste} = Active step index 
     */
    manageBreadcrumbs = (active_step) => {
        this.querySelectorAll(`.breadcrumbs-funnel [data-nav_step]`).forEach(ele => {
            let step=parseInt(ele.getAttribute('data-nav_step'))
            console.log(step);
            active_step=parseInt(active_step)
            console.log(active_step);
            if (step < active_step || step+1 > active_step ){
              ele.classList.remove('active-step');
            }
            
        })
        this.querySelector(`[data-nav_step="${active_step}"]`).classList.add('active-step');
    }
    /**
     * Go back to previous step
     * @param {*} event 
    */
    _hideShowSteps = (event) => {
        event.stopImmediatePropagation()
        let findSteptoDisplay = event.target.closest('[data-nav_step]').getAttribute('data-nav_step');
        this.displayStep(findSteptoDisplay);
    }
    /**
     * Continue to next step
     * @param {event} event 
    */
    continueToNext = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        let next = this._findNextStep(event);
        let stepName = event.target.closest('[data-step-name]').getAttribute('data-step-name');
        this.displayStep(next);
        this.manageBreadcrumbs(next);
    }
    /**
     * Continue to Prev step
     * @param {event} event 
    */
    continueToPrev = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        let prev = this._findPrevToStep(event);
        let stepName = event.target.closest('[data-step-name]').getAttribute('data-step-name');
        this.displayStep(prev);
        this.manageBreadcrumbs(prev);
    }
    /**
      * add selected product to the cart
      * @param {Event} event 
    */
    addToCart = async (event) => {
        event.stopImmediatePropagation();
        event.target.closest('.btn').classList.add('loading')
        finalItems=[];
        selectedProduct.variants.find( variant => {
                currentVariant = variant.id;
       })
       console.log(currentVariant);
        let obj = {
            quantity:quantity,
            id: currentVariant,
        }
        finalItems.push(obj);
        let formData = {
        'items':finalItems
        };
        const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json(); 
        console.log(data,'data',response)
        if (response.ok) {
            window.location.href = '/cart'
        }else{
            event.target.closest('.btn').classList.remove('loading');
            this.snotify('error',data.message,data.description);
        }
    }
    snotify = (type,title,body) => {
        window.notificationEle.updateNotification(title, body, {
          type: type,
          timeout: 1000
          });
    }
    _findNextStep(event){
        return parseInt(event.target.closest('[data-selector]').querySelector('[data-next_selector]').getAttribute('data-next_selector'))
    }
    _findPrevToStep(event){
        return parseInt(event.target.closest('[data-selector]').querySelector('[data-prev_selector]').getAttribute('data-prev_selector'))
    }
    /**
     * Add Selected class on the user selection
     * @param {event} event 
     * @param {number} currentStep 
    */
    _manageSelection(event,currentStep){
        this.querySelectorAll(`[data-selector="${currentStep}"] .selected`).forEach(ele => {
            ele.classList.remove('selected');
        });
        event.target.closest('[data-selection-box]').classList.add('selected');
    }
    /** END GENERAL METHODS */
}
customElements.define("product-funnel", productFunnel);