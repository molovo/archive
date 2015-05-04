module.exports = {
  'Submit contact form': function ( test ) {
    test.open( 'http://molovo.dev/contact' )
      .type( '#name', 'Muffin Man' )
      .type( '#email', 'muffin@man.com' )
      .type( '#url', 'http://themuffinman.com' )
      .type( '#budget', '5000' )
      .type( '#release-date', '01/01/2016' )
      .type( '#message', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis reprehenderit consectetur quam totam laborum animi magnam optio porro fuga adipisci doloremque ab at libero iusto neque beatae, enim quis deleniti!' )
      .click( '#send' )
      .waitFor( function () {
        return location.href === 'https://molovo.co/contact/thanks/'
      }, [], 60000 )
      .assert.url().is( 'http://molovo.dev/contact/thanks/' )
      .assert.text( '.contact.thanks .contact-header h1', 'Thanks!' )
      .done();
  }
};