module.exports = {
  'Open a Case Study': function ( browser ) {
    browser
      .url( 'http://localhost:9543' )
      .pause( 3000 )
      .click( '#work-link' )
      .waitForElementVisible( '.work li.haresfoot', 3000 )
      .click( '.work li.haresfoot a' )
      .pause( 3000 )
      .assert.urlEquals( 'http://localhost:9543/work/haresfoot' )
      .assert.title( 'Brewing Up a Storm - molovo. Web Design, Portsmouth' )
      .end();
  }
}