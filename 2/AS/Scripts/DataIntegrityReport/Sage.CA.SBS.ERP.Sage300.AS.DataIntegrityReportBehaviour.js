/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

var dataIntegrityReportUI = {
    dataIntegrityReportModel: {},
    hasKoApplied: false,
    BaseUrl: $("#hdnReportBaseUrl").val(),
};

var dataIntegrigtyReportUIData = {
    executedataIntegrityReport: function() {
        dataIntegrityReportRepository.executedataIntegrityReport(dataIntegrityReportUI.dataIntegrityReportModel);
    }
};
var onSuccess = {
    getdataIntegrityDetailsSuccess: function (result) {
        if (result != null) {
            if (!dataIntegrityReportUI.hasKoApplied) {
                dataIntegrityReportUI.dataIntegrityReportModel = ko.mapping.fromJS(result);
               // postingJournalReportKoExtn.postingJournalReportModelExtension(dataIntegrityReportUI.dataIntegrityReportModel.Data);
                ko.applyBindings(dataIntegrityReportUI.dataIntegrityReportModel);
                dataIntegrityReportUI.hasKoBindingApplied = true;

            }
            else {
                ko.mapping.fromJS(result, dataIntegrityReportUI.dataIntegrityReportModel);
            }
        }
    },

    executedataIntegrityReport: function(result) {
        if (result != null && result.UserMessage.IsSuccess) {
            sg.utls.openReport(result.ReportToken);
        } else {
            sg.utls.showMessage(result);
        }
    }
    };

