/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region namespaces

using Microsoft.Practices.Unity;
using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.BusinessRepository;
using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Web.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Interfaces.Service;
using Sage.CA.SBS.ERP.Sage300.Common.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Models.Process;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Controllers.Process;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Utilities;

#endregion

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers
{
    /// <summary>
    /// Initializes the specified request context
    /// </summary>
    public class DataIntegrityControllerInternal<T, TViewModel, TService> :
        ProcessControllerInternal<T, DataIntegrityViewModel<T>, IDataIntegrityService<T>>
        where T : DataIntegrity, new()
        where TViewModel : DataIntegrityViewModel<T>, new()
        where TService : IDataIntegrityService<T>, ISecurityService
    {
        #region Constructor

        /// <summary>
        /// Initializes a new instance of the Data Integrity
        /// </summary>
        /// <param name="context">context</param>
        public DataIntegrityControllerInternal(Context context)
            : base(context)
        {
        }

        #endregion

        #region Service Methods

        /// <summary>
        ///Get Application List
        /// </summary>
        /// <returns>Json object for Data Integrity </returns>
        internal DataIntegrityViewModel<T> GetApplicationList()
        {
            var dataIntegrityModel = new DataIntegrityViewModel<T>();
            var dataService = Service.Get();
            if (dataService != null)
            {
                dataIntegrityModel.Data = dataService;
                dataIntegrityModel.UserMessage = new UserMessage(dataService);
                dataIntegrityModel.ProcessResult = new ProcessResult { ProgressMeter = new ProgressMeter() };
            }
            return dataIntegrityModel;
        }

        /// <summary>
        ///Check for process
        /// </summary>
        /// <returns>Json object for Data Integrity </returns>
        internal DataIntegrityViewModel<T> Check(T model)
        {
            var dataIntegrityModel = new DataIntegrityViewModel<T>();

            var dataIntegrirtyService = Utilities.Resolve<IDataIntegrityService<T>>(Context);

            T dataService;
            dataService = dataIntegrirtyService.Process(model);

            if (dataService != null)
            {
                dataIntegrityModel.Data = dataService;
            }
            return dataIntegrityModel;
        }

        #endregion

    }



}