/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved.*/

var restartRecordsRepository = {

    deleteRestartRecord: function (items) {
        var data = { 'restartNumber': items };
        sg.utls.ajaxPost(sg.utls.url.buildUrl("AS", "PopupRestartRecord", "Delete"), data, restartRecordsUISuccess.afterDelete);
    },
};
