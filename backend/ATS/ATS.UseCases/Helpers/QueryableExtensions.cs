using ATS.UseCases.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace ATS.UseCases.Helpers
{
    public static class QueryableExtensions
    {
        public static IQueryable<T> ApplySorting<T>(this IQueryable<T> query, List<SortModel> sorts)
        {
            if (sorts is null || !sorts.Any())
            {
                return query;
            }

            var expression = query.Expression;
            bool isFirstSort = true;

            foreach (var sort in sorts)
            {
                if (string.IsNullOrWhiteSpace(sort.Field))
                {
                    continue;
                }

                var parameter = Expression.Parameter(typeof(T), "x");
                Expression propertyAccess;

                try
                {
                    propertyAccess = sort.Field.Split(".")
                        .Aggregate((Expression)parameter, Expression.PropertyOrField);
                }
                catch (ArgumentException)
                {
                    continue;
                }

                var delegateType = typeof(Func<,>).MakeGenericType(typeof(T), propertyAccess.Type);
                var lambda = Expression.Lambda(delegateType, propertyAccess, parameter);

                string methodName = isFirstSort
                    ? (sort.Direction?.ToLower() == "desc" ? nameof(Queryable.OrderByDescending) : nameof(Queryable.OrderBy))
                    : (sort.Direction?.ToLower() == "desc" ? nameof(Queryable.ThenByDescending) : nameof(Queryable.ThenBy));

                expression = Expression.Call(
                    typeof(Queryable),
                    methodName,
                    new Type[] { typeof(T), propertyAccess.Type },
                    expression,
                    Expression.Quote(lambda));

                isFirstSort = false;
            }

            return query.Provider.CreateQuery<T>(expression);
        }
    }
}
