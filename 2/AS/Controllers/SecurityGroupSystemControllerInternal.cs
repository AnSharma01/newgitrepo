/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region

using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Resources.Forms;
using Sage.CA.SBS.ERP.Sage300.AS.Web.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Resources;
using Sage.CA.SBS.ERP.Sage300.Common.Web;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Utilities;
using System.Collections.Generic;
using System.Linq;
using CommonModel = Sage.CA.SBS.ERP.Sage300.Common.Models;

#endregion

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers
{
    /// <summary>
    /// class SecurityGroupSystemControllerInternal
    /// </summary>
    /// <typeparam name="T">Security Group</typeparam>
    public class SecurityGroupSystemControllerInternal<T> : InternalControllerBase<ISecurityGroupSystemService<T>> where T : SecurityGroup, new()
    {
        #region Constructor

        /// <summary>
        /// SecurityGroupSystem ControllerInternal Constructor
        /// </summary>
        /// <param name="context">Context object</param>
        public SecurityGroupSystemControllerInternal(CommonModel.Context context)
            : base(context)
        {

        }

        /// <summary>
        /// Add Application
        /// </summary>
        /// <param name="model">Security Group Model</param>
        /// <returns>SecurityGroup View Model</returns>
        internal SecurityGroupViewModel<T> Add(T model)
        {
            var securityGroupModel = AddApplication(model);

            return new SecurityGroupViewModel<T>
            {
                Data = securityGroupModel,
                UserMessage = new CommonModel.UserMessage(securityGroupModel, string.Format(CommonResx.AddSuccessMessage, SecurityGroupsResx.SecGrpRecType, securityGroupModel.GroupId)),
                UserAccess = GetAccessRights(),
            };
        }


        /// <summary>
        /// Save Application
        /// </summary>
        /// <param name="model">Security Group Model</param>
        /// <returns>SecurityGroup View Model</returns>
        internal SecurityGroupViewModel<T> Save(T model)
        {
            var securityGroupModel = AddApplication(model);

            return new SecurityGroupViewModel<T>
            {
                Data = securityGroupModel,
                UserMessage = new CommonModel.UserMessage(securityGroupModel, string.Format(CommonResx.SaveSuccessMessage, SecurityGroupsResx.SecGrpRecType, securityGroupModel.GroupId)),
                UserAccess = GetAccessRights()
            };
        }

        /// <summary>
        /// Delete Application
        /// </summary>
        /// <param name="programId">Program Id</param>
        /// <param name="programVersion">Program Version</param>
        /// <param name="groupId">Group Id</param>
        /// <returns>SecurityGroup View Model</returns>
        internal SecurityGroupViewModel<T> Delete(string programId, string programVersion, string groupId)
        {
            var securityGroupSystemService = Utilities.Resolve<ISecurityGroupSystemService<T>>(Context);

            var deleteSecurityGroups = securityGroupSystemService.Delete(programId, programVersion, groupId);
            return new SecurityGroupViewModel<T>
            {
                Data = deleteSecurityGroups,
                UserMessage = new CommonModel.UserMessage(deleteSecurityGroups, string.Format(CommonResx.DeleteSuccessMessage, SecurityGroupsResx.SecGrpRecType, deleteSecurityGroups.GroupId)),
                UserAccess = GetAccessRights()
            };
        }

        #endregion

        #region Private

        /// <summary>
        /// Add Application
        /// </summary>
        /// <param name="model">Security Group Model</param>
        /// <returns>Security Group Model</returns>
        private T AddApplication(T model)
        {
            List<ApplicationSecurityResources> securityResources = null;
            var securityGroupSystemService = Utilities.Resolve<ISecurityGroupSystemService<T>>(Context);
            if(model.ApplicationSecurityResources.Items !=  null)
            {
                securityResources = model.ApplicationSecurityResources.Items.Where(securityAccess => securityAccess.HasChanged).ToList();
            }            
            model.ApplicationSecurityResources.Items = securityResources;
            return securityGroupSystemService.Add(model);
        }

        #endregion
    }
}