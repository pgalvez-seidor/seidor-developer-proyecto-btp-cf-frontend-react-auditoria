sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/core/HTML"],
    function (UIComponent, HTML) {
        "use strict";

        return UIComponent.extend("nuam.react.maestros.Component", {

            metadata: {
                manifest: "json"
            },

            createContent: function () {
                var sBase = sap.ui.require.toUrl("nuam/react/maestros");
                return new HTML({
                    content: "<iframe src='" + sBase + "/index.html' " +
                        "style='width:100%;height:100%;border:none;display:block;'></iframe>"
                });
            }
        });
    }
);
