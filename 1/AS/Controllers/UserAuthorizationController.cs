/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region

using Microsoft.Practices.Unity;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Resources.Forms;
using Sage.CA.SBS.ERP.Sage300.AS.Web.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Exceptions;
using Sage.CA.SBS.ERP.Sage300.Common.Models.Enums;
using Sage.CA.SBS.ERP.Sage300.Common.Resources;
using Sage.CA.SBS.ERP.Sage300.Common.Web;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Utilities;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Web.Mvc;

#endregion

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers
{
    /// <summary>
    /// Class UserAuthorizationsController.
    /// </summary>
    /// <typeparam name="T">User</typeparam>
    public class UserAuthorizationController<T> : MultitenantControllerBase<UserAuthorizationViewModel<T>>
        where T : User, new()
    {
        #region Private Variables
        /// <summary>
        /// User Authorization controller internal
        /// </summary>
        public UserAthorizationControllerInternal<T> controllerInternal { get; set; }
        
        /// <summary>
        /// User Authorization System DBLinkType controller internal
        /// </summary>
        public UserAthorizationSystemControllerInternal<T> systemControllerInternal { get; set; }

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor for User Athorizations
        /// </summary>
        /// <param name="container">Unity Container</param>
        public UserAuthorizationController(IUnityContainer container)
            : base(container, ScreenName.UserAuthorizations)
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
            controllerInternal = new UserAthorizationControllerInternal<T>(Context);
            systemControllerInternal = new UserAthorizationSystemControllerInternal<T>(Context);
        }

        #endregion

        /// <summary>
        /// Index method
        /// </summary>
        /// <returns></returns>
        public ActionResult Index(string id)
        {
            Expression<Func<T, bool>> userFilter = null;
            if (!string.IsNullOrEmpty(id))
            {
                userFilter = user => user.UserID == id.ToUpper(); 
            }
            
            var userAuthViewModel = controllerInternal.Get(userFilter);
            return View(userAuthViewModel);
        }

        /// <summary>
        /// Retrieves the user by Id
        /// </summary>
        /// <param name="pageNumber">Page Number</param>
        /// <param name="pageSize">Page Size</param>
        /// <param name="filters">filters</param>
        /// <returns>Json object</returns>
        [HttpPost]
        public JsonNetResult Get(int pageNumber, int pageSize, IList<IList<Common.Models.Filter>> filters)
        {
            try
            {
                var userFilter = ExpressionBuilder<T>.CreateExpression(filters);
                return JsonNet(controllerInternal.Get(userFilter));
            }
            catch (BusinessException businessException)
            {
                return JsonNet(BuildErrorModelBase(CommonResx.GetFailedMessage, businessException, UserAuthorizationResx.Entity));
            }
        }

        /// <summary>
        /// Retrieves User Authorization by User Id
        /// </summary>
        /// <param name="pageNumber">Page Number</param>
        /// <param name="pageSize">Page Size</param>
        /// <param name="filters">filters</param>
        /// <returns>Json object</returns>
        [HttpPost]
        public JsonNetResult GetUserAuthorizationByUser(int pageNumber, int pageSize, IList<IList<Common.Models.Filter>> filters)
        {
            try
            {
                var userFilter = ExpressionBuilder<T>.CreateExpression(filters);
                return JsonNet(controllerInternal.GetUserAuthorizationByUser(pageNumber, pageSize, userFilter));
            }
            catch (BusinessException businessException)
            {
                return JsonNet(BuildErrorModelBase(CommonResx.GetFailedMessage, businessException, UserAuthorizationResx.Entity));
            }
        }

        /// <summary>
        /// Save User 
        /// </summary>
        /// <param name="model">User Model</param>
        /// <returns>Json object</returns>
        [HttpPost]
        public JsonNetResult Save(T model)
        {
            try
            {
                return JsonNet(systemControllerInternal.Save(model));
            }
            catch (BusinessException businessException)
            {
                return JsonNet(BuildErrorModelBase(CommonResx.SaveFailedMessage, businessException, UserAuthorizationResx.Entity));
            }
        }

        /// <summary>
        /// Retrieves Security Group based on Program Id and version Id and Security Group ID
        /// </summary>
        /// <param name="programId">programId</param>
        /// <param name="versionId">versionId</param>
        /// <param name="securityGroupId">securityGroupId</param>
        /// <returns>Json object</returns>
        [HttpPost]
        public JsonNetResult GetSecurityGroup(string programId, string versionId, string securityGroupId)
        {
            try
            {
                return JsonNet(controllerInternal.GetSecurityGroup(programId, versionId, securityGroupId));
            }
            catch (BusinessException businessException)
            {
                return JsonNet(BuildErrorModelBase(CommonResx.GetFailedMessage, businessException, SecurityGroupsResx.SecGrpRecType));
            }
        }
    }
}