/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */
var restartRecordsKoExtn = {
    getRestartRecordData: function (model) {
        var data = {
            model: ko.mapping.toJS(model)
        };
        return data;
    },
}
function RestartRecordObservableExtension(restartRecordsModel) {
    var model = restartRecordsModel;
    model.SelectedRow = ko.observable();
};