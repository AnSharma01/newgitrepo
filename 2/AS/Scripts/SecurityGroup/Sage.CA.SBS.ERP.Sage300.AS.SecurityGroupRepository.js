/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */
"use strict";

var securityGroupAjax = {
    call: function (method, data, successMethod) {
        var url = sg.utls.url.buildUrl("AS", "SecurityGroup", method);
        sg.utls.ajaxPost(url, data, successMethod);
    }
};

var securityGroupRepository = {
    create: function (model) {
        var data = securityGroupKoExtn.getSecurityGroupData(model);
        securityGroupAjax.call("Create", data, onUISuccess.create);
    },

    delete: function (progId, progVer, groupId) {
        var data = { 'programId': progId, 'programVersion': progVer, 'groupId': groupId };
        securityGroupAjax.call("Delete", data, onUISuccess.delete);

    },

    get: function (model) {
        var data = securityGroupKoExtn.getSecurityGroupData(model);
        securityGroupAjax.call("Get", data, onUISuccess.displayResult);
    },

    getById: function (model) {
        var data = securityGroupKoExtn.getSecurityGroupData(model);
        securityGroupAjax.call("GetByGroupId", data, onUISuccess.finderSuccessforSelectedGroup);
    },

    update: function (data) {
        securityGroupAjax.call("Save", data, onUISuccess.update);
    },

    add: function (data) {
        securityGroupAjax.call("Add", data, onUISuccess.update);
    },
};
