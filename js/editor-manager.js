(function() {

  function EditorManager ( options ) {

    var rootDir = options.editorsDir;

    function Editor( editorName ) {

      var editorBasePath = rootDir + "/" + editorName;
      var editorOptions = PopcornMaker.getJSON( editorBasePath + "/manifest.json" );

      if ( editorOptions.editor.match( /https?:\/\// ) ) {
        editorBaseBath = "";
      }

      this.init = function( butter ) {
        var path = editorBasePath + "/" + editorOptions.editor;
        var view = editorOptions.view !== "window" ? "editor-popup" : "window";
        console.log( editorOptions.plugin, view );
        butter.addEditor( path, editorOptions.plugin, view );
      }; //init
    } //Editor

    var editors = [],
        editorList = PopcornMaker.getJSON( options.config );

    for ( var i=0; i<editorList.length; ++i ) {
      editors.push( new Editor( editorList[ i ] ) );
    } //for

    this.initEditors = function( butter ) {
      for ( var i=0; i<editors.length; ++i ) {
        editors[ i ].init( butter );
      }
    };

  } //EditorManager

  window.EditorManager = EditorManager;
})();
