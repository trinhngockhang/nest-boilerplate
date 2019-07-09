export interface IDbService {
    getConnection();

    beginTransaction();

    rollbackTransaction(transaction);

    commitTransaction(transaction);

    query(sql, params?);

    queryOne(sql, params);

    execute(sql, params, transaction?);

}
