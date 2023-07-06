
class WarrantyFeature extends HTMLElement {
    constructor() {
        super();
        document.querySelector("form.zip-code-form button").addEventListener("click", this.checkZipCode.bind(this));
        this.popupWarranty = document.querySelector("#PopupModal-warrantyProduct");
        if(this.popupWarranty) this.popupModel = this.popupWarranty.querySelector(".modal");
    }
     async checkZipCode(event){
        event.preventDefault();
        let _this = this;
        const allLocalZipCodes = window.globalVariables.zip_codes;
        let zipCodeInput = this.querySelector('[name="zip-code"]');
        let zipCodeValue = null
        if(zipCodeInput) zipCodeValue = zipCodeInput.value;
        console.log(allLocalZipCodes.indexOf(zipCodeValue));
        
        if(allLocalZipCodes.indexOf(zipCodeValue) === -1 )
        {
          _this.showWarrentyPopup(); 
        }
        else{
          document.querySelector(".warrenty-details").classList.remove("d-none");
          document.querySelector(".current_zip_code").innerHTML = zipCodeValue;
          document.querySelector(".change_zip_code").classList.add("d-none");
        }
    }

    async showWarrentyPopup() {
        if(this.popupWarranty) {
            if(this.popupModel) {
                this.popupModel.classList.add('open');
                siteOverlay.prototype.showOverlay();
                Utility.trapFocus(this.popupModel);
                Utility.forceFocus(this.popupModel.querySelector('[id^="ModalClose-"]'));
            }
        }
           
    }
}

customElements.define('zip-code', WarrantyFeature);