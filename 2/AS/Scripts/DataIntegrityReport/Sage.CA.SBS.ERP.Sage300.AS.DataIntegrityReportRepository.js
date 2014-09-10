var dataIntegrityReportRepository = {
    executedataIntegrityReport: function(model) {
        var data = dataIntegrityReportRepository.getDataIntegrityReportData(model);
        sg.utls.ajaxPost(sg.utls.url.buildUrl("AS", "DataIntegrityReport", "Execute"), data, onSuccess.executedataIntegrityReport);
    },
    getDataIntegrityReportData: function(model) {
        var data = {
            report: ko.mapping.toJS(model.Data)
        };
        return data;

    }
}