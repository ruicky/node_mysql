create table customer
(
	id int(10) unsigned auto_increment
		primary key,
	name varchar(60) null comment '姓名',
	mobile varchar(30) null comment '手机号',
	mail varchar(100) null comment '邮箱',
	created datetime not null comment '创建时间',
)
comment '用户表'
;

create table address
(
	id int(10) unsigned auto_increment
		primary key,
	address varchar(100) null comment '地址',
	
)
comment '地址表'
;
