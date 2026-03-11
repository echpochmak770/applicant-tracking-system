SELECT DISTINCT 
    v.Id AS VacancyId,
    v.Title AS VacancyTitle,
    v.Status,
    COUNT(DISTINCT a.Id) AS ApplicationsWithHistory,
    COUNT(ah.Id) AS TotalHistoryRecords
FROM Vacancies v
INNER JOIN Applications a ON a.VacancyId = v.Id
INNER JOIN ApplicationHistories ah ON ah.ApplicationId = a.Id
WHERE ah.IsDeleted = 0 
    AND a.IsDeleted = 0 
    AND v.IsDeleted = 0
GROUP BY v.Id, v.Title, v.Status
ORDER BY ApplicationsWithHistory DESC; 