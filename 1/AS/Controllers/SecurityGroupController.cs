/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region NameSpace

using System;
using System.Web.Mvc;
using Microsoft.Practices.Unity;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Web.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Exceptions;
using Sage.CA.SBS.ERP.Sage300.Common.Models.Enums;
using Sage.CA.SBS.ERP.Sage300.Common.Resources;
using Sage.CA.SBS.ERP.Sage300.Common.Web;
using Sage.CA.SBS.ERP.Sage300.Common.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Resources.Forms;
using System.Collections.Generic;
using filter = Sage.CA.SBS.ERP.Sage300.Common.Models;

#endregion

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers
{
    /// <summary>
    /// Security Group Controller
    /// </summary>
    /// <typeparam name="T">Security Group</typeparam>
    public class SecurityGroupController<T> : MultitenantControllerBase<SecurityGroupViewModel<T>>
        where T : SecurityGroup, new()
    {
        #region Public Variables

        /// <summary>
        /// Gets or sets the controller internal.
        /// </summary>
        /// <value>The controller internal.</value>
        public SecurityGroupControllerInternal<T> controllerInternal { get; set; }

        /// <summary>
        /// Security Group System DBLinkType controller internal
        /// </summary>
        public SecurityGroupSystemControllerInternal<T> securityGroupSystemControllerInternal { get; set; }

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor for Security Group
        /// </summary>
        /// <param name="container">Unity Container</param>
        public SecurityGroupController(IUnityContainer container)
            : base(container, ScreenName.SecurityGroup)
        {
        }

        #endregion

        #region Initialize MultitenantControllerBase

        /// <summary>
        /// Override Initialize method
        /// </summary>
        /// <param name="requestContext">Request Context</param>
        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            base.Initialize(requestContext);
            controllerInternal = new SecurityGroupControllerInternal<T>(Context);
            securityGroupSystemControllerInternal = new SecurityGroupSystemControllerInternal<T>(Context);
        }

        #endregion

        #region Actions

        /// <summary>
        /// Get default Index page
        /// </summary>
        /// <param name="programId">Program Id</param>
        /// <param name="programVersion">Program Version</param>
        /// <param name="groupId">Group Id</param>
        /// <returns>Security Group View Model</returns>
        public virtual ActionResult Index(string programId, string programVersion, string groupId)
        {
            try
            {

                T model = new T();
                model.ProgramId = programId;
                model.ProgramVersion = programVersion;
                model.GroupId = groupId;
                var securityGroup = controllerInternal.Get(model);
                return View(securityGroup);
            }

            catch (Exception)
            {
                return View(new SecurityGroupViewModel<T>());
            }
        }

        /// <summary>
        /// Get Security Groups
        /// </summary>
        /// <param name="model">Security group Model</param>
        /// <returns>Json object for Security group </returns>
        public virtual JsonNetResult Get(T model)
        {
            try
            {
                var securityGroup = controllerInternal.Get(model);
                return JsonNet(securityGroup);
            }

            catch (BusinessException businessException)
            {
                return JsonNet(BuildErrorModelBase(CommonResx.GetFailedMessage, businessException, SecurityGroupsResx.SecGrpRecType));
            }
        }


        /// <summary>
        /// Update groups in SecurityGroup
        /// </summary>
        /// <param name="pageNumber">Page Number</param>
        /// <param name="pageSize">Page Size</param>
        /// <param name="filter">Filter</param>
        /// <returns>Json object for Security group</returns>
        [HttpPost]
        public virtual JsonNetResult GetSecurityAccess(int pageNumber, int pageSize, IList<IList<filter.Filter>> filter)
        {
            try
            {
                return JsonNet(controllerInternal.GetSecurityAccess(filter));
            }
            catch (BusinessException businessException)
            {
                return JsonNet(BuildErrorModelBase(CommonResx.SaveFailedMessage, businessException));
            }
        }

        /// <summary>
        /// Gets Security access for GroupId
        /// </summary>
        /// <param name="model">Security group Model</param>
        /// <returns>Json object for Security group </returns>
        public virtual JsonNetResult GetByGroupId(T model)
        {
            try
            {
                var accessList = controllerInternal.GetByGroupId(model);
                return JsonNet(accessList);
            }
            catch (BusinessException businessException)
            {
                return JsonNet(BuildErrorModelBase(CommonResx.GetFailedMessage, businessException, SecurityGroupsResx.SecGrpRecType));
            }
        }


        /// <summary>
        ///  creates new group for selected application
        /// </summary>
        /// <param name="model">Security group Model</param>
        /// <returns>Json object for Security group </returns>
        public virtual JsonNetResult Create(T model)
        {
            return JsonNet(controllerInternal.Create(model));
        }


        /// <summary>
        /// Add new security Group for an application
        /// </summary>
        /// <param name="model">Security group Model</param>
        /// <returns>Json object for Security group </returns>
        [HttpPost]
        public virtual JsonNetResult Add(T model)
        {
            try
            {
                ViewModelBase<ModelBase> viewModel;
                return ValidateModelState(ModelState, out viewModel)
                    ? JsonNet(securityGroupSystemControllerInternal.Add(model))
                    : JsonNet(viewModel);
            }
            catch (BusinessException businessException)
            {
                return
                    JsonNet(BuildErrorModelBase(CommonResx.AddFailedMessage, businessException,
                        SecurityGroupsResx.Entity));
            }
        }


        /// <summary>
        /// Update groups in SecurityGroup
        /// </summary>
        /// <param name="model">Security group Model</param>
        /// <returns>Json object for Security group </returns>
        [HttpPost]
        public virtual JsonNetResult Save(T model)
        {
            try
            {
                ViewModelBase<ModelBase> viewModel;
                return ValidateModelState(ModelState, out viewModel)
                    ? JsonNet(securityGroupSystemControllerInternal.Save(model))
                    : JsonNet(viewModel);
            }
            catch (BusinessException businessException)
            {
                return JsonNet(BuildErrorModelBase(CommonResx.SaveFailedMessage, businessException));
            }
        }

        /// <summary>
        /// Delete groups in SecurityGroup
        /// </summary>
        /// <param name="programId">Program Id</param>
        /// <param name="programVersion">Program Version</param>
        /// <param name="groupId">Group Id</param>
        /// <returns>Json object for Security group </returns>
        public virtual JsonNetResult Delete(string programId, string programVersion, string groupId)
        {
            try
            {
                return JsonNet(securityGroupSystemControllerInternal.Delete(programId, programVersion, groupId));
            }
            catch (BusinessException businessException)
            {

                return
                   JsonNet(BuildErrorModelBase(CommonResx.DeleteFailedMessage, businessException,
                       SecurityGroupsResx.Entity));
            }
        }

        #endregion

    }
}