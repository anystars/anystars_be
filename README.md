# anystars_be

anystars_be 为 AnyStars 项目的后端，为 anystars_fe、anystars.alfredworkflow 以及 anystars.crx 提供接口

## 数据库设计

后端服务需要本地数据库支持，数据库采用 MySQL。数据库名为 `anystars`，有三个表分别名为 `repositories`、`categories` 以及 `remarks`

建表代码：

```sql
CREATE TABLE `repositories` (
  `user_id` int(11) unsigned NOT NULL,
  `str` mediumtext,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `remarks` (
  `repo_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `remark` mediumtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

数据库建立成功后，需启动本地数据库服务

## 开发

```bash
npm install
npm run dev
```

确保 `8888` 端口没有被占用

## 部署

```bash
npm install
npm run prd
```

确保 `9999` 端口没有被占用

