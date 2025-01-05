const sql = require('mssql');

// Azure SQL connection configuration
const config = {
  server: 'your-database-server.database.windows.net', // Azure SQL server name
  database: 'your-database-name',
  authentication: {
    type: 'azure-active-directory-msi-app-service', // Use MSI if your app is hosted on Azure
  },
  options: {
    encrypt: true, // Required for Azure SQL
    enableArithAbort: true,
  },
};

async function fetchDataFromDB(query) {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  }
}

module.exports = { fetchDataFromDB };