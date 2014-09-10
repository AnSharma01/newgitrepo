/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Models.Enums;
using Sage.CA.SBS.ERP.Sage300.AS.Resources.Forms;
using Sage.CA.SBS.ERP.Sage300.AS.Web.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Resources;
using Sage.CA.SBS.ERP.Sage300.Common.Web;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Utilities;
using System.Collections.Generic;

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers
{
    /// <summary>
    /// class UserAuthorizationSystemControllerInternal
    /// </summary>
    /// <typeparam name="T">User</typeparam>
    public class UserAthorizationSystemControllerInternal<T> : InternalControllerBase<IUserAuthorizationSystemService<T>>
        where T : User, new()
    {
        #region Constructor

        /// <summary>
        /// UserAuthorizationSystem ControllerInternal Constructor
        /// </summary>
        /// <param name="context">Context</param>
        public UserAthorizationSystemControllerInternal(Context context)
            : base(context)
        {
        }

        #endregion

        #region Service Methods
        /// <summary>
        /// Save User
        /// </summary>
        /// <param name="model"></param>
        /// <returns>View Model</returns>
        internal UserAuthorizationViewModel<T> Save(T model)
        {
            var securityGroupService = Utilities.Resolve<ISecurityGroupService<SecurityGroup>>(Context);
              
            bool isInvalidSecurityGroup = false;
            UserMessage userMessage = null;
            foreach (var userAuthorization in model.UserAuthorizations.Items)
            {
                // If Group Id is not empty then check whether the Group Id is valid
                if (!string.IsNullOrEmpty(userAuthorization.GroupID))
                {
                    if (userAuthorization.OperationMode == OperationMode.Add || userAuthorization.OperationMode == OperationMode.Update)
                    {
                        var securityGroup = securityGroupService.GetSecurityGroup(userAuthorization.ProgramID, userAuthorization.ProgramVersion,
                            userAuthorization.GroupID);
                        // If security Group is invalid then break the loop and add error message
                        if (securityGroup == null)
                        {
                            isInvalidSecurityGroup = true;
                            userMessage = new UserMessage {IsSuccess = false};
                            var error = new List<EntityError>();
                            error.Add(new EntityError
                            {
                                Message =
                                    string.Format(CommonResx.RecordNotFoundMessage, SecurityGroupsResx.SecGrpRecType,
                                        userAuthorization.GroupID.ToUpper())
                            });
                            userMessage.Errors = error;
                            break;
                        }
                    }
                }
                else
                {
                    userAuthorization.OperationMode = OperationMode.Delete;
                }
            }

            if (!isInvalidSecurityGroup)
            {
                var userSystemService = Utilities.Resolve<IUserAuthorizationSystemService<T>>(Context);
                model = userSystemService.Save(model);
            }
            return new UserAuthorizationViewModel<T>
            {
                Data = model,
                UserMessage =
                    isInvalidSecurityGroup ? userMessage : new UserMessage(model, CommonResx.SaveSuccessMessage)
            };

        }

        #endregion
    }
}