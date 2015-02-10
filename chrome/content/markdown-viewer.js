window.addEventListener('load', function load(event) {
    window.removeEventListener('load', load, false);
    MarkdownViewer.init();
}, false);

function BrowserSetForcedCharacterSet(aCharset) {
    var wnd = (gContextMenu ? document.commandDispatcher.focusedWindow : window);
    if ((window == wnd) || (wnd == null)) wnd = window.content;
    const Ci = Components.interfaces;
    var webNav = wnd.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation);
    var docShell = webNav.QueryInterface(Ci.nsIDocShell);
    docShell.QueryInterface(Ci.nsIDocCharset).charset = aCharset;
    webNav.reload(nsIWebNavigation.LOAD_FLAGS_CHARSET_CHANGE);
}

if (!MarkdownViewer) {

  var MarkdownViewer = {

    init: function() {
        var appcontent = document.getElementById('appcontent');
        if (appcontent)
            appcontent.addEventListener('DOMContentLoaded', this.onPageLoad, true);
    },

    onPageLoad: function(aEvent) {
        var document = aEvent.originalTarget;
        var markdownFileExtension = /\.m(arkdown|kdn?|d(o?wn)?)(#.*)?(.*)$/i;

        if (document.location.protocol !== "view-source:"
            && markdownFileExtension.test(document.location.href)
            && document.contentType !== "text/html") {

            if (document.characterSet !== 'UTF-8') {
                BrowserSetForcedCharacterSet('utf-8');
                return;
            }
                
            var textContent = document.documentElement.textContent;
            // definitely safe as soon as HTML comes from safe function
            document.body.innerHTML = '<div class="container">' + marked(textContent) + '</div>';
            document.title = document.location.href.split("/").pop();

            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'resource://mdvskin/markdown-viewer.css';
            document.head.appendChild(link);
    
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1';
            document.head.appendChild(meta);
        }
    }

  };

}
