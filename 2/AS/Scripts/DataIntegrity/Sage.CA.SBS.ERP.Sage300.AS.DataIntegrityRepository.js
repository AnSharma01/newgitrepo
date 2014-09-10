/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */
"use strict";

var dataIntegrityRepository = dataIntegrityRepository || {};
dataIntegrityRepository = {
    loadDataIntegrity: function (id) {
        var data = { 'id': id };
        //if (uiMode == 0)
        sg.utls.ajaxPost(window.sg.utls.url.buildUrl("AS", "DataIntegrity", "Get"), data, dataIntegrityOnSuccess.loadDataIntegrity);
    },
    process: function (model) {
        var data = { model: ko.mapping.toJS(model) };
        sg.utls.ajaxPost(sg.utls.url.buildUrl("AS", "DataIntegrity", "Process"), data, dataIntegrityOnSuccess.process);

    },

    progress: function (tokenId) {
        var data = { tokenId: tokenId };
        var urlString = $("#ProgressUrl").val();

        sg.utls.recursiveAjaxPost(urlString, data, dataIntegrityOnSuccess.progress, dataIntegrityOnSuccess.abort);
    },
    loadDataIntegrityReport: function (model) {
        var data = { model: ko.mapping.toJS(model) };
        var dataIntegrityReport = {
            ErrorLogFile: "C:\\Program Files (x86)\\Sage\\Sage 300 ERP\\COMPANY\\SAMLTD"
        };
        var data = { report: dataIntegrityReport };
        sg.utls.ajaxPost(sg.utls.url.buildUrl("AS", "DataIntegrityReport", "Execute"), data, function (result) {
            if (result != null && result.UserMessage.IsSuccess) {
                sg.utls.openReport(result.ReportToken);
            } else {
                sg.utls.showMessage(result);
            }
        });
    },

};



