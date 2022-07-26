const { Router } = require("express");
const router = Router();
const config = require("../public/js/config");
const contacts = require("../db_apis/contacts");
//lấy dữ liệu
router.get("/", async (req, res) => {
  //lay Array trung tam
  sql = "select distinct DEPT from CONTCTSM1 where DEPT is not null";
  let result = await config.Open(sql, [], false);
  trungTam = [];
  result.rows.map((item) => {
    trungTam.push(item.toString());
  });
  //lay Array phong ban
  sql1 =
    "select distinct DEPT_NAME from CONTCTSM1  where DEPT_NAME is not null";
  let result1 = await config.Open(sql1, [], false);
  console.log(result1);
  phongBan = [];
  result1.rows.map((item) => {
    phongBan.push(item.toString());
  });
  // console.log(phongBan);
  res.render("contacts", {
    phongBan: phongBan,
    trungTam: trungTam,
  });
});
router.get("/test_data", async (req, res) => {
  sql = "select distinct DEPT from CONTCTSM1";
  let result = await config.Open(sql, [], false);
  Users = [];
  console.log(result.rows);
  result.rows.map((user) => {
    Users.push(user.toString());
  });
  res.send(Users);
});

router.get("/get_data", async (request, response, next) => {
  var draw = request.query.draw;

  var start = request.query.start;

  var length = request.query.length;

  var order_data = request.query.order;

  if (typeof order_data == "undefined") {
    var column_name = "CONTCTSM1.CONTACT_NAME";

    var column_sort_order = "asc";
  } else {
    var column_index = request.query.order[0]["column"];

    var column_name = request.query.columns[column_index]["data"];

    var column_sort_order = request.query.order[0]["dir"];
  }

  //search data

  var search_value = request.query.search["value"];

  var search_query = `
     (CONTACT_NAME LIKE '%${search_value}%'
      OR FULL_NAME LIKE '%${search_value}%'
      OR DEPT LIKE '%${search_value}%'
      OR DEPT_NAME LIKE '%${search_value}%'
     )
    `;
  var sql = "SELECT COUNT(*) AS Total FROM CONTCTSM1";
  let result = await config.Open(sql, [], false);
  var total_records = result["rows"][0][0];
  var sql2 = `SELECT COUNT(*) AS Total FROM CONTCTSM1 WHERE ${search_query}`;
  let result2 = await config.Open(sql2, [], false);
  var total_records_with_filter = result2["rows"][0][0];
  var query = `
            SELECT * FROM CONTCTSM1
            WHERE ${search_query} 
            ORDER BY ${column_name} ${column_sort_order} 
            OFFSET ${start} ROWS FETCH NEXT ${length} ROWS ONLY
            `;
  var data_arr = [];
  let result3 = await config.Open(query, [], false);
  data_arr = [];
  result3.rows.map((user) => {
    let userSchema = {
      CONTACT_NAME: user[0],
      FULL_NAME: user[85],
      DEPT: user[4],
      DEPT_NAME: user[82],
    };
    data_arr.push(userSchema);
  });
  console.log(data_arr);
  var output = {
    draw: draw,
    iTotalRecords: total_records,
    iTotalDisplayRecords: total_records_with_filter,
    aaData: data_arr,
  };

  response.json(output);
});

module.exports = router;
