//phuc vu xu ly api
const oracledb = require("oracledb");
const database = require("../public/js/config");

const baseQuery = `select CONTACT_NAME "contact_name",
    FULL_NAME "full_name",
    DEPT "dept",
    DEPT_NAME "dept_name"
    from CONTCTSM1
    where 1 = 1`;

const sortableColumns = ["contact_name", "full_name", "dept", "dept_name"];
async function find(context) {
  let query = baseQuery;
  const binds = {};
  if (context.contact_name) {
    binds.CONTACT_NAME = context.contact_name;

    query += "\nand CONTACT_NAME = :CONTACT_NAME";
  }
  if (context.full_name) {
    binds.FULL_NAME = context.full_name;

    query += "\nand FULL_NAME = :FULL_NAME";
  }
  if (context.dept) {
    binds.DEPT = context.dept;

    query += "\nand DEPT = :DEPT";
  }
  if (context.dept_name) {
    binds.DEPT_NAME = context.dept_name;

    query += "\nand DEPT_NAME = :DEPT_NAME";
  }
  //sort
  if (context.sort === undefined) {
    query += "\norder by CONTACT_NAME asc";
  } else {
    let [column, order] = context.sort.split(":");

    if (!sortableColumns.includes(column)) {
      throw new Error('Invalid "sort" column');
    }

    if (order === undefined) {
      order = "asc";
    }

    if (order !== "asc" && order !== "desc") {
      throw new Error('Invalid "sort" order');
    }

    query += `\norder by "${column}" ${order}`;
  }
  if (context.skip) {
    binds.row_offset = context.skip;

    query += "\noffset :row_offset rows";
  }
  const limit = context.limit > 0 ? context.limit : 10;

  binds.row_limit = limit;

  query += "\nfetch next :row_limit rows only";

  const result = await database.Open(query, binds);

  return result.rows;
}
module.exports.find = find;