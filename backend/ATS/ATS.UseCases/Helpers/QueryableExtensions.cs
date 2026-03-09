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
                    property = filter.Field.Split('.').Aggregate((Expression)parameter, Expression.PropertyOrField);
                }
                catch { continue; }

                if (!string.IsNullOrEmpty(filter.Filter))
                {
                    Expression? condition = null;
                    if (property.Type == typeof(string))
                    {
                        var method = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                        var filterValue = Expression.Constant(filter.Filter);
                        condition = Expression.Call(property, method!, filterValue);
                    }
                    else if (property.Type.IsEnum)
                    {
                        if (Enum.TryParse(property.Type, filter.Filter, true, out var enumValue))
                        {
                            condition = Expression.Equal(property, Expression.Constant(enumValue));
                        }
                    }
                    else if (property.Type == typeof(Guid))
                    {
                        if (Guid.TryParse(filter.Filter, out var guidValue))
                        {
                            condition = Expression.Equal(property, Expression.Constant(guidValue));
                        }
                    }

                    if (condition != null)
                        query = query.Where(Expression.Lambda<Func<T, bool>>(condition, parameter));
                }

                if (filter.From.HasValue)
                {
                    var body = Expression.GreaterThanOrEqual(property, Expression.Constant(filter.From.Value));
                    query = query.Where(Expression.Lambda<Func<T, bool>>(body, parameter));
                }
                if (filter.To.HasValue)
                {
                    var body = Expression.LessThanOrEqual(property, Expression.Constant(filter.To.Value));
                    query = query.Where(Expression.Lambda<Func<T, bool>>(body, parameter));
                }
            }

            return query;
        }

        public static IQueryable<T> ApplySorting<T>(this IQueryable<T> query, List<SortModel> sorts)
        {
            if (sorts == null || !sorts.Any()) return query;

            var expression = query.Expression;
            bool isFirstSort = true;

            foreach (var sort in sorts)
            {
                if (string.IsNullOrWhiteSpace(sort.Field)) continue;

                var parameter = Expression.Parameter(typeof(T), "x");
                Expression propertyAccess;
                try
                {
                    propertyAccess = sort.Field.Split(".").Aggregate((Expression)parameter, Expression.PropertyOrField);
                }
                catch { continue; }

                var lambda = Expression.Lambda(propertyAccess, parameter);
                string methodName = isFirstSort
                    ? (sort.Direction.ToLower() == "desc" ? nameof(Queryable.OrderByDescending) : nameof(Queryable.OrderBy))
                    : (sort.Direction.ToLower() == "desc" ? nameof(Queryable.ThenByDescending) : nameof(Queryable.ThenBy));

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
