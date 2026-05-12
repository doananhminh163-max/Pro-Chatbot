import mysql from "mysql2/promise";

const getConnection = async () => {
    const connection = await mysql.createConnection({
        port: 3306,
        host: "localhost",
        user: "root",
        database: "project1",
        password: "160306"
    });
    return connection;
}

export default getConnection;
