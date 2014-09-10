using Microsoft.Practices.Unity;
using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Web.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Models.Enums;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Controllers.Reports;

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers
{
    /// <summary>
    /// Class for Data Integrity Report Controller
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class DataIntegrityReportController<T> :
          ReportController<T, DataIntegrityReportViewModel<T>,
              DataIntegrityReportControllerInternal<T, DataIntegrityReportViewModel<T>, IDataIntegrityReportService<T>>,
              IDataIntegrityReportService<T>>
          where T : DataIntegrityReport, new()
    {
       
        #region Constructor

        /// <summary>
        /// Data Integrity Report Controller Constructor
        /// </summary>
        /// <param name="container">IUnityContainer</param>
        public DataIntegrityReportController(IUnityContainer container)
            : base(container, context => new DataIntegrityReportControllerInternal<T, DataIntegrityReportViewModel<T>,
                IDataIntegrityReportService<T>>(context),ScreenName.DataIntegrity)
        {
        }

        #endregion
    }
}