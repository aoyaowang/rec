<?php

//公共函数
/**
 * 获取配置的类型
 * @param string $type 配置类型
 * @return string
 */
function get_config_type($type=0){
    $list = C('CONFIG_TYPE_LIST');
    return $list[$type];
}
/**
 * 获取配置的分组
 * @param string $group 配置分组
 * @return string
 */
function get_config_group($group=''){
    $list = C('CONFIG_GROUP_LIST');
    
    if($group==''){
    	return '全部';
    }
    if($group == 0){
    	return '未分组';
    }
    return $list[$group];
}
function getmodulename(){
	
	//日志记录时得到模块名
	$map['name']=CONTROLLER_NAME;
	$map['level']=2;
	$title=D('node')->where($map)->getField('title');
	return $title?$title:CONTROLLER_NAME;
}
function getactionname(){
	//日志记录时得到操作名
	$map['name']=ACTION_NAME;
	$map['level']=3;
	$title=D('node')->where($map)->getField('title');
	return $title?$title:ACTION_NAME;
}
function getzonename($id){
	//将id转化为地名
	$map['id']=$id;
	$name=D('district')->where($map)->getField('name');
	return $name;
	
}
function getzoneid($name){
	//导入表格的时候用来将地名转化为id
	$map['name']=$name;
	$name=D('district')->where($map)->getField('id');
	return $name;
	
}
function getDefaultStyle($style) {
	if (empty($style)) {
		return 'blue';
	} else {
		return $style;
	}
}
function get_pawn($pawn) {
	if ($pawn == 0)
	return "<span style='color:green'>没有</span>";
	else
	return "<span style='color:red'>有</span>";
}

function get_patent($patent) {
	if ($patent == 0)
	return "<span style='color:green'>没有</span>";
	else
	return "<span style='color:red'>有</span>";
}


function getStatus($status, $imageShow = true) {
	switch ($status) {
		case 0 :
			$showText = '禁用';
			$showImg = '<i style="padding-left:5px;font-size:20px;" class="icon-lock color-warning"></i>';
			break;
		case 2 :
			$showText = '待审';
			$showImg = '<i style="padding-left:5px;font-size:20px;" class="icon-question color-warning"></i>';
			break;
		case - 1 :
			$showText = '删除';
			$showImg = '<i style="padding-left:5px;font-size:20px;" class="icon-remove color-danger"></i>';
			break;
		case 1 :
		default :
			$showText = '正常';
			$showImg = '<i style="padding-left:5px;font-size:20px;" class="icon-ok color-success"></i>';
	}
	return ($imageShow === true) ? $showImg : $showText;
}
// zhanghuihua@msn.com
function showStatus($status, $id, $callback="") {
	switch ($status) {
		case 0 :
			$info = '<a href="'.__MODULE__.'/'.CONTROLLER_NAME.'/resume/id/' . $id . '/navTabId/'.CONTROLLER_NAME.'"  class="btn btn-success btn-sm" target="ajaxTodo"   ><i class="icon-building"></i> 启用</a>';
			break;
		case 2 :
			$info = '<a href="'.__MODULE__.'/'.CONTROLLER_NAME.'/pass/id/' . $id . '/navTabId/'.CONTROLLER_NAME.'"  class="btn btn-success btn-sm" target="ajaxTodo"  ><i class="icon-legal"></i> 批准</a>';
			break;
		case 1 :
			$info = '<a href="'.__MODULE__.'/'.CONTROLLER_NAME.'/forbid/id/' . $id . '/navTabId/'.CONTROLLER_NAME.'"  class="btn btn-success btn-sm" target="ajaxTodo"  ><i class="icon-minus-sign"></i> 禁用</a>';
			break;
		case - 1 :
			$info = '<a href="'.__MODULE__.'/'.CONTROLLER_NAME.'/recycle/id/' . $id . '/navTabId/'.CONTROLLER_NAME.'"  class="btn btn-success btn-sm" target="ajaxTodo"  ><i class="icon-repeat"></i> 还原</a>';
			break;
	}
	return $info;
}
// zhanghuihua@msn.com
function showShow($show, $id, $callback="") {
	switch ($show) {
		case 0 :
			$info = '<a href="'.__MODULE__.'/'.CONTROLLER_NAME.'/willshow/id/' . $id . '/navTabId/'.CONTROLLER_NAME.'"  class="btn btn-success btn-sm" target="ajaxTodo" ><i class="icon-eye-open"></i> 显示</a>';
			break;
		case 1 :
			$info = '<a href="'.__MODULE__.'/'.CONTROLLER_NAME.'/willhidden/id/' . $id . '/navTabId/'.CONTROLLER_NAME.'"  class="btn btn-success btn-sm" target="ajaxTodo" ><i class="icon-eye-close"></i> 隐藏</a>';
			break;

	}
	return $info;
}
function getGroupName($id) {
	if ($id == 0) {
		return '无上级组';
	}
	if ($list = F('groupName')) {
		return $list [$id];
	}
	$dao = D("Role");
	$list = $dao->select(array('field' => 'id,name'));
	foreach ($list as $vo) {
		$nameList [$vo ['id']] = $vo ['name'];
	}
	$name = $nameList [$id];
	F('groupName', $nameList);
	return $name;
}


function getGroupNameByUserId($id) {
	$RoleUser = M("RoleUser");
	$roleIdList = $RoleUser->where("user_id=$id")->find();
	$roleId = $roleIdList['role_id'];
	if ($roleId == 0) {
		return '无权限组';
	}

	$dao = D("Role");
	$list = $dao->select(array('field' => 'id,name'));
	foreach ($list as $vo) {
		$nameList [$vo ['id']] = $vo ['name'];
	}
	$name = $nameList [$roleId];
	return $name;
}
function getNodeName($id) {
	if (Session::is_set('nodeNameList')) {
		$name = Session::get('nodeNameList');
		return $name [$id];
	}
	$Group = D("Node");
	$list = $Group->getField('id,name');
	$name = $list [$id];
	Session::set('nodeNameList', $list);
	return $name;
}
function getNodeGroupName($id) {
	if (empty($id)) {
		return '未分组';
	}
	if (isset($_SESSION ['nodeGroupList'])) {
		return $_SESSION ['nodeGroupList'] [$id];
	}
	$Group = D("Group");
	$list = $Group->getField('id,title');
	$_SESSION ['nodeGroupList'] = $list;
	$name = $list [$id];
	return $name;
}