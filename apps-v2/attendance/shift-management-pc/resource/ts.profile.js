dependencies = {
    stripConsole: "all",
    layers: [
        {
            name: "dojo.js",
            customBase: true,
            dependencies: [
                "dojo.parser",
                "dojo.dom",
                "dojo.date.locale",
                "dijit.dijit",
                "dijit.Dialog",
                "dijit.Menu",
                "dijit.MenuItem",
                "dijit.MenuSeparator",
                "dijit.Calendar",
                "dijit.popup",
                "dijit.PopupMenuItem",
                "dijit.Tooltip",
                "dijit.TooltipDialog",
                "dijit.form.Slider",
                "dijit.form.HorizontalRule",
                "dijit.form.ComboBox",
                "dijit.form.Select",
                "dijit.form.Button",
                "dijit.form.TextBox",
                "dijit.form.DateTextBox",
                "dijit.form.DropDownButton",
                "dijit.form.HorizontalRule",
                "dijit.form.HorizontalSlider",
                "dijit.form.NumberSpinner",
                "dojo.data.ItemFileReadStore",
                "dojo.data.ItemFileWriteStore",
                "dojox.layout.ResizeHandle",
                "dijit.layout.TabContainer",
                "dijit.layout.ContentPane"
            ]
        }
    ],
    prefixes: [
        [ "dijit", "../dijit" ],
        [ "dojox", "../dojox" ],
        [ "acme", "../acme" ]
    ]
}
