/**
 * 在这里定义和图片管理相关的路由处理函数
 * 供/router/imgManage.js模块进行调用
 * 包括获取图片、通过图片、拒绝图片、删除图片、置顶图片
 */
const db = require("../db/index");

//获取图片列表
exports.getImgs = (req, res) => {
  const pagesize = parseInt(req.query.pagesize);
  const pagenum = parseInt(req.query.pagenum);
  const offset = (pagenum - 1) * pagesize;
  const sql = "SELECT * FROM images ORDER BY id ASC LIMIT ? OFFSET ?";

  //数据总条数
  db.query("SELECT COUNT(*) AS total FROM images", (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: "Database error" });
    } else {
      const total = results[0].total;
      //获取当前页图片列表
      db.query(sql, [pagesize, offset], (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ error: "Database error" });
        }
        let imagesList = results;
        //是否有图片被置顶
        // console.log(req.query.top);
        // if (req.query.top) {
        //   db.query(
        //     "SELECT * FROM images WHERE id = ${req.query.top}",
        //     (err, results) => {
        //       if (err) {
        //         console.log(err);
        //         return res.status(500).send({ error: "Database error" });
        //       }
        //       const topItem = results[0];
        //       imagesList = imagesList.filter((item) => item.id != topItem.id);
        //       imagesList.unshift(topItem);
        //     }
        //   );
        // }
        res.send({
          status: 200,
          data: imagesList,
          total: total,
        });
        //设置图片缓存时间
        res.setHeader("Cache-Control", "max-age=300"); // 设置缓存时间为300秒（5分钟）
      });
    }
  });
};

//通过图片
exports.passImg = (req, res) => {
  const id = req.params.id;
  const status = true;
  const sql = "UPDATE images SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).end({ error: "Database error" });
    } else {
      res.send({
        status: 200,
        message: "pass image successfully",
      });
    }
  });
};

//拒绝图片
exports.rejectImg = (req, res) => {
  const id = req.params.id;
  const status = false;
  const sql = "UPDATE images SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).end({ error: "Database error" });
    } else {
      res.send({
        status: 200,
        message: "reject image successfully",
      });
    }
  });
};

//删除图片
exports.deleteImg = (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM images WHERE id = ?";
  db.query(sql, id, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).end({ error: "Database error" });
    } else {
      res.send({
        status: 200,
        message: "delete image successfully",
      });
    }
  });
};

//置顶图片
// exports.topImg = (req, res) => {
//   const id = parseInt(req.params.id);
//   console.log(id);
//   const top = true;
//   console.log(top);
//   const sql = "UPDATE images SET top = ? WHERE id = ?";
//   db.query(sql, [top, id], (err, results) => {
//     if (err) {
//       console.log(err);
//       res.status(500).end({ error: "Database error" });
//     }
//     res.send({
//       status: 200,
//       message: "move image to top successfully",
//     });
//   });
// };
