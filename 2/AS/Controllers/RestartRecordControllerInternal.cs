/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region

using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Web.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Resources;
using Sage.CA.SBS.ERP.Sage300.AS.Resources.Forms;
using Sage.CA.SBS.ERP.Sage300.Common.Web;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

#endregion

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers
{
    /// <summary>
    /// Class Restart Maintenance Controller Internal.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class RestartRecordControllerInternal<T> :
         InternalControllerBase<IRestartRecordService<T>>
        where T : RestartRecord, new()
    {
        #region Constructor

        /// <summary>
        /// Restart Maintenance controller internal constructor
        /// </summary>
        /// <param name="context">Context</param>
        public RestartRecordControllerInternal(Context context)
            : base(context)
        {
        }

        #endregion

        #region Public methods

        /// <summary>
        /// Delete Restart Record using Restart Number
        /// </summary>
        /// <param name="restartNumbers">restartNumbers</param>
        /// <returns>Return A Type of RestartRecord</returns>
        internal RestartRecordViewModel<T> Delete(int[] restartNumbers)
        {
            List<int> restartNumbersList = new List<int>(restartNumbers);
            restartNumbersList.ForEach(item =>
                {
                    T asRestartRecord = Service.Delete(restartRecords => restartRecords.RestartNumber == item);
                });

            return new RestartRecordViewModel<T>
            {
                Data = new T(),
                UserMessage = new UserMessage(new T(),
                        string.Format(CommonResx.DeleteSuccessMessage, restartNumbers.Length, RestartMaintenanceResx.Entity))
            };
        }


        /// <summary>
        /// Fetch Restart Record Based on the Parameters PageNo,pageSize and Filters
        /// </summary>
        /// <param name="pageNumber">pageNumber</param>
        /// <param name="pageSize">pageSize</param>
        /// <param name="filters">filters</param>
        /// <returns>A Type of RestartRecordsViewModel</returns>
        internal RestartRecordViewModel<T> Get(int pageNumber, int pageSize, Expression<Func<T, bool>> filters)
        {
            if(filters == null)
            {
                filters = (restarRecord => restarRecord.DatabaseID == Context.Company);
            }
            EnumerableResponse<T> itemList = Service.GetRestartRecord(pageNumber, pageSize, filters);
            return new RestartRecordViewModel<T>
            {
                DataList = itemList.Items,
                UserMessage = new UserMessage(itemList),
                TotalResultsCount = itemList.TotalResultsCount,
            };

        }

        #endregion


    }
}