zswin后台管理框架基本完成！后台访问地址admin.php QQ群： 228550381。

此框架仅仅是为了方便大家去开发互联网站或者政府系统，省去朋友们开发基础功能和基础界面的时间。

具体的页面UI和美化还需要大家去发挥想象和聪明才智！

功能介绍：

1、菜单功能

对大项菜单进行编辑

2、节点功能

对系统功能进行编辑，小到一个写入insert的函数都可以在这里增加或删除或编辑

3、角色管理

对系统的用户组进行编辑，可以增加例如领导组、员工组，并且设置相应的权限组访问权限，并且可以设置哪些用户属于哪些权限组，下级权限组将继承上级权限组的相关权限

4、用户管理

对系统用户进行管理

5、日志管理

系统用户在系统中进行了何种操作均可以记录！

6、数据备份恢复

数据的备份和恢复

7、列表可以进行导出excle ，演示在用户管理列表的导出

8、借用了onethink的插件机制，便于大家将来扩展功能插件.

9、增加了网站配置相关

10、节点管理增加的节点菜单将会生成相应的controller文件和index.html文件（如果不是生成的默认index操作，则不会生成相应文件）

ThinkPHP所作更改：

1、在/ThinkPHP/Library/Vendor/中的PHPMailer类
3、增加了library下面的OT文件夹
4、在library/org/util/中的phpexcel类为后添加的
5、在library/org/util/中的rbac.class.php中，
     static function saveAccessList($authId=null) {
        if(null===$authId)   $authId = $_SESSION[C('USER_AUTH_KEY')];
        // 如果使用普通权限模式，保存当前用户的访问权限列表
        // 对管理员开发所有权限
        //if(C('USER_AUTH_TYPE') !=2 && !$_SESSION[C('ADMIN_AUTH_KEY')] )
        //更改为只要不是管理员，都保存权限列表放到session中
        if(!$_SESSION[C('ADMIN_AUTH_KEY')] )
            $_SESSION['_ACCESS_LIST']	=	self::getAccessList($authId);
        return ;
      }
作用是虽然启用的是实时验证，但是仍然缓存了权限菜单的session，用于生成网站左侧的菜单项

6、增加PHPImageWorkshop文件夹，在ThinkPHP\Library\Vendor下面
7、改动parse_res_name函数，在common/function.php,因为增加了命名空间的判断，导致一些model不能正常加载，现已去掉