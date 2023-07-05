const selectors = {
  accountPages: '[data-account-pages]',
  resetPassword : '[data-recover-link]',
  hideResetPass : '[data-hideResetPass]',
  resetPasswordForm : '[data-recover-password-form]',
  loginForm : '[data-login-form]'
};

class accountPages {
  constructor() {
    this.elements = this._getElements();
    if (Object.keys(this.elements).length === 0) return;
    this._setupEventListeners();

    const windowURL = window.location.href;
    const showRecoverForm = windowURL.indexOf('#recover');
    if(showRecoverForm >= 0){
      this.elements.showResetPassword.dispatchEvent(new Event('click'));
    }
  }

  /**
   * Fecth Selector of login form inputs
   */
  _getElements() {
    const container = document.querySelector(selectors.accountPages);
    return container ? {
      container,
      showResetPassword: document.querySelector(selectors.resetPassword),
      hideResetPass: document.querySelector(selectors.hideResetPass),
      resetPasswordForm: document.querySelector(selectors.resetPasswordForm),
      loginForm: document.querySelector(selectors.loginForm)
    } : {};
  }

  /**
   * Bind Click events on hide/show password field
   */
  _setupEventListeners() {
      this.elements.showResetPassword.addEventListener('click', this._handleResetPassword.bind(this));
      this.elements.hideResetPass.addEventListener('click', this._handleResetPassword.bind(this));
  }
  /**
   * Reset Password
   * @param {event} event 
   */
  _handleResetPassword(event){
      event.preventDefault();
      const _this = event.currentTarget;
      if(_this.classList.contains('hide-resetform')){
        this.elements.loginForm.style.display = 'block';
        this.elements.resetPasswordForm.style.display = 'none';
        if(window.location.href.indexOf("#recover") > -1) {
          window.history.replaceState({ }, '', location.href.replace("#recover", ""));
        }
      }else{
          this.elements.loginForm.style.display = 'none';
          this.elements.resetPasswordForm.style.display = 'block';
      }
  }

  

}

typeof accountPages !== 'undefined' && new accountPages();



document.getElementById("customer_login").setAttribute("action", "");


document.querySelector("#customer_login").addEventListener("submit", function(){

});
// Replace 'your-shopify-domain' with your actual Shopify store domain
const shopifyDomain = 'demo-manju';

// Replace 'your-api-key' and 'your-api-password' with your actual Shopify API credentials
const apiKey = '43f6773a1a70da5f248d618b986e9c89';
const admin_API_access_token = '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';

const apiPassword = 'f2c21d73c596ae6b10ac085bc31f966e';

// Construct the API endpoint URL
const url = `https://${shopifyDomain}.myshopify.com/admin/api/2023-01/customers.json`;

// Create the headers object with the 'Authorization' header
const headers = new Headers();
headers.append('Authorization', `Bearer ${apiKey}:${apiPassword}`);

// Make the GET request to retrieve all customers
fetch(url, {
  method: 'GET',
  headers: headers
})
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP status ${response.status}`);
    }
  })
  .then(data => {
    const customers = data.customers;
    // Process the list of customers as needed
    customers.forEach(customer => {
      console.log(`Customer ID: ${customer.id}, Name: ${customer.first_name} ${customer.last_name}`);
    });
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
