/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */
"use strict";

function SecurityGroupModelExtension(securityGroupModel, uiMode) {
    var model = securityGroupModel;
    model.UIMode = ko.observable(uiMode);
};

var securityGroupKoExtn = securityGroupKoExtn || {};
securityGroupKoExtn = {
    computedProperties: ["UIMode", "IsSaveEnable", "IsDeleteEnable"],
    getSecurityGroupData: function (model) {
        var data = {
            model: sg.utls.ko.toJS(model, securityGroupKoExtn.computedProperties)
        };
        return data;
    }
};





