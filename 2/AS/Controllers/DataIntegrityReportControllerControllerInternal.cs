using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Web.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Controllers.Reports;

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers
{
    /// <summary>
    ///  Class for Data Integrity Report Controller Internal
    /// </summary>
    /// <typeparam name="T">DataIntegrity</typeparam>
    /// <typeparam name="TViewModel">ViewModel</typeparam>
    /// <typeparam name="TService">Service</typeparam>
    public class DataIntegrityReportControllerInternal<T, TViewModel, TService> : ReportControllerInternal<T, TViewModel, TService>
        where T : DataIntegrityReport, new()
        where TViewModel : DataIntegrityReportViewModel<T>, new()
        where TService : IDataIntegrityReportService<T>
    {
        #region Constructor

        /// <summary>
        /// Data Integrity Report Controller Internal Constructor
        /// </summary>
        /// <param name="context">context</param>
        public DataIntegrityReportControllerInternal(Context context)
            : base(context)
        {
        }

        #endregion
       
    }
}