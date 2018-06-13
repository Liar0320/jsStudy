
2:设置签名
    形式
        用户名：liar
        Email地址：
    作用
        区分不同开发人员的身份
    辨析
        这里设置的签名和登录远程库(代码托管中心)的账号、密码没有任何关系
    命令
        项目级别/仓库级别：仅在当前本地库范围内有效
            git config user.name Liar0320
            git config user.email 100108350@qq.com
            信息保存位置：./git/config文件
        系统用户级别：登录当前操作系统的用户范围
            git config --global user.name Liar0320
            git config --global user.email 100108350@qq.com
            信息保存位置：~/.gitconfig文件
        级别优先
            就近原则：项目级别优先于系统用户级别，二者都有时采用项目级别的签名
3:基本操作
  状态查看操作      git status 
  添加文件到缓存区  git add <filePath>  也可以是 . 代表全部     
  文件从缓冲区删除  git rm --cached <filePath> 
  文件添加提交注释  git commit -m "text" <fileName>  也可以是没有 代表全部
  查看历史提交版本  //多屏显示控制方式        空格向下翻页 b向上翻页 q退出
                   git log  
                   git log --pretty=oneline
                   git log --oneline  显示当前以后的
                   git reflog  显示全部历史记录
  前进后退
        本质{head}指针的移动
        基于索引值操作[推荐]
            git reset --hard [局部索引]
        使用^符号：只能后退
            git reset --hard HEAD^
            注：一个^表示后退一步，n个表示后退n步
        使用~符号：只能后退
            git reset --hard HEAD~n
            注：表示后退n步
        rest命令的三个参数对比
                --soft参数
                    仅仅在本地库移动HEAD指针
                                暂存区  工作区
                        本地库
                --mixed参数
                    在本地库移动HEAD指针
                    重置暂存区
                                    工作区
                        本地库  暂存区
                --hard参数
                    在本地库移动HEAD指针
                    重置暂存区
                    重置工作区
                                            
                        本地库  暂存区  工作区
4:分支操作
    创建分支
        git branch [分支名]
    查看分支
        git branch -v
    切换分支
    git checkout[分支名]
    合并分支
       第一步：切换到接受修改的分支（被合并，增加新内容）上
             git checkout [被合并分支名]
       第二部：执行merge命令
             git merge [有新内容分支名]
    解决冲突
        冲突的表现
            <<<<<<< HEAD
            冲突的内容        ------>当前分支内容
            ==========
            冲突的内容        ------>另一分支内容
            >>>>>>> MASTER 
        冲突的解决
            第一步：编辑文件，删除特殊符号
            第二步：把文件修改到满意的程度，保存退出
            第三步：git add[文件名]
            第四步：git commit -m "日志信息"
                注意：此时commit一定不能带具体文件名



