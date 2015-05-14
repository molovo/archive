module.exports = {
  'Open a Case Study': function ( browser ) {
    browser
      .url( 'http://molovo.dev' )
      .click( '#work-link' )
      .waitForElementVisible( '.work li.haresfoot', 3000 )
      .click( '.work li.haresfoot a' )
      .pause( 1000 )
      .assert.urlEquals( 'http://molovo.dev/work/haresfoot' )
      .assert.title( 'Brewing Up a Storm - molovo. Web Design, Portsmouth' )
      .end();
  }
}