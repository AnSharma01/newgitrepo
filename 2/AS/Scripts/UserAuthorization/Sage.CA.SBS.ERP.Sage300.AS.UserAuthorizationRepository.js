/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */
"use strict";

var userAuthorizationsAjax = {
    area: "AS",
    screenName: "UserAuthorization",

    generateURL: function (method) {
        return sg.utls.url.buildUrl(userAuthorizationsAjax.area, userAuthorizationsAjax.screenName, method);
    },

    MethodForAjaxCall: function (method, data, successMethod) {
        var url = userAuthorizationsAjax.generateURL(method);
        sg.utls.ajaxPost(url, data, successMethod);
    }
};

var userAuthorizationsRepository = {

    getByUserId: function (filters) {
        var data = { pageNumber: 0, pageSize: 10, filters: filters };

        userAuthorizationsAjax.MethodForAjaxCall("Get", data, userAuthorizationsUISuccess.bindData);
    },

    saveUserAuthorization: function (model) {
        userAuthorizationsAjax.MethodForAjaxCall("Save", userAuthorizationsKoExtn.getUserAuthorizationData(model), userAuthorizationsUISuccess.bindData);
    },

    getSecurityGroup: function (programId, versionId, securityGroupId) {
        var data = { programId: programId, versionId: versionId, securityGroupId: securityGroupId };
        userAuthorizationsAjax.MethodForAjaxCall("GetSecurityGroup", data, userAuthorizationsUISuccess.getSecurityGroup);
    },
};
