/* MMM-GrafanaChart
 * This MagicMirror² module allows you to display a chart generated by grafana.
 *
 * By SvenSommer https://github.com/SvenSommer
 * MIT Licensed.
 */


Module.register("MMM-GrafanaChart", {
    // Default module config.
    defaults: {
        protocol: "http", // this is needed, so it can be overwritten in the old-style config
        url: "invalid",
        height:"100%",
        width:"100%",
        scrolling:"no",
        refreshInterval: 900
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        // if the user did not provide a URL property, try to assemble one from the older config style, that stored everything in parts
        if( this.config.url === "invalid" ){
            this.config.url = this.buildUrl();
        }
        this.scheduleUpdate();
    },

    buildUrl: function() {
        var URL = "";
        URL += this.config.protocol + "://";
        URL += this.config.host + ":" + this.config.port;
        if (this.config.version == "6") {
            URL += "/d-solo/" + this.config.id;
        } else{
            URL += "/dashboard-solo/db";
        }
        URL += "/" + this.config.dashboardname;
        URL += "?orgId=" + this.config.orgId;
        URL += "&panelId=" + this.config.panelId;
        if( this.config.from ){
            URL += "&from=" + this.config.from;
        }
        if( this.config.to ){
            URL += "&to=" + this.config.to
        }
        if (this.config.version == "6") {
            URL += "&fullscreen&kiosk";
        }
        return URL;
    },


    // Override dom generator.
    getDom: function() {
        if( ! this.config.url.match(/^https?:/i) ){
            return document.createTextNode(this.name+" found no usable URL configured. Please check your config!");
        }

        var iframe = document.createElement("IFRAME");
        iframe.style = "border:0"
        iframe.width = this.config.width;
        iframe.height = this.config.height;
        iframe.scrolling = this.config.scrolling;
        iframe.src = this.config.url;
        // this attribute is used to ensure MagicMirror doesn't throw away our updateDom(), because the DOM object is identical to the previous one
        iframe.setAttribute("timestamp", new Date().getTime());
        return iframe;
    },
    scheduleUpdate: function() {
        var self = this;
        setTimeout(function() {
            self.updateFrame();
        }, this.config.refreshInterval*1000);
    },
    updateFrame: function() {
        Log.info("attempting to update dom for iFrameReload");
        this.updateDom(1000);
        this.scheduleUpdate();
    }
});
