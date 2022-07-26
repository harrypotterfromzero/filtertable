const oracledb = require("oracledb");

cns = {
  user: "CSEP_SEAM_OLD",
  password: "PAssw0rdA",
  connectString:
    "(DESCRIPTION =(ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST = 10.4.18.231)(PORT = 1521)))(CONNECT_DATA =(SID = ESDDEV)(SERVER = DEDICATED)))",
};

async function Open(sql, binds, autoCommit) {
  let cnn = await oracledb.getConnection(cns);
  let result = await cnn.execute(sql, binds, { autoCommit });
  cnn.release();
  return result;
}

exports.Open = Open;