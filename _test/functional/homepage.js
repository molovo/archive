module.exports = {
  'Page title is correct': function ( test ) {
    test.open( 'http://molovo.dev' )
      .assert.title().is( 'molovo. Web Design, Portsmouth', 'Title is correct' )
      .done();
  }
};