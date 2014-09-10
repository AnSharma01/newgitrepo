/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region namespaces
using Sage.CA.SBS.ERP.Sage300.AS.Resources.Forms;
using System.Linq;
using Microsoft.Practices.Unity;
using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Web.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Exceptions;
using Sage.CA.SBS.ERP.Sage300.Common.Models.Enums;
using Sage.CA.SBS.ERP.Sage300.Common.Resources;
using Sage.CA.SBS.ERP.Sage300.Common.Web;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Controllers.Process;
using System.Web.Mvc;
using System.Web.Routing;
#endregion

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers
{
    /// <summary>
    /// class for Data Integrity Controller
    /// </summary>
    public class DataIntegrityController<T> :
        ProcessController<T, DataIntegrityViewModel<T>,
        DataIntegrityControllerInternal<T, DataIntegrityViewModel<T>, IDataIntegrityService<T>>, IDataIntegrityService<T>>
        where T : DataIntegrity, new()
    {
        
        #region Private Variables

        #endregion

        #region Constructor

        /// <summary>
        /// Initializes a new instance of the DataIntegrityControllerInternal class.
        /// </summary>
        /// <param name="container">The container.</param>
        public DataIntegrityController(IUnityContainer container)
            : base(container, (context => new DataIntegrityControllerInternal<T, DataIntegrityViewModel<T>, IDataIntegrityService<T>>(context)), ScreenName.DataIntegrity)
        {
        }

        #endregion

        #region Initialize MultitenantControllerBase

        /// <summary>
        /// Initializes the specified request context.
        /// </summary>
        /// <param name="requestContext">The request context.</param>
        protected override void Initialize(RequestContext requestContext)
        {
            base.Initialize(requestContext);
            ControllerInternal = new DataIntegrityControllerInternal<T, DataIntegrityViewModel<T>, IDataIntegrityService<T>>(Context);
        }

        #endregion


   
        /// <summary>
        /// Index
        /// </summary>
        /// <returns> Data Integrity View</returns>
        public override ActionResult Index()
        {

            var dataIntegrityViewModel = ControllerInternal.GetApplicationList();
            return View(dataIntegrityViewModel);
        }

        /// <summary>
        /// Get the list
        /// </summary>
        /// <returns>Json object for Data Integrity Model</returns>

        public override JsonNetResult Get()
        {
            try
            {

                return JsonNet(ControllerInternal.GetApplicationList());
            }
            catch (BusinessException businessException)
            {
                return JsonNet(BuildErrorModelBase(CommonResx.GetFailedMessage, businessException, ""));
            }
        }
        /// <summary>
        /// check for process
        /// </summary>
        /// <returns>Json object for Data Integrity Model</returns>

        public virtual JsonNetResult Process(T model)
        {
            try
            {
                if (model.DataIntegrityList.Any())
                {
                    return JsonNet(ControllerInternal.Check(model));
                }
                var dataIntegrity = new DataIntegrityViewModel<T>();
                return JsonNet(dataIntegrity);
            }

            catch (BusinessException businessException)
            {
                return JsonNet(BuildErrorModelBase(CommonResx.GetFailedMessage, businessException, DataIntegrityResx.NoAppSelected));
            }


        }
    }
}