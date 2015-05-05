module.exports = {
  'Page title is correct': function ( browser ) {
    browser
      .url( 'https://molovo.co' )
      .assert.title( 'molovo. Web Design, Portsmouth' );
  },

  'Link to Work Opens Menu': function ( browser ) {
    browser
      .click( '#workLink' )
      .waitForElementVisible( '.work li.haresfoot', 2000 )
      .click( '#work-link' )
      .waitForElementNotVisible( '.work li.haresfoot', 2000 )
  },

  'Case Studies Have Loaded': function ( browser ) {
    browser
      .moveToElement( '.featured-case-study' )
      .waitForElementVisible( '.featured-case-study .button', 2000 )
      .assert.containsText( '.featured-case-study .button', 'View the Case Study' )
      .end();
  }
};