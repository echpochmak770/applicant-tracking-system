using ATS.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace ATS.UseCases.Helpers
{
    public static class QueryableExtensions
    {
        public static IQueryable<T> ApplyDynamicQuery<T>(this IQueryable<T> query, PagedQuery request)
        {
            query = query.ApplyDynamicFilter(request.ColumnFilters);

            var sorts = request.ColumnFilters
                .Where(c => !string.IsNullOrEmpty(c.Sort))
                .Select(c => new SortModel
                {
                    Field = c.Field,
                    Direction = c.Sort!
                })
                .ToList();

            return query.ApplySorting(sorts);
        }

        public static IQueryable<T> ApplyDynamicFilter<T>(this IQueryable<T> query, List<ColumnFilter> filters)
        {
            if (filters == null || !filters.Any()) return query;

            foreach (var filter in filters)
            {
                if (string.IsNullOrEmpty(filter.Field)) continue;

                var parameter = Expression.Parameter(typeof(T), "x");
                Expression property;

                try
                {
                    property = filter.Field.Split('.')
                        .Aggregate<string, Expression>(parameter, Expression.PropertyOrField);
                }
                catch { continue; }

                if (!string.IsNullOrEmpty(filter.Filter))
                {
                    Expression? condition = null;
                    var targetType = Nullable.GetUnderlyingType(property.Type) ?? property.Type;

                    if (targetType == typeof(string))
                    {
                        var method = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                        condition = Expression.Call(property, method!, Expression.Constant(filter.Filter));
                    }
                    else if (targetType.IsEnum)
                    {
                        var values = filter.Filter.Split(',', StringSplitOptions.RemoveEmptyEntries);
                        var equals = values.Select(v => {
                            return Enum.TryParse(targetType, v.Trim(), true, out var res)
                                ? Expression.Equal(property, Expression.Constant(res, property.Type))
                                : null;
                        }).Where(e => e != null).Cast<Expression>().ToList();

                        if (equals.Any()) condition = equals.Aggregate(Expression.OrElse);
                    }
                    else if (targetType == typeof(Guid) && Guid.TryParse(filter.Filter, out var g))
                    {
                        condition = Expression.Equal(property, Expression.Constant(g, property.Type));
                    }
                    else if (targetType == typeof(bool) && bool.TryParse(filter.Filter, out var b))
                    {
                        condition = Expression.Equal(property, Expression.Constant(b, property.Type));
                    }

                    if (condition != null)
                        query = query.Where(Expression.Lambda<Func<T, bool>>(condition, parameter));
                }

                if (filter.From.HasValue)
                    query = query.Where(Expression.Lambda<Func<T, bool>>(Expression.GreaterThanOrEqual(property, Expression.Constant(filter.From.Value, property.Type)), parameter));
                if (filter.To.HasValue)
                    query = query.Where(Expression.Lambda<Func<T, bool>>(Expression.LessThanOrEqual(property, Expression.Constant(filter.To.Value, property.Type)), parameter));
            }
            return query;
        }

        public static IQueryable<T> ApplySorting<T>(this IQueryable<T> query, List<SortModel> sorts)
        {
            if (sorts == null || !sorts.Any()) return query;

            bool isFirstSort = true;
            foreach (var sort in sorts)
            {
                var parameter = Expression.Parameter(typeof(T), "x");
                Expression propertyAccess;

                try
                {
                    propertyAccess = sort.Field.Split('.')
                        .Aggregate<string, Expression>(parameter, Expression.PropertyOrField);
                }
                catch { continue; }

                var lambda = Expression.Lambda(propertyAccess, parameter);
                string methodName = isFirstSort
                    ? (sort.Direction.ToLower() == "desc" ? "OrderByDescending" : "OrderBy")
                    : (sort.Direction.ToLower() == "desc" ? "ThenByDescending" : "ThenBy");

                var resultExp = Expression.Call(
                    typeof(Queryable),
                    methodName,
                    new Type[] { typeof(T), propertyAccess.Type },
                    query.Expression,
                    Expression.Quote(lambda));

                query = query.Provider.CreateQuery<T>(resultExp);
                isFirstSort = false;
            }
            return query;
        }
    }
}
