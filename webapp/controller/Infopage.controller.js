sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
		'sap/m/MessageBox'
], function (Controller, History, MessageBox) {
	"use strict";

	return Controller.extend("barcode.scanner.BarcodeScanner.controller.Infopage", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteInfopage").attachPatternMatched(this._onObjectMatched, this);
		},
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("RouteHomepage", true);
			}
		},
		_onObjectMatched: function (oEvent) {
			var barcodeData = oEvent.getParameter("arguments").value;
			this.getView().byId("labelBarcodeData").setText(barcodeData);
		}
		
	
	});
});