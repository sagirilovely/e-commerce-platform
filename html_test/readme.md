# 插入数据
### 插入完整行
- 以下这种做法依赖于表中的列的顺序与SELECT语句中列的顺序相同,因此不建议使用
```sql
insert into <表名>
values(<列1的值>, <列2的值>, <列3的值>, ...);
```
- 以下是`insert into` 的完整语法
```sql
insert into <表名> (<列名1>, <列名2>, <列名3>, ...)
values (<列1的值>, <列2的值>, <列3的值>, ...);
```
### 插入部分行
- 在insert语句中省略某些列的值,这些列的值将被设置为默认值
```sql
insert into <表名> (<列名1>, <列名3>)
values (<列1的值>, <列3的值>);
```
### 插入检索出的数据
- `insert into` 语句可以插入`select`语句检索出的数据
```sql
insert into <表名> (<列名1>, <列名2>, <列名3>, ...)
select <列名1>, <列名2>, <列名3>, ...
from <表名>;
```
# 更新数据
### 更新一行中的一列或多列
- 一定要使用`where`子句,否则会更新表中的所有行
```sql
update <表名>
set <列名1> = <新值1>, <列名2> = <新值2>, ...
where <条件>;
```
### 删除列
- 将某列的值设置为`null`与删除行是不同的,删除行会删除整行,而将某列的值设置为`null`只会删除该列的值
```sql
update <表名>
set <列名> = null
where <条件>;
```
# 删除行
- 一定要使用`where`子句,否则会删除表中的所有行
```sql
delete from <表名>
where <条件>;
```
##### 举例
```sql
delete from Customers
where CustomerName = 'Alfreds Futterkiste';
# 删除Customers表中CustomerName为'Alfreds Futterkiste'的行
```

# 视图
- 视图是基于SQL语句的结果集的可视化的虚拟表
- 视图不包含数据,每次使用视图时,数据库都会执行查询,因此显示的数据是表中最新的数据
- 视图可嵌套,即视图可以基于另一个视图
### 利用视图来简化多表查询
```sql
create view <视图名> as
select <列名1>, <列名2>, ...
from <表名1>, <表名2>, ...
where <条件>;
# 以后要用这些数据时,只需使用视图名即可
select <列名1>, <列名2>, ...
from <视图名>;
```
### 利用视图重新格式化检索出的数据
```sql
create view <视图名> as
select <列名1> as <新列名1>, <列名2> as <新列名2>, ...
from <表名>;
# 以后要用这些数据时,只需使用视图名即可
select <新列名1>, <新列名2>, ...
from <视图名>;
```
### 利用视图过滤不想要的数据
```sql
create view <视图名> as
select <列名1>, <列名2>, ...
from <表名>
where <条件>;
# 以后要用这些数据时,只需使用视图名即可
select <列名1>, <列名2>, ...
from <视图名>;
```

# 存储过程
- 存储过程是SQL语句和可选控制流语句的预编译集合,存储在数据库中,并可以接受参数和返回数据
- 存储过程可以封装复杂的业务逻辑,提高代码的可重用性和可维护性
- 存储过程可以减少网络传输,提高执行效率
- 存储过程使用编译好的SQL语句,减少了SQL语句的解析和编译时间
### 编写存储过程
- 参数:`out`表示输出参数,`in`表示输入参数
```sql
CREATE PROCEDURE <存储过程名>(<IN/OUT> <参数1> <数据类型1>, <IN/OUT> <参数2> <数据类型2>, ...)
BEGIN
    <SQL语句1>;
    <SQL语句2>;
    ...
END;
```
##### 举例
```sql
DELIMITER $$

CREATE PROCEDURE GetCustomerOrderCount(IN CustomerID INT, OUT OrderCount INT)
BEGIN
    SELECT COUNT(*) INTO OrderCount
    FROM Orders
    WHERE CustomerID = CustomerID;
END $$

DELIMITER ;
```
# 执行存储过程
```sql
CALL <存储过程名>(<参数1>, <参数2>, ...);
```
##### 举例
```sql
CALL GetCustomerOrderCount(1, @OrderCount);
# @OrderCount是一个用户定义的变量,用于存储存储过程的输出参数
```
# DELIMITER命令
- 在MySQL中，`DELIMITER`是一个命令行工具的命令，用于改变语句的分隔符。默认情况下，MySQL的语句分隔符是分号（`;`），这意味着当MySQL命令行客户端接收到一个分号时，它会认为这是一个完整的语句，并准备执行它。
- 然而，在某些情况下，特别是在定义存储过程、函数、触发器等时，我们需要在定义内部使用分号（`;`）作为SQL语句的一部分。如果使用默认的分隔符，MySQL会误认为这些内部的分号是语句的结束，从而导致语法错误或意外的行为。
- 为了解决这个问题，MySQL允许我们通过`DELIMITER`命令来改变语句的分隔符。这样，我们就可以在定义内部自由地使用分号，而不会结束整个定义。

### 使用`DELIMITER`的例子
1. 改变分隔符：
   默认情况下，分隔符是`;`。如果我们想要定义一个存储过程，我们首先需要改变分隔符，比如改成`$$`。

   ```sql
   DELIMITER $$
   ```
2. 定义存储过程：
   改变分隔符后，我们可以定义存储过程，其中包含多个以分号分隔的SQL语句。
   ```sql
   CREATE PROCEDURE MyProcedure()
   BEGIN
       SELECT 'Hello, World!';
       SELECT NOW();
   END $$
   ```
   在这里，我们使用`$$`作为分隔符，因此MySQL知道整个存储过程是一个单独的命令，直到遇到`END $$`才结束。
3. 恢复默认分隔符：
   定义完成后，我们需要将分隔符改回默认的分号，以便后续的SQL语句可以正常执行。
   ```sql
   DELIMITER ;
   ```
### 注意事项
- 嵌套分隔符：如果你需要在存储过程中定义另一个存储过程或函数，你可以再次改变分隔符，但需要记住恢复到上一个分隔符。
- 客户端支持：不是所有的MySQL客户端都支持`DELIMITER`命令。在某些图形界面工具或某些编程语言的数据库接口中，可能无法使用`DELIMITER`命令。
- 脚本文件：在运行包含存储过程定义的脚本文件时，通常不需要改变分隔符，因为脚本文件中的分号不会被MySQL命令行客户端解释为语句结束。
通过使用`DELIMITER`，我们可以在MySQL中灵活地定义复杂的存储过程和函数，而不必担心内部的分号导致的问题
# 用户自定义变量
在MySQL中，你可以使用`SET`语句或`DECLARE`语句来定义变量。这些变量通常用于存储过程中，但也可以用于普通的SQL语句中。
### 使用`SET`定义变量
- `SET`语句用于给已经定义的变量赋值。在使用`SET`之前，你需要使用`DECLARE`来声明变量。
```sql
SET @variable_name = value;
```
- `@variable_name`是你想要设置的变量的名称，以`@`符号开头，表示这是一个用户定义的会话级别的变量。
- `value`是你想要赋给变量的值。
例如：
```sql
SET @myVar = 10;
```
### 使用`DECLARE`定义变量
- `DECLARE`语句用于在存储过程中声明局部变量。
```sql
DECLARE variable_name DATATYPE;
```
- `variable_name`是你想要声明的变量的名称。
- `DATATYPE`是变量的数据类型，比如`INT`、`VARCHAR(255)`等。
例如，在存储过程中声明一个整型变量：
```sql
DELIMITER $$
CREATE PROCEDURE MyProcedure()
BEGIN
    DECLARE myVar INT;
    SET myVar = 10;
    -- 使用 myVar 做一些操作
END $$
DELIMITER ;
```
### 变量作用域
- 会话级别的变量：以`@`开头的变量是会话级别的，它们在整个数据库会话中都是可见的。
- 局部变量：在存储过程中声明的变量（使用`DECLARE`）是局部变量，它们只在存储过程内部可见。

### 变量初始化
在声明变量时，你可以同时初始化它们：
```sql
DECLARE myVar INT DEFAULT 10;
```
这行代码声明了一个名为`myVar`的整型变量，并将其默认值设置为`10`。

### 注意事项
- 变量名不能以数字开头
- 变量名是区分大小写的
- 变量名不能是MySQL的保留字，除非用反引号(`)将其括起来


