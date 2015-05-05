module.exports = {
  'Open a Case Study': function ( browser ) {
    browser
      .url( 'https://molovo.co' )
      .click( '#work-link' )
      .waitForElementVisible( '.work li.haresfoot', 1000 )
      .click( '.work li.haresfoot a' )
      .pause( 1000 )
      .assert.urlEquals( 'https://molovo.co/work/haresfoot' )
      .assert.title( 'Brewing Up a Storm - molovo. Web Design, Portsmouth' )
      .end();
  }
}