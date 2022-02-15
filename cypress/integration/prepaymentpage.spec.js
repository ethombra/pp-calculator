
const mortgageValues = Cypress.env('mortgageValues');
const displayValues = Cypress.env('displayValues');


describe('Functional test on Prepayment Privilege Calculator', () => {
  beforeEach(() => {
    
    cy.visit('/');

    //Validate the Landing Page is displayed.
    cy.url().should('contains', Cypress.env('landingURL'));
    cy.get('#navbar').contains('Prepayment Charge Calculator');

    //Enter values into the respective fields
    cy.get('tr:nth-child(1) > td:nth-child(3) > input').type(mortgageValues.mortgageAmount);
    cy.get('tr:nth-child(2) > td > input').type(mortgageValues.interestRate);
    cy.get('tr:nth-child(4) > td > input').type(mortgageValues.mortgagePayment);
    cy.get('select:nth-child(1)').select(mortgageValues.paymentFrequency);
  });

  it('Data Valdiation Test', () => {

    //Enter values into the respective fields

    cy.get('select:nth-child(3)').select('No');
    cy.get('tr:nth-child(6) input:nth-child(1)').clear();
    cy.get('tr:nth-child(6) input:nth-child(1)').type(mortgageValues.lumpSumPayment);
    cy.get('tr:nth-child(7) input:nth-child(1)').type(1);
    cy.get('tr:nth-child(7) input:nth-child(1)').clear();
    cy.get('tr:nth-child(7) input:nth-child(1)').type(mortgageValues.mortgagePaymentIncrease);
    cy.get('td:nth-child(3) > input:nth-child(4)').clear();
    cy.get('td:nth-child(3) > input:nth-child(4)').type(1);
    cy.get('#btnCalculate').click();

    //Valdiate the results populated within the following fields.
    cy.get('td > input:nth-child(2)').should('have.value', mortgageValues.revisedAmortizationPeriod);
    cy.get('input:nth-child(6)').should('have.value', mortgageValues.savings);

    //Validate the ‘Interactive Amortization Schedule’ landing page
    cy.get('p > input:nth-child(2)').click();
    cy.url().should('contains', Cypress.env('amortizationURL'));


    // Mortgage Amount: (Against the input)
    cy.get('center > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2)').contains(mortgageValues.mortgageAmount);

    // Interest Rate: (Against the input)
    cy.get('tr:nth-child(2) > td:nth-child(2)').contains(mortgageValues.interestRate);

    // Payment Frequency: (Against the input)
    cy.get('tr:nth-child(2) > td:nth-child(4)').contains(mortgageValues.paymentFrequency);

    // Initial Payment: (Against the input)
    cy.get('tr:nth-child(3) > td:nth-child(4)').contains(mortgageValues.mortgagePayment);


    // Initial Amortization Period: Exists 
    cy.get('table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(2)').should('exist');

    // Payments Displayed: Exists
    cy.get('table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(4)').should('exist');

  })


  it('Error Validation Test', () => {

    cy.get('select:nth-child(3)').select('Yes');

    //Validate Popup screen & text content
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Accelerated Payment Frequency not available for Monthly or Semi-Monthly Payment Frequency.');
    });
    // Validate the input data persists
    cy.get('tr:nth-child(1) > td:nth-child(3) > input').should('have.value', displayValues.displayMortgageAmt);
    cy.get('tr:nth-child(2) > td > input').should('have.value', displayValues.displayInterestRate);
    cy.get('tr:nth-child(4) > td > input').should('have.value', displayValues.displayMortgagePayment);
  })

})

