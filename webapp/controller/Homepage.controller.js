/* global Quagga:true */

sap.ui.define([
			"sap/ui/core/mvc/Controller",
			"sap/m/MessageToast",
			"sap/m/MessageBox"
		], function (Controller, MessageToast, MessageBox) {
			"use strict";

			return Controller.extend("barcode.scanner.BarcodeScanner.controller.Homepage", {
					onInit: function () {},
					onScanStart: function () {
						if (!this._oScanDialog) {
							this._oScanDialog = new sap.m.Dialog({
								title: "Scan barcode",
								contentWidth: "640px",
								contentHeight: "480px",
								horizontalScrolling: false,
								verticalScrolling: false,
								stretchOnPhone: true,
								content: [new sap.ui.core.HTML({
									id: this.createId("scanContainer"),
									content: "<div />"
								})],
					
								
								endButton: new sap.m.Button({
									text: "Cancel",
									press: function (oEvent) {
										this._oScanDialog.close();
									}.bind(this)
								}),
								
							
								afterOpen: function () {
									this._initQuagga(this.getView().byId("scanContainer").getDomRef()).done(function () {
										Quagga.start();
									}).fail(function (oError) {
										MessageBox.error(oError.message.length ? oError.message : ("Failed to initialise Quagga with reason code " + oError.name), {
											onClose: function () {
												this._oScanDialog.close();
											}.bind(this)
										});
									}.bind(this));
								}.bind(this),
								afterClose: function () {
									Quagga.stop();
								}
							});

							this.getView().addDependent(this._oScanDialog);
						}

						this._oScanDialog.open();
					},
					onSubmit: function () {
						var barcodeData = this.getView().byId("inputData").getValue();
						if (barcodeData.trim()) {
							var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							this.getView().byId("inputData").setValue("");
						
							oRouter.navTo("RouteInfopage", {
								value: barcodeData
							});
						} else {
							// MessageToast.show("Cannot submit empty value");
							
							sap.m.MessageToast.show("Cannot submit empty value", {
								background: "Green",
                        duration: 90000               
   
});

							// MessageBox.success(
							// 	"Project 1234567 was created and assigned to team \"ABC\".", {
							// 		// styleClass: bCompact ? "sapUiSizeCompact" : ""
							// 	});
						}

						},
						_initQuagga: function (oTarget) {
							var oDeferred = jQuery.Deferred();

							Quagga.init({
								inputStream: {
									type: "LiveStream",
									target: oTarget,
									constraints: {
										width: {
											min: 640
										},
										height: {
											min: 480
										},
										facingMode: "environment"
									}
								},
								locator: {
									patchSize: "medium",
									halfSample: true
								},
								numOfWorkers: 2,
								frequency: 10,
								decoder: {
									readers: [{
										format: "code_128_reader",
										config: {}
									}]
								},
								locate: true
							}, function (error) {
								if (error) {
									oDeferred.reject(error);
								} else {
									oDeferred.resolve();
								}
							});
							Quagga.onDetected(function (result) {
								this.getView().byId("inputData").setValue(result.codeResult.code);
								this._oScanDialog.close();
								
								
								MessageToast.show("Barcode scan success");
								// var toast = new sap.m.MessageToast("Barcode scan success", {})
								// var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
								// MessageBox.success(
								// 	"Project 1234567 was created and assigned to team \"ABC\".", {
								// 		styleClass: bCompact ? "sapUiSizeCompact" : ""
								// 	}
								// );
							}.bind(this));

							return oDeferred.promise();
						}
					});
			});