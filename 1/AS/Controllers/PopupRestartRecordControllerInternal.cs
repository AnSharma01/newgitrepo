/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region

using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Web.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Resources;
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
    public class PopupRestartRecordControllerInternal<T> :
         InternalControllerBase<IRestartRecordService<T>>
        where T : RestartRecord, new()
    {
        #region Constructor

        /// <summary>
        /// Restart Maintenance controller internal constructor
        /// </summary>
        /// <param name="context">Context</param>
        public PopupRestartRecordControllerInternal(Context context)
            : base(context)
        {
        }

        #endregion

        #region Public methods

        /// <summary>
        /// Delete Restart Record using Restart Number
        /// </summary>
        /// <param name="restartNumber">restartNumber</param>
        /// <returns>Return A Type of RestartRecord</returns>
        internal RestartRecordViewModel<T> Delete(int restartNumber)
        {
            T asRestartRecord = Service.Delete(restartRecords => restartRecords.RestartNumber == restartNumber);
            return new RestartRecordViewModel<T>
            {
                Data = new T(),
                UserMessage = new UserMessage(new T(), CommonResx.DeleteSuccessMessage)
            };
        }


        /// <summary>
        /// Fetch Restart Record Based on the Parameters PageNo,pageSize and Filters
        /// </summary>
        /// <param name="pageNumber">PageNumber</param>
        /// <param name="pageSize">PageSize</param>
        /// <param name="viewName">ViewName-Operation</param>
        /// <returns>A Type of RestartRecordsViewModel</returns>
        internal RestartRecordViewModel<T> Get(int pageNumber, int pageSize, string viewName)
        {
            EnumerableResponse<T> itemList = Service.GetRestartRecordsByViewName(pageNumber, pageSize, viewName);
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