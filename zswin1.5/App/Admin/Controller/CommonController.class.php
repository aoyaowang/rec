<?php
namespace Admin\Controller;
use Think\Controller;
use Org\Util\Rbac;
use Think\Log;

class CommonController extends Controller {

	function _initialize($dwz_db_name = '') {

		if (!isset($_SESSION[C('USER_AUTH_KEY')])) {

			$this->redirect('Public/login');
		}
        $input= new \OT\Input();
       
       $input->noGPC();
	    /* 读取数据库中的配置 */
        $this->readconfig();
      
        //dump(C('CONFIG_GROUP_LIST'));
       
	   if($_SESSION[C('USER_AUTH_KEY')] != 1 && C('ADMIN_ALLOW_IP')){
            // 检查IP地址访问
            if(!in_array(get_client_ip(),explode(',',C('ADMIN_ALLOW_IP')))){
                $this->error('403:禁止访问');
            }
        }

		// 用户权限检查
		if (C('USER_AUTH_ON') && !in_array(CONTROLLER_NAME, explode(',', C('NOT_AUTH_MODULE')))) {
			


			if (!RBAC::AccessDecision()) {
				//检查认证识别号
				if (!$_SESSION[C('USER_AUTH_KEY')]) {
					//跳转到认证网关
					redirect(PHP_FILE . C('USER_AUTH_GATEWAY'));
				}
				// 没有权限 抛出错误
				if (C('RBAC_ERROR_PAGE')) {
					// 定义权限错误页面
					redirect(C('RBAC_ERROR_PAGE'));
				} else {
					if (C('GUEST_AUTH_ON')) {
						$this->assign('jumpUrl', PHP_FILE . C('USER_AUTH_GATEWAY'));
					}
					// 提示错误信息

					$this->mtReturn(300,'对不起，您的权限不足！请不要越级操作！');

				}
			}
		}
		$dwz_db_name = $dwz_db_name ? $dwz_db_name : strtolower(CONTROLLER_NAME);
		$this->dbname=$dwz_db_name;//取得当前操作的数据表的名称

	}
	public function readconfig(){
		
		 /* 读取数据库中的配置 */
        $config =   S('DB_CONFIG_DATA');
        if(!$config){
            $config =   api('Config/lists');
            S('DB_CONFIG_DATA',$config);
        }
        C($config); //添加配置
        return;
	}
	
	public function xlsout($filename='数据表',$headArr,$list){
			
		//导入PHPExcel类库，因为PHPExcel没有用命名空间，只能inport导入
		import("Org.Util.PHPExcel");
		import("Org.Util.PHPExcel.Writer.Excel5");
		import("Org.Util.PHPExcel.IOFactory.php");
		$this->getExcel($filename,$headArr,$list);
	}
	public function xlsin(){
			
		//导入PHPExcel类库，因为PHPExcel没有用命名空间，只能inport导入
		import("Org.Util.PHPExcel");
		//要导入的xls文件，位于根目录下的Public文件夹
		$filename="./Public/1.xls";
		//创建PHPExcel对象，注意，不能少了\
		$PHPExcel=new \PHPExcel();
		//如果excel文件后缀名为.xls，导入这个类
		import("Org.Util.PHPExcel.Reader.Excel5");
		//如果excel文件后缀名为.xlsx，导入这下类
		//import("Org.Util.PHPExcel.Reader.Excel2007");
		//$PHPReader=new \PHPExcel_Reader_Excel2007();

		$PHPReader=new \PHPExcel_Reader_Excel5();
		//载入文件
		$PHPExcel=$PHPReader->load($filename);
		//获取表中的第一个工作表，如果要获取第二个，把0改为1，依次类推
		$currentSheet=$PHPExcel->getSheet(0);
		//获取总列数
		$allColumn=$currentSheet->getHighestColumn();
		//获取总行数
		$allRow=$currentSheet->getHighestRow();
		//循环获取表中的数据，$currentRow表示当前行，从哪行开始读取数据，索引值从0开始
		for($currentRow=1;$currentRow<=$allRow;$currentRow++){
			//从哪列开始，A表示第一列
			for($currentColumn='A';$currentColumn<=$allColumn;$currentColumn++){
				//数据坐标
				$address=$currentColumn.$currentRow;
				//读取到的数据，保存到数组$arr中
				$arr[$currentRow][$currentColumn]=$currentSheet->getCell($address)->getValue();
			}

		}
			
	}
	public	function getExcel($fileName,$headArr,$data){
		//对数据进行检验
		if(empty($data) || !is_array($data)){
			die("data must be a array");
		}
		//检查文件名
		if(empty($fileName)){
			exit;
		}

		$date = date("Y_m_d",time());
		$fileName .= "_{$date}.xls";


		//创建PHPExcel对象，注意，不能少了\
		$objPHPExcel = new \PHPExcel();
		$objProps = $objPHPExcel->getProperties();
			
		//设置表头
		$key = ord("A");
		foreach($headArr as $v){
			$colum = chr($key);
			$objPHPExcel->setActiveSheetIndex(0)->setCellValue($colum.'1', $v);
			$key += 1;
		}

		$column = 2;
		$objActSheet = $objPHPExcel->getActiveSheet();


		//设置为文本格式
		foreach($data as $key => $rows){ //行写入
			$span = ord("A");
			foreach($rows as $keyName=>$value){// 列写入
				$j = chr($span);

				$objActSheet->setCellValueExplicit($j.$column, $value);
				$span++;
			}
			$column++;
		}

		$fileName = iconv("utf-8", "gb2312", $fileName);
		//重命名表
		// $objPHPExcel->getActiveSheet()->setTitle('test');
		//设置活动单指数到第一个表,所以Excel打开这是第一个表
		$objPHPExcel->setActiveSheetIndex(0);
		header('Content-Type: application/vnd.ms-excel');
		header("Content-Disposition: attachment;filename=\"$fileName\"");
		header('Cache-Control: max-age=0');

		$objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
		$objWriter->save('php://output'); //文件通过浏览器下载
		exit;
	}
	protected function _list($model, $map, $asc = false) {
		
		//排序字段 默认为主键名
		if (isset($_REQUEST ['orderField'])) {
			$order = $_REQUEST ['orderField'];
		}
		if($order=='') {
			$order = $model->getPk();

		}
			
		//排序方式默认按照倒序排列
		//接受 sost参数 0 表示倒序 非0都 表示正序
		if (isset($_REQUEST ['orderDirection'])) {
			$sort = $_REQUEST ['orderDirection'];
		}
		if($sort=='') {
			$sort = $asc ? 'asc' : 'desc';

		}

		//取得满足条件的记录数
		$count = $model->where($map)->count();

		if ($count > 0) {


			$p = new \Think\Page($count, $listRows);
			//分页查询数据
			$numPerPage = empty($_REQUEST['numPerPage']) ? C('PAGE_LISTROWS') : $_REQUEST['numPerPage'];
			//上面的获得每页显示的数据条数
			// dump("`" . $order . "` " . $sort);
			//分页查询数据
			$voList = $model->where($map)->order("`" . $order . "` " . $sort)->limit($numPerPage)->page($_REQUEST[C('VAR_PAGE')])->select();
			// $voList = $model->where($map)->order("`" . $order . "` " . $sort)->limit($p->firstRow . ',' . $p->listRows)->select();

			//分页跳转的时候保证查询条件
			foreach ($map as $key => $val) {
				if (!is_array($val)) {
					$p->parameter .= "$key=" . urlencode($val) . "&";
				}
			}

			//分页显示
			$page = $p->show();
			//列表排序显示
			$sortImg = $sort; //排序图标
			$sortAlt = $sort == 'desc' ? '升序排列' : '倒序排列'; //排序提示
			$sort = $sort == 'desc' ? 1 : 0; //排序方式
			
		   if( method_exists($this, '_after_list')){
				
				$voList=$this->_after_list($voList);
			}
			
			//模板赋值显示
			$this->assign("map", $map);
			
			$this->assign('list', $voList);
			
			
			$this->assign('sort', $sort);
			$this->assign('order', $order);
			$this->assign('sortImg', $sortImg);
			$this->assign('sortType', $sortAlt);
			$this->assign("page", $page);
		}

			
		$this->assign('totalCount', $count);//数据总数
		$this->assign('currentPage', !empty($_REQUEST[C('VAR_PAGE')]) ? $_REQUEST[C('VAR_PAGE')] : 1);//当前的页数，默认为1
		$this->assign('numPerPage', $numPerPage); //每页显示多少条
		
		
		
			cookie('_currentUrl_', __SELF__);
		
		
		return;
	}

	public function index() {

		$model = D($this->dbname);
		$map = $this->_search();



		$this->assign("map", $map);
		
		if (method_exists($this, '_filter')) {
			$this->_filter($map);
		}
		
		if (!empty($model)) {
			$this->_list($model, $map);
		}
		$this->display();
	}

	protected function _search($dbname='') {
		//生成查询条件
		
		$dbname = $dbname ? $dbname : $this->dbname;
		
		$model = D($dbname);
		$map = array();
			
		foreach ($model->getDbFields() as $key => $val) {
			if (isset($_REQUEST [$val]) && $_REQUEST [$val] != '') {
				if(in_array($val, array('name','account'))){//需要模糊查询的字段，可再添加，如title等
					$map [$val] = array('like','%'.$_REQUEST [$val].'%');
				}else{
					$map [$val] = $_REQUEST [$val];
				}
					
			}
		}
		return $map;
	}

	protected function mtReturn($status,$info,$navTabId='',$callbackType='closeCurrent',$forwardUrl='',$rel='', $type='') {
		// 保证AJAX返回后也能保存日志
		 
	    if (C('LOG_RECORD'))
		 {
		 	
		 	\Think\Log::save();
		 	
		 }
		
		 	
		 	
		$result = array();
		

		if($navTabId==''){
			$navTabId=$_REQUEST['navTabId'];
		}
		if($status=='200'){
			$this->sysLogs('', $info);
		}
		if($status=='201'){
			$status=200;
		}


		$result['statusCode'] = $status; // dwzjs
		$result['navTabId'] = $navTabId; // dwzjs
		$result['callbackType'] = $callbackType; // dwzjs
		$result['message'] = $info; // dwzjs
		$result['forwardUrl'] = $forwardUrl;
		$result['rel'] = $rel;
			
		if (empty($type))
		$type = C('DEFAULT_AJAX_RETURN');
		if (strtoupper($type) == 'JSON') {
			// 返回JSON数据格式到客户端 包含状态信息
			header("Content-Type:text/html; charset=utf-8");
			exit(json_encode($result));
		} elseif (strtoupper($type) == 'XML') {
			// 返回xml格式数据
			header("Content-Type:text/xml; charset=utf-8");
			exit(xml_encode($result));
		} elseif (strtoupper($type) == 'EVAL') {
			// 返回可执行的js脚本
			header("Content-Type:text/html; charset=utf-8");
			exit($data);
		} else {
			// TODO 增加其它格式
		}
	}
	public function insert() {
			

		$model = D($this->dbname);
		if (false === $data= $model->create()) {

			$this->mtReturn(300, $model->getError());
		}
		if (method_exists($this, '_before_insert')) {
			$data = $this->_before_insert($data);
		}
		//保存当前数据对象
		$list = $model->add();
		if ($list !== false) {
			if( method_exists($this, '_after_insert')){
				
				$this->_after_insert($list);
			}
			$this->mtReturn(200, '新增成功!');

		} else {
			$this->mtReturn(300, '新增失败!');
		}
	}
    public function add($html='') {
		
		$this->display($html);
	}


	public function edit($html='') {
		
		$model = D($this->dbname);
		$id = $_REQUEST [$model->getPk()];
		$vo = $model->getById($id);
		$this->assign('vo', $vo);
		
		$this->display($html);
	}
	public function update() {
		$model = D($this->dbname);
		if (false === $data= $model->create()) {

			$this->mtReturn(300, $model->getError());
		}
		if (method_exists($this, '_before_update')) {
			$data = $this->_before_update($data);

		}
		// 更新数据
		$list = $model->save();
		if (false !== $list) {
			if( method_exists($this, '_after_update')){
				$pk = $model->getPk ();
			    $this->_after_update($data[$pk]);
			}

			$this->mtReturn(200, '编辑成功!');
		} else {

			$this->mtReturn(300, '编辑失败!');
		}
	}


	function foreverdelete(){
		$model = D($this->dbname);
		if (! empty ( $model )) {
			$pk = $model->getPk ();
			$id = $_REQUEST [$pk];
			if (isset ( $id )) {
				if (method_exists($this, '_before_foreverdelete')) {
					$this->_before_foreverdelete($id);
				
						
					
				}
					
				
				$condition = array ($pk => array ('in', explode ( ',', $id ) ) );
				if (false !== $model->where ( $condition )->delete ()) {
					if (method_exists($this, '_after_foreverdelete')) {
						   $this->_after_foreverdelete($id);
                     }
					$this->mtReturn(200, '删除成功！','','forward',cookie('_currentUrl_'));

				} else {
					$this->mtReturn(300, '删除失败！');

				}
			} else {
				$this->mtReturn(300, '非法操作！');
					
			}
		}
		$this->forward ();
	}
	public function selectedDelete() {
		$model = D($this->dbname);
		if (!empty($model)) {
			$pk = $model->getPk();
			$id = $_REQUEST ['ids'];
			if (isset($id)) {
				if (method_exists($this, '_before_selectedDelete')) {
					$this->_before_selectedDelete($id);

				}
				
				$condition = array($pk => array('in', explode(',', $id)));
				if (false !== $model->where($condition)->delete()) {
					if (method_exists($this, '_after_selectedDelete')) {
						$this->_after_selectedDelete($id);

					}
					$this->mtReturn(200, '删除成功！','','forward',cookie('_currentUrl_'));

				} else {
					$this->mtReturn(300, '删除失败！');

				}
			} else {
				$this->mtReturn(300, '非法操作');

			}
		}
		$this->forward();
	}





	public function forbid() {

		$model = D($this->dbname);
		$pk = $model->getPk();
		$id = $_REQUEST [$pk];
		$condition = array($pk => array('in', explode(',', $id)));
		$list = $model->where($condition)->setField('status',0);
		if ($list !== false) {
			$this->mtReturn(200, '禁用成功！','','forward',cookie('_currentUrl_'));

		} else {
			$this->mtReturn(300, '禁用失败！');

		}

	}

	function resume() {
		$model = D($this->dbname);
		$pk = $model->getPk();
		$id = $_GET [$pk];
		$condition = array($pk => array('in', explode(',', $id)));
		if (false !== $model->where($condition)->setField('status',1)) {

			$this->mtReturn(200, '恢复成功！','','forward',cookie('_currentUrl_'));

		} else {
			$this->mtReturn(300, '恢复失败！');

		}
	}
	public function willhidden() {

		$model = D($this->dbname);
		$pk = $model->getPk();
		$id = $_REQUEST [$pk];
		$condition = array($pk => array('in', explode(',', $id)));
		$list = $model->where($condition)->setField('show',0);
		if ($list !== false) {
			$this->mtReturn(200, '隐藏成功！','','forward',cookie('_currentUrl_'));

		} else {
			$this->mtReturn(300, '隐藏失败！');

		}

	}

	function willshow() {
		$model = D($this->dbname);
		$pk = $model->getPk();
		$id = $_GET [$pk];
		$condition = array($pk => array('in', explode(',', $id)));
		if (false !== $model->where($condition)->setField('show',1)) {

			$this->mtReturn(200, '显示成功！','','forward',cookie('_currentUrl_'));

		} else {
			$this->mtReturn(300, '显示失败！');

		}
	}





	function sysLogs($opname='未知', $message='未知') {
		$syslogs = D("Syslogs");
		$data = array();
		$ip = get_client_ip();
		$data['modulename'] = getmodulename();
		$data['actionname'] = getactionname();
		$data['opname'] = $opname;
		$data['message'] = $message;
		$data['username'] = session('loginUserName') . "(" . session('login_account') . ")";
		$data['userid'] = $_SESSION[C('USER_AUTH_KEY')];
		$data['userip'] = $ip;
		$data['create_time'] = time();
		$result = $syslogs->add($data);
	}

	/*
	 * 以下的函数尚未启用，主要用于将列表中的数据删除时并非直接删除，而是先放入回收站
	 * 如果需要恢复数据，可以点击回收站恢复
	 * 也可以在回收站彻底删除数据
	 *
	 *
	 * */
	public function pass() {
		$model = D($this->dbname);
		$pk = $model->getPk();
		$id = $_GET [$pk];
		$condition = array($pk => array('in', explode(',', $id)));
		if (false !== $model->where($condition)->setField('status',1)) {

			$this->mtReturn(200, '批准成功！','','forward',cookie('_currentUrl_'));

		} else {
			$this->mtReturn(300, '批准失败！');

		}
	}

	public function recycle() {
		$model = D($this->dbname);
		$pk = $model->getPk();
		$id = $_GET [$pk];
		$condition = array($pk => array('in', explode(',', $id)));
		if (false !== $model->where($condition)->setField('status',0)) {


			$this->mtReturn(200, '还原成功！','','forward',cookie('_currentUrl_'));

		} else {
			$this->mtReturn(300, '还原失败！');

		}
	}

	public function recycleBin() {
		$map = $this->_search();
		$map ['status'] = - 1;
		$model = D($this->dbname);
		if (!empty($model)) {
			$this->_list($model, $map);
		}
		$this->display();
	}

	public function delete() {
		$model = D($this->dbname);
		if (!empty($model)) {
			$pk = $model->getPk();
			$id = $_REQUEST [$pk];
			if (isset($id)) {
				
			    if (method_exists($this, '_before_delete')) {
					$this->_before_delete($id);
			   
				}
				
				
				
				$condition = array($pk => array('in', explode(',', $id)));
				$list = $model->where($condition)->setField('status', - 1);
				if ($list !== false) {

				    if (method_exists($this, '_after_delete')) {
						$this->_after_delete($id);

					}
					$this->mtReturn(200, '删除成功！','','forward',cookie('_currentUrl_'));

				} else {
					$this->mtReturn(300, '删除失败！');

				}
			} else {
				$this->mtReturn(300, '非法操作');

			}
		}
	}

	public function clear() {//彻底删除回收站
		$model = D($this->dbname);
		if (!empty($model)) {
			if (false !== $model->where('status=-1')->delete()) {

				$this->mtReturn(200, '彻底删除成功！','','forward',cookie('_currentUrl_'));

			} else {
				$this->mtReturn(300, '彻底删除失败！');

			}
		}
		$this->forward();
	}
}
?>