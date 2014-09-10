/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved.*/

var restartRecordsAjax = {
    area: "AS",
    screenName: "RestartRecord",

    generateURL: function (method) {
        return sg.utls.url.buildUrl(restartRecordsAjax.area, restartRecordsAjax.screenName, method);
    },

    restartRecordsAjaxCall: function (method, data, successMethod) {
        var url = restartRecordsAjax.generateURL(method);
        var dataItems = ko.mapping.toJS(data);
        sg.utls.ajaxPost(url, dataItems, successMethod);
    }
};

var restartRecordsRepository = {

    loadRestartRecord: function (pNo, pSize, filters) {
        $("#RestartRecordGrid").data("kendoGrid").dataSource._skip = restartRecordsUI.resetPage;
        $("#RestartRecordGrid").data("kendoGrid").dataSource._page = restartRecordsUI.resetPage + 1;
        $("#RestartRecordGrid").data("kendoGrid").dataSource.read({
            page: pNo,
            pageSize: pSize
        });

    },
    deleteRestartRecord: function (items) {
        var data = { 'restartNumbers': items };
        sg.utls.ajaxPost(sg.utls.url.buildUrl("AS", "RestartRecord", "Delete"), data, restartRecordsUISuccess.afterDelete);
    },
    getById: function (id) {
        var data = { id: id };
        restartRecordsAjax.restartRecordsAjaxCall("GetById", data, restartRecordsUISuccess.onGetByIdCompleted);
    }
};
