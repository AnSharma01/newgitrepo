/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region

using System;
using System.Web.Mvc;
using Microsoft.Practices.Unity;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Resources.Forms;
using Sage.CA.SBS.ERP.Sage300.AS.Web.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Exceptions;
using Sage.CA.SBS.ERP.Sage300.Common.Resources;
using Sage.CA.SBS.ERP.Sage300.Common.Web;
using Sage.CA.SBS.ERP.Sage300.Common.Models;
using System.Linq.Expressions;
#endregion

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers
{
    /// <summary>
    /// Restart Record Maintenance Controller
    /// </summary>
    /// <typeparam name="T">Record Maintenance</typeparam>
    public partial class RestartRecordController<T> :
        MultitenantControllerBase<RestartRecordViewModel<T>>
        where T : RestartRecord, new()
    {
        /// <summary>
        /// 
        /// </summary>
        public RestartRecordControllerInternal<T> ControllerInternal { get; set; }

        #region Constructor

        /// <summary>
        /// Initializes a new instance of the <see cref="RestartRecordController{T}"/> class.
        /// </summary>
        /// <param name="container">The container.</param>
        public RestartRecordController(IUnityContainer container)
            : base(container)
        {
        }

        /// <summary>
        /// Initializes the specified request context.
        /// </summary>
        /// <param name="requestContext">The request context.</param>
        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            base.Initialize(requestContext);
            ControllerInternal = new RestartRecordControllerInternal<T>(Context);
        }
        #endregion


        #region Initialize MultitenantControllerBase

        

        #endregion

        #region Actions

        /// <summary>
        /// Loads Restart Maintenance
        /// </summary>
        /// <returns>ActionResult.</returns>
        public virtual ActionResult Index()
        {
            try
            {
                var restartRecords = 
                    new RestartRecordViewModel<T> {UserAccess = ControllerInternal.GetAccessRights()};
                return View(restartRecords);
            }
            catch
            {
                return View(new Error());
            }
        }
        
        /// <summary>
        /// Get Restart Records From Service
        /// </summary>
        /// <param name="pageNumber">pageNumber</param>
        /// <param name="pageSize">pageSize</param>
        /// <param name="filters">filters</param>
        /// <returns>Json Object of RestartRecords</returns>
        [HttpPost]
        public virtual JsonNetResult GetPagedRestartRecord(int pageNumber, int pageSize, Expression<Func<T, bool>> filters)
        {
            try
            {
                return JsonNet(ControllerInternal.Get(pageNumber, pageSize, filters));
            }
            catch (BusinessException businessException)
            {
                return
                    JsonNet(BuildErrorModelBase(CommonResx.GetFailedMessage, businessException,
                        RestartMaintenanceResx.Entity));
            }
        }



       /// <summary>
        /// Delete Restart Record taking refererence from RestartNumber
       /// </summary>
       /// <param name="restartNumbers"></param>
       /// <returns>JSonNet of RestartRecord</returns>
        [HttpPost]
        public JsonNetResult Delete(int[] restartNumbers)
        {
            try
            {
                return JsonNet(ControllerInternal.Delete(restartNumbers));
            }
            catch (BusinessException businessException)
            {
                return
                    JsonNet(BuildErrorModelBase(CommonResx.DeleteFailedMessage, businessException,
                        RestartMaintenanceResx.Entity));
            }
        }

        #endregion

    }
}