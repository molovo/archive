module.exports = {
  'Page title is correct': function ( browser ) {
    browser
      .url( 'http://molovo.dev' )
      .assert.title( 'molovo. Web Design, Portsmouth' );
  },

  'Link to Work Opens Menu': function ( browser ) {
    browser
      .click( '#workLink' )
      .waitForElementVisible( '.work li.haresfoot', 3000 )
      .click( '#work-link' )
      .waitForElementNotVisible( '.work li.haresfoot', 3000 )
  },

  'Case Studies Have Loaded': function ( browser ) {
    browser
      .moveToElement( '.featured-case-study', 0, 0 )
      .waitForElementVisible( '.featured-case-study .button', 3000 )
      .assert.containsText( '.featured-case-study .button', 'View the Case Study' )
      .end();
  }
};