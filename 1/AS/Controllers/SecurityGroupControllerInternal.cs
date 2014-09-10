/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Web.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Web;
using System.Web.Mvc;
using common = Sage.CA.SBS.ERP.Sage300.Common.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Utilities;

#endregion

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers
{
    /// <summary>
    /// Class SecurityGroupControllerInternal.
    /// </summary>
    /// <typeparam name="T">Security Group</typeparam>
    public class SecurityGroupControllerInternal<T> : InternalControllerBase<ISecurityGroupService<T>> where T : SecurityGroup, new()
    {
        #region Private

        private string _selectedGroupDescription = string.Empty;

        #endregion

        #region Constructor

        /// <summary>
        /// Security Group controller internal constructor
        /// </summary>
        /// <param name="context">Context</param>
        public SecurityGroupControllerInternal(common.Context context)
            : base(context)
        {
        }

        #endregion

        #region Public methods

        /// <summary>
        /// Get Method
        /// </summary>
        /// <param name="model">Security group Model</param>
        /// <returns>Json object for Security group </returns>
        internal SecurityGroupViewModel<T> Get(T model)
        {
            Expression<Func<T, bool>> filter;
            List<ApplicationSecurityResources> selectedAccessList = null;
            string selectedApplication = null;
            List<SelectListItem> applicationList = null;
            if (!string.IsNullOrEmpty(model.ProgramId))
            {
                model.ProgramId = model.ProgramId.ToUpperInvariant();
            }
            if (!string.IsNullOrEmpty(model.ProgramVersion))
            {
                model.ProgramVersion = model.ProgramVersion.ToUpperInvariant();
            }
            if (!string.IsNullOrEmpty(model.GroupId))
            {
                model.GroupId = model.GroupId.ToUpperInvariant();
            }
            T securityGroup = Service.GetApplication(model.ProgramId, model.ProgramVersion);
            if (securityGroup != null)
            {
                applicationList = securityGroup.ActiveApplication.Select(application => new SelectListItem { Text = application.AppNameWithoutVersion, Value = application.AppId }).ToList();
                if (string.IsNullOrEmpty(securityGroup.ProgramId) || securityGroup.ProgramId != model.ProgramId)
                {
                    selectedApplication = securityGroup.ActiveApplication[0].AppNameWithoutVersion;
                }
                else
                {
                    selectedApplication = securityGroup.ActiveApplication.Find(activeApplication => activeApplication.AppId == model.ProgramId).AppNameWithoutVersion;
                }
                var securityAccessList = Service.GetSecurityAccess(securityGroup.ProgramId, securityGroup.ProgramVersion);
                if (securityAccessList != null)
                {
                    securityGroup.ApplicationSecurityResources = securityAccessList;

                }
                if (!string.IsNullOrEmpty(model.GroupId))
                {
                    securityGroup.GroupId = model.GroupId;
                    filter = secGroup => secGroup.ProgramId == securityGroup.ProgramId && secGroup.ProgramVersion == securityGroup.ProgramVersion && secGroup.GroupId == model.GroupId;
                    selectedAccessList = AccessList(filter);
                    if (string.IsNullOrEmpty(_selectedGroupDescription))
                    {
                        securityGroup.GroupId = string.Empty;
                    }
                    securityGroup.GroupDescription = _selectedGroupDescription;

                }
            }
            return new SecurityGroupViewModel<T>
            {
                Data = securityGroup,
                Application = applicationList,
                selectedSecurityAccess = selectedAccessList,
                selectedApplication = selectedApplication,
                UserMessage = new common.UserMessage(securityGroup),
            };
        }

        /// <summary>
        /// Gets Security access for GroupId
        /// </summary>
        /// <param name="model">Security group Model</param>
        /// <returns>Json object for Security group </returns>
        internal SecurityGroupViewModel<T> GetByGroupId(T model)
        {
            var securityGroup = new T();
            if (!string.IsNullOrEmpty(model.GroupId))
            {
                model.GroupId = model.GroupId.ToUpperInvariant();
            }
            Expression<Func<T, bool>> filter = secGroup => secGroup.ProgramId == model.ProgramId && secGroup.ProgramVersion == model.ProgramVersion && secGroup.GroupId == model.GroupId;
            var selectedlist = AccessList(filter);
            securityGroup.GroupDescription = _selectedGroupDescription;
            securityGroup.GroupId = model.GroupId;
            return new SecurityGroupViewModel<T>
            {
                Data = securityGroup,
                selectedSecurityAccess = selectedlist,
            };
        }

        /// <summary>
        /// gets securityAccess for selected Group Id
        /// </summary>
        /// <returns>Account Segment Listing</returns>
        internal common.EnumerableResponse<ApplicationSecurityResources> GetSecurityAccess(IList<IList<common.Filter>> filterList)
        {
            var securityGroupViewModel = new SecurityGroupViewModel<T>();

            var propertyValue = new List<string>();
            if (filterList != null)
            {
                var filList = filterList[0];
                for (int index = 1; index < filList.Count; index++)
                {
                    propertyValue.Add(filList[index].Value.ToString());
                }
            }
            ExpressionBuilder<T>.CreateExpression(filterList);
            var accessList = Service.GetSecurityAccess(propertyValue[0], propertyValue[1]);
            if (accessList.Items != null)
            {
                securityGroupViewModel.Data.ApplicationSecurityResources = accessList;
                return securityGroupViewModel.Data.ApplicationSecurityResources;
            }
            return new common.EnumerableResponse<ApplicationSecurityResources>();
        }

        /// <summary>
        /// creates new group for selected application
        /// </summary>
        ///<param name="model">Security group Model</param>
        /// <returns>Json object for Security group </returns>
        internal SecurityGroupViewModel<T> Create(T model)
        {
            model.GroupId = string.Empty;
            model.GroupDescription = string.Empty;
            var selectedApplication = model.ActiveApplication[0].AppNameWithoutVersion;
            return new SecurityGroupViewModel<T>
            {
                Data = model,
                selectedApplication = selectedApplication,
            };

        }


        #endregion

        #region private

        /// <summary>
        ///  Gets Security access for GroupId
        /// </summary>
        /// <param name="filter">appid,appversion,groupid filter</param>
        /// <returns>returns list of Security access</returns>
        private List<ApplicationSecurityResources> AccessList(Expression<Func<T, bool>> filter)
        {

            var securityAccess = Service.GetByGroupId(filter);
            var secResourceList = new List<ApplicationSecurityResources>();

            foreach (var access in securityAccess.Items)
            {
                var securityResources = new ApplicationSecurityResources
                {
                    ResourceID = access.ResourceId,
                    ResourceDescription = access.GroupDescription,
                };
                if (string.IsNullOrEmpty(access.ResourceId))
                {
                    _selectedGroupDescription = access.GroupDescription;
                }
                else
                {
                    secResourceList.Add(securityResources);
                }
            }
            return secResourceList;
        }
        #endregion
    }
}